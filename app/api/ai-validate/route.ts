import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { summary, evidence } = await req.json()

    const prompt = `
You are a startup idea validation expert.

### Summary (AI-generated)
${JSON.stringify(summary, null, 2)}

### Evidence from real news sources
${JSON.stringify(evidence, null, 2)}

Evaluate the startup based on these **four criteria**:
1. Market Opportunity
2. Uniqueness
3. Feasibility
4. Scalability

For each, assign a score (0–100) and give short grounded feedback using the evidence.
Finally, compute an overall score and list 3–5 concise actionable recommendations.

Return a JSON object in this format:
{
  "overallScore": number,
  "categories": [
    {"name": "Market Opportunity", "score": number, "feedback": string},
    {"name": "Uniqueness", "score": number, "feedback": string},
    {"name": "Feasibility", "score": number, "feedback": string},
    {"name": "Scalability", "score": number, "feedback": string}
  ],
  "recommendations": [string]
}
`

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // 🧹 Clean JSON if Gemini adds extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const validated = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Invalid response format" }

    return NextResponse.json(validated)
  } catch (err: any) {
    console.error("Validation scoring failed:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
