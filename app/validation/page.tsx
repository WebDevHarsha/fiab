"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Upload, Sparkles } from "lucide-react"
import { extractText } from "@/lib/parseFile" // parser for PDF/DOCX

export default function ValidationPage() {
  const [idea, setIdea] = useState("") // User input or parsed text
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [pdfText, setPdfText] = useState("")
  const [summary, setSummary] = useState<any>(null)
  const [articles, setArticles] = useState<any>(null)
  const [keywords, setKeywords] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- File Upload ---
  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError("")
    setIsUploading(true)
    try {
      const text = await extractText(file)
      setPdfText(text)
      console.log("Extracted text from file:", text)
    } catch (err: any) {
      console.error("File parsing failed:", err)
      setUploadError(err.message || "Failed to parse the uploaded file.")
    } finally {
      setIsUploading(false)
    }
  }

  // --- Summarization API ---
  const summarizeIdea = async (text: string) => {
    if (!text.trim()) throw new Error("Idea text is empty.")
    const response = await fetch("/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    if (!response.ok) throw new Error("Failed to summarize idea.")
    const data = await response.json()
    return data
  }

  // --- Market News API ---
  const fetchMarketNews = async (keywords: string[]) => {
    if (!keywords || keywords.length === 0) return { articles: [] }
    const response = await fetch("/api/fetch-evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords }),
    })
    if (!response.ok) throw new Error("Failed to fetch news articles.")
    const data = await response.json()
    return data
  }

  // --- Validation API ---
  const validateWithGemini = async (summaryData: any, newsData: any) => {
    const response = await fetch("/api/ai-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary: summaryData, articles: newsData }),
    })
    if (!response.ok) throw new Error("Validation API failed.")
    const data = await response.json()
    return data
  }

  // --- Main Handler ---
  const handleValidate = async () => {
    if (!idea.trim() && !pdfText.trim()) {
      setUploadError("Please provide a startup idea or upload a pitch deck.")
      return
    }

    setIsValidating(true)
    setUploadError("")
    setValidationResult(null)

    try {
      // Step 1: Combine inputs
      const fullText = `${idea} ${pdfText}`.trim()

      // Step 2: Summarize
      const summaryData = await summarizeIdea(fullText)
      setSummary(summaryData)
      setKeywords(summaryData.keywords || [])
      console.log("Summary:", summaryData)

      // Step 3: Market Research
      const newsData = await fetchMarketNews(summaryData.keywords || [])
      setArticles(newsData.articles || [])
      console.log("Market Articles:", newsData)

      // Step 4: Validate with Gemini
      const validationData = await validateWithGemini(summaryData, newsData)
      setValidationResult(validationData)
      console.log("Gemini Validation:", validationData)
    } catch (err: any) {
      console.error("Validation failed:", err)
      setUploadError(err.message || "Something went wrong during validation.")
    } finally {
      setIsValidating(false)
    }
  }

  // --- UI ---
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-primary">Idea & Pitch Validation</h1>
        <p className="text-lg text-secondary">
          Get AI-powered validation and feedback on your startup idea or pitch deck.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: Upload + Validation */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                Submit for Validation
              </CardTitle>
              <CardDescription>Paste your idea or upload your pitch deck for analysis</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your startup idea in detail... Include problem, solution, target market, and business model."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="min-h-[200px]"
              />

              <div className="flex items-center gap-4">
                {/* Validate Button */}
                <Button
                  onClick={handleValidate}
                  disabled={isValidating || (!idea.trim() && !pdfText.trim())}
                  className="flex-1"
                >
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

                {/* Upload Button */}
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <Button variant="outline" onClick={handleUploadClick} disabled={isUploading}>
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Parsing..." : "Upload Deck"}
                </Button>
              </div>

              {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
            </CardContent>
          </Card>

          {/* VALIDATION RESULTS */}
          {validationResult && (
            <>
              {/* Overall Score */}
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

              {/* Category Breakdown */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Detailed analysis by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {validationResult.categories?.map((category: any, index: number) => (
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

              {/* Recommendations */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Next steps to strengthen your idea</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {validationResult.recommendations?.map((rec: string, index: number) => (
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

        {/* RIGHT: Info Card */}
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
