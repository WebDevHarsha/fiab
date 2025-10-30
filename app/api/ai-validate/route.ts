import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Define the validation result structure
interface ValidationCategory {
  name: string;
  score: number;
  feedback: string;
}

interface ValidationResult {
  overallScore: number;
  categories: ValidationCategory[];
  recommendations: string[];
  error?: string;
  raw?: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { summary, articles } = await req.json();

    const prompt = `
You are a startup pitch validator AI.
Use the following context (grounding data) to assess the startup idea.

### Summary:
${JSON.stringify(summary, null, 2)}

### Market Research (Articles):
${JSON.stringify(articles, null, 2)}

Based on this information, provide a JSON structured score in the exact format:

{
  "overallScore": number (0-100),
  "categories": [
    { "name": "Market Opportunity", "score": number, "feedback": string },
    { "name": "Uniqueness", "score": number, "feedback": string },
    { "name": "Feasibility", "score": number, "feedback": string },
    { "name": "Scalability", "score": number, "feedback": string }
  ],
  "recommendations": [ "string", "string", "string", ... ]
}

Respond **only** with the JSON output.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\s*/g, "").replace(/```/g, "").trim();

    // Try to parse JSON safely
    let jsonResponse: ValidationResult;
    try {
      jsonResponse = JSON.parse(text);
    } catch {
      jsonResponse = {
        overallScore: 0,
        categories: [],
        recommendations: [],
        error: "Failed to parse model output",
        raw: text,
      };
    }

    return new Response(JSON.stringify(jsonResponse), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in /api/validate:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
