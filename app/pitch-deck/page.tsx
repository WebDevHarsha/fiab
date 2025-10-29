"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Download, Sparkles } from "lucide-react"

export default function PitchDeckPage() {
  const [formData, setFormData] = useState({
    startupName: "",
    concept: "",
    problem: "",
    solution: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [deckGenerated, setDeckGenerated] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setDeckGenerated(true)
      setIsGenerating(false)
    }, 2000)
  }

  const sections = [
    { title: "Problem", description: "What problem are you solving?" },
    { title: "Solution", description: "Your unique solution" },
    { title: "Market Size", description: "Total addressable market" },
    { title: "Product", description: "How it works" },
    { title: "Traction", description: "Current progress" },
    { title: "Business Model", description: "How you make money" },
    { title: "Competition", description: "Competitive landscape" },
    { title: "Team", description: "Who's building this" },
    { title: "Financials", description: "Projections and metrics" },
    { title: "Ask", description: "What you're raising" },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-primary">Pitch Deck Generator</h1>
        <p className="text-lg text-secondary">
          Create a professional investor pitch deck in minutes. AI-powered generation for all essential sections.
        </p>
      </div>

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
                <Label htmlFor="startupName">Startup Name</Label>
                <Input
                  id="startupName"
                  placeholder="E.g., EcoThread"
                  value={formData.startupName}
                  onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="concept">One-Line Concept</Label>
                <Input
                  id="concept"
                  placeholder="E.g., Sustainable fashion marketplace connecting eco-conscious consumers with ethical brands"
                  value={formData.concept}
                  onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem">Problem Statement</Label>
                <Textarea
                  id="problem"
                  placeholder="What problem does your startup solve?"
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution">Your Solution</Label>
                <Textarea
                  id="solution"
                  placeholder="How does your product/service solve this problem?"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !formData.startupName || !formData.concept}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Deck...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Pitch Deck
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {deckGenerated && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Pitch Deck</CardTitle>
                <CardDescription>Review and customize each section before downloading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-accent/5 p-4"
                    >
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="mt-6 w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download as PDF
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
