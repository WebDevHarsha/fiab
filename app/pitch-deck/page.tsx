"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Download, Sparkles, Loader2, CheckCircle2, Edit } from "lucide-react"

interface Slide {
  index: number
  title: string
  headline: string
  bulletPoints: string[]
  description: string
}

interface PitchContent {
  slides: Slide[]
}

export default function PitchDeckPage() {
  const [formData, setFormData] = useState({
    startupName: "",
    concept: "",
    problem: "",
    solution: "",
  })
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pitchContent, setPitchContent] = useState<PitchContent | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateContent = async () => {
    setIsGeneratingContent(true)
    setError(null)
    
    try {
      console.log("Sending request to generate pitch content...", formData);
      
      const response = await fetch("/api/generate-pitch-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("Response status:", response.status);
      
      const data = await response.json()
      console.log("Response data:", data);

      if (!response.ok) {
        console.error("API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          details: data.details,
          type: data.type
        });
        
        // Create detailed error message
        let errorMessage = data.error || "Failed to generate pitch content";
        if (data.details) {
          errorMessage += `\n\nDetails: ${data.details}`;
        }
        if (data.type) {
          errorMessage += `\n\nError Type: ${data.type}`;
        }
        
        throw new Error(errorMessage);
      }

      // Validate response structure
      if (!data.slides || !Array.isArray(data.slides)) {
        console.error("Invalid response structure:", data);
        throw new Error("Invalid response structure from API. Expected slides array but got: " + JSON.stringify(data).substring(0, 100));
      }

      console.log("Successfully received", data.slides.length, "slides");
      setPitchContent(data)
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate pitch content. Please try again."
      setError(errorMessage)
      console.error("Frontend Error:", err)
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!pitchContent?.slides) return

    setIsGeneratingPDF(true)
    setError(null)
    
    try {
      console.log("Sending request to generate PDF...");
      
      const response = await fetch("/api/generate-pitch-deck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slides: pitchContent.slides }),
      })

      const result = await response.json()
      console.log("PDF Generation Response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate PDF")
      }

      // Pluslide returns a taskId - show success message
      if (result.taskId) {
        setError(`✅ Presentation generation started! Task ID: ${result.taskId}\n\nNote: Pluslide generates presentations asynchronously. Check the Pluslide dashboard to download your presentation once it's ready.`)
      } else if (result.pdfUrl) {
        setPdfUrl(result.pdfUrl)
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate PDF")
      console.error("Error:", err)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank")
    }
  }

  const sections = [
    { title: "Cover", description: "Title and tagline" },
    { title: "Problem", description: "What problem are you solving?" },
    { title: "Solution", description: "Your unique solution" },
    { title: "Market Size", description: "Total addressable market" },
    { title: "Product", description: "How it works" },
    { title: "Traction", description: "Current progress" },
    { title: "Business Model", description: "How you make money" },
    { title: "Competition", description: "Competitive landscape" },
    { title: "Team", description: "Who's building this" },
    { title: "Financials & Ask", description: "Investment opportunity" },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-primary">Pitch Deck Generator</h1>
        <p className="text-lg text-secondary">
          Create a professional investor pitch deck in minutes. AI-powered generation for all essential sections.
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">Error Generating Content</h3>
                <p className="text-sm text-red-700 whitespace-pre-wrap">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  💡 Check your browser console (F12) for more details
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Startup Information
              </CardTitle>
              <CardDescription>Tell us about your startup to generate a customized pitch deck</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startupName">Startup Name *</Label>
                <Input
                  id="startupName"
                  placeholder="E.g., EcoThread"
                  value={formData.startupName}
                  onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="concept">One-Line Concept *</Label>
                <Input
                  id="concept"
                  placeholder="E.g., Sustainable fashion marketplace connecting eco-conscious consumers with ethical brands"
                  value={formData.concept}
                  onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem">Problem Statement (Optional)</Label>
                <Textarea
                  id="problem"
                  placeholder="What problem does your startup solve?"
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution">Your Solution (Optional)</Label>
                <Textarea
                  id="solution"
                  placeholder="How does your product/service solve this problem?"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerateContent}
                disabled={isGeneratingContent || !formData.startupName || !formData.concept}
                className="w-full"
              >
                {isGeneratingContent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Pitch Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {pitchContent && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Your Pitch Deck Content
                    </CardTitle>
                    <CardDescription>Review the generated slides</CardDescription>
                  </div>
                  <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating PDF...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate PDF
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pitchContent.slides.map((slide, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between rounded-lg border border-border bg-accent/5 p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-medium">
                            {index + 1}
                          </span>
                          <p className="font-semibold text-lg">{slide.title}</p>
                        </div>
                        <p className="font-medium text-sm text-primary mb-2">{slide.headline}</p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-8 list-disc">
                          {slide.bulletPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2 italic">{slide.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {pdfUrl && (
            <Card className="mt-6 border-green-500 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700">PDF Ready!</CardTitle>
                <CardDescription>Your pitch deck is ready to download</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDownloadPDF} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Pitch Deck PDF
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Deck Sections</CardTitle>
              <CardDescription>Standard pitch deck structure</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {sections.map((section, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{section.title}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
