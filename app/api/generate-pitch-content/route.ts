import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const { startupName, concept, problem, solution } = await req.json();

    console.log("=== Pitch Content Generation Request ===");
    console.log("Startup Name:", startupName);
    console.log("Concept:", concept);

    if (!startupName || !concept) {
      return NextResponse.json(
        { error: "Startup name and concept are required." },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is not configured!");
      return NextResponse.json(
        { error: "Google API key is not configured. Please add GOOGLE_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    console.log("API Key present:", process.env.GOOGLE_API_KEY.substring(0, 10) + "...");


    const prompt = `
You are an expert pitch deck consultant and investor advisor.
Generate comprehensive pitch deck content for the following startup:

**Startup Name:** ${startupName}
**Concept:** ${concept}
**Problem:** ${problem || "Not specified"}
**Solution:** ${solution || "Not specified"}

Create a complete pitch deck with 10 slides. For each slide, provide:
- A compelling headline
- 2-3 detailed bullet points
- Supporting data or statistics (realistic estimates if not provided)
- A brief description/narrative

### CRITICAL INSTRUCTIONS
You must respond with ONLY a valid JSON object. Do not include:
- Markdown code blocks (no \`\`\`json or \`\`\`)
- Any explanatory text before or after the JSON
- Any comments in the JSON

Start your response directly with { and end with }

The JSON must have EXACTLY this structure:

{
  "slides": [
    {
      "index": 0,
      "title": "Cover",
      "headline": "One-line compelling tagline",
      "bulletPoints": ["Company name", "Date", "Presented by"],
      "description": "Brief intro narrative"
    },
    {
      "index": 1,
      "title": "Problem",
      "headline": "The problem headline",
      "bulletPoints": ["Point 1", "Point 2", "Point 3"],
      "description": "Problem description"
    },
    {
      "index": 2,
      "title": "Solution",
      "headline": "Our solution headline",
      "bulletPoints": ["Feature 1", "Feature 2", "Feature 3"],
      "description": "Solution description"
    },
    {
      "index": 3,
      "title": "Market Size",
      "headline": "Market opportunity headline",
      "bulletPoints": ["TAM: $X billion", "SAM: $X billion", "SOM: $X million"],
      "description": "Market analysis"
    },
    {
      "index": 4,
      "title": "Product",
      "headline": "How it works",
      "bulletPoints": ["Step 1", "Step 2", "Step 3"],
      "description": "Product walkthrough"
    },
    {
      "index": 5,
      "title": "Traction",
      "headline": "Our progress",
      "bulletPoints": ["Milestone 1", "Milestone 2", "Milestone 3"],
      "description": "Current traction"
    },
    {
      "index": 6,
      "title": "Business Model",
      "headline": "How we make money",
      "bulletPoints": ["Revenue stream 1", "Revenue stream 2", "Revenue stream 3"],
      "description": "Business model explanation"
    },
    {
      "index": 7,
      "title": "Competition",
      "headline": "Competitive landscape",
      "bulletPoints": ["Our advantage 1", "Our advantage 2", "Our advantage 3"],
      "description": "Competitive analysis"
    },
    {
      "index": 8,
      "title": "Team",
      "headline": "Meet the team",
      "bulletPoints": ["Founder 1 - Role & Background", "Founder 2 - Role & Background", "Key advisor"],
      "description": "Team overview"
    },
    {
      "index": 9,
      "title": "Financials & Ask",
      "headline": "Investment opportunity",
      "bulletPoints": ["Raising: $X million", "Valuation: $X million", "Use of funds"],
      "description": "Financial projections and ask"
    }
  ]
}

Make the content specific, professional, and investor-ready. Use realistic numbers and data.
`;

    console.log("Sending request to Gemini API...");

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    console.log("Response received from Gemini");

    let responseText = result.response.text();
    console.log("Raw Response length:", responseText.length);
    console.log("Raw Response preview:", responseText.substring(0, 200));

    // Clean up any potential markdown or extra text
    responseText = responseText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .replace(/^[^{]*/, "") // Remove anything before the first {
      .replace(/[^}]*$/, "") // Remove anything after the last }
      .trim();

    console.log("Cleaned Response length:", responseText.length);
    console.log("Cleaned Response preview:", responseText.substring(0, 200));

    // Parse JSON
    let pitchContent;
    try {
      pitchContent = JSON.parse(responseText);
      
      // Validate structure
      if (!pitchContent.slides || !Array.isArray(pitchContent.slides)) {
        throw new Error("Invalid response structure: missing slides array");
      }

      // Ensure all slides have required fields
      pitchContent.slides = pitchContent.slides.map((slide: any, index: number) => ({
        index: slide.index ?? index,
        title: slide.title || `Slide ${index + 1}`,
        headline: slide.headline || "",
        bulletPoints: Array.isArray(slide.bulletPoints) 
          ? slide.bulletPoints.slice(0, 3) 
          : ["Point 1", "Point 2", "Point 3"],
        description: slide.description || "",
      }));

    } catch (parseError) {
      console.error("=== Parse Error ===");
      console.error("Error:", parseError);
      console.error("Response text length:", responseText.length);
      console.error("First 500 chars:", responseText.substring(0, 500));
      console.error("Last 500 chars:", responseText.substring(Math.max(0, responseText.length - 500)));
      
      return NextResponse.json(
        { 
          error: "Failed to parse pitch content", 
          details: parseError instanceof Error ? parseError.message : "Unknown error",
          rawResponse: responseText.substring(0, 500) // First 500 chars for debugging
        },
        { status: 500 }
      );
    }

    console.log("Successfully parsed response with", pitchContent.slides.length, "slides");
    return NextResponse.json(pitchContent);
  } catch (error: any) {
    console.error("=== Fatal Error ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        error: "Failed to generate pitch content", 
        details: error.message,
        type: error.constructor.name
      },
      { status: 500 }
    );
  }
}
