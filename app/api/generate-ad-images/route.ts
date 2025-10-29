import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { prompt, numberOfImages = 4 } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Initialize Google GenAI with API key from environment
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    // Generate images using Imagen
    const response = await ai.models.generateImages({
      model: "gemini-2.0-flash-preview-image-generation",
      prompt: prompt,
      config: {
        numberOfImages: numberOfImages,
      },
    });

    // Convert generated images to base64 data URLs
    const images = (response.generatedImages ?? []).map((generatedImage: any) => {
      const imgBytes = generatedImage?.image?.imageBytes ?? "";
      return {
        imageData: `data:image/png;base64,${imgBytes}`,
      };
    });

    return NextResponse.json({
      success: true,
      images: images,
    });
  } catch (error: any) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate images" },
      { status: 500 }
    );
  }
}
