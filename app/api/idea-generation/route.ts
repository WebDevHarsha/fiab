import { CloudClient } from "chromadb";
import { GoogleGenAI } from "@google/genai";
import { Client } from "@gradio/client";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const CHROMA_TENANT_ID = process.env.CHROMA_TENANT_ID!;
const CHROMA_API_KEY = process.env.CHROMA_API_KEY!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

const client = new CloudClient({
  tenant: CHROMA_TENANT_ID,
  database: "FIAB",
  apiKey: CHROMA_API_KEY,
});

async function generateEmbeddings(prompt: string): Promise<any> {
  const client = await Client.connect("krishnasharmak05/fiab");
  const result = await client.predict("/predict", {
    prompt: prompt,
  });
  return result.data;
}

async function getRelevantDocuments(embeddings: number[][]) {
  const collection = await client.getCollection({
    name: "reddit_posts",
  });

  const results = await collection.query({
    queryEmbeddings: embeddings,
    nResults: 5,
  });

  // The CloudClient query returns a QueryResult object that contains a `documents`
  // field (often string[][] when querying multiple embeddings). Flatten and
  // return the document strings instead of calling .map on the result object.
  if (results && (results as any).documents) {
    const documents = (results as any).documents;
    // documents may be string[] or string[][]
    if (Array.isArray(documents[0])) {
      return (documents as string[][]).flat().filter(Boolean);
    }
    return (documents as string[]).filter(Boolean);
  }

  return [];
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "No prompt provided." },
        { status: 400 }
      );
    }
    const docs = await generateEmbeddings(prompt);
    // const docs = await getRelevantDocuments(embeddings);
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-09-2025",
      contents: `You are a startup idea expert. Based on this input:\n${prompt}\n\nand context: ${docs}\nGenerate ONE short, original startup idea (2-3 sentences max). Output only the idea—no extras. Keep it at about 100 characters (at max) as pure text, without markdown.`,
      config: {
        maxOutputTokens: 60,
        temperature: 0.8, 
        topP: 0.9,
      },
    });
    return NextResponse.json({ idea: response.text });
  } catch (error: any) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary", details: error.message },
      { status: 500 }
    );
  }
}
