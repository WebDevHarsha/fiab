import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }

    const prompt = `
You are an expert startup analyst.
Analyze the following pitch deck text and produce a **detailed summary**.

### Output Format
Respond **only** in valid JSON (no explanations, no markdown).
The JSON must have the following structure:

{
  "startupName": "",
  "mission": "",
  "problem": "",
  "solution": "",
  "marketOpportunity": "",
  "businessModel": "",
  "traction": "",
  "competition": "",
  "funding": "",
  "team": "",
  "strengths": "",
  "weaknesses": "",
  "overallSummary": ""
}

### Pitch Deck Text:
${text}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      },
    });

    let summaryText = result.response.text();
    console.log("Raw Summary Text:", summaryText);
    summaryText = summaryText
      .replace(/```json\s*/g, "")   // remove ```json
      .replace(/```/g, "")          // remove closing ```
      .trim();
    // Try parsing JSON safely
    let summary;
    try {
      summary = JSON.parse(summaryText);
    } catch {
      console.error("Error parsing summary");
      return NextResponse.json(
        { error: "Failed to parse summary", },
        { status: 500 }
      );
    }

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary", details: error.message },
      { status: 500 }
    );
  }
}
