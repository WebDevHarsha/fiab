"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Upload, Sparkles } from "lucide-react"

export default function ValidationPage() {
  const [idea, setIdea] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [pdfText, setPdfText] = useState("")
  const [summary, setSummary] = useState<any>(null)

  const handleValidate = async () => {
    setIsValidating(true)
    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: idea + pdfText }),
      })

      const data = await response.json()
      setSummary(data)
      console.log("Summary:", data)
    } catch (err) {
      console.error("Validation request failed:", err)
    }

    setTimeout(() => {
      setValidationResult({
        overallScore: 78,
        categories: [
          { name: "Market Opportunity", score: 85, feedback: "Strong market potential with clear demand" },
          { name: "Uniqueness", score: 72, feedback: "Good differentiation but competitive space" },
          { name: "Feasibility", score: 80, feedback: "Technically achievable with current resources" },
          { name: "Scalability", score: 75, feedback: "Good growth potential with proper execution" },
        ],
        recommendations: [
          "Focus on a specific niche market initially",
          "Develop a clear competitive moat",
          "Build an MVP to validate assumptions",
          "Identify key metrics for success",
        ],
      })
      setIsValidating(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-primary">Idea & Pitch Validation</h1>
        <p className="text-lg text-secondary">
          Get AI-powered validation and feedback on your startup idea or pitch deck.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                Submit for Validation
              </CardTitle>
              <CardDescription>Paste your idea or upload your pitch deck for comprehensive analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your startup idea in detail... Include the problem, solution, target market, and business model."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="min-h-[200px]"
              />

              <div className="flex items-center gap-4">
                <Button onClick={handleValidate} disabled={isValidating || !idea.trim()} className="flex-1">
                  {isValidating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Validate Idea
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Deck
                </Button>
              </div>
            </CardContent>
          </Card>

          {validationResult && (
            <>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Validation Score</CardTitle>
                  <CardDescription>Overall assessment of your idea</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="mb-4 text-6xl font-bold text-primary">
                      {validationResult.overallScore}
                      <span className="text-3xl text-muted-foreground">/100</span>
                    </div>
                    <Progress value={validationResult.overallScore} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Detailed analysis by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {validationResult.categories.map((category: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm font-semibold text-primary">{category.score}/100</span>
                      </div>
                      <Progress value={category.score} className="h-2" />
                      <p className="text-sm text-muted-foreground">{category.feedback}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Next steps to strengthen your idea</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {validationResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        <span className="text-sm leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>What We Analyze</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Market Opportunity</p>
                <p className="text-muted-foreground">Size, growth potential, and demand</p>
              </div>
              <div>
                <p className="font-medium">Uniqueness</p>
                <p className="text-muted-foreground">Differentiation and competitive advantage</p>
              </div>
              <div>
                <p className="font-medium">Feasibility</p>
                <p className="text-muted-foreground">Technical and operational viability</p>
              </div>
              <div>
                <p className="font-medium">Scalability</p>
                <p className="text-muted-foreground">Growth potential and expansion opportunities</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
