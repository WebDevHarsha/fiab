"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Lightbulb, Sparkles, History, Download } from "lucide-react"

export default function IdeaGenerationPage() {
  const [prompt, setPrompt] = useState("")
  const [ideas, setIdeas] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const newIdea = `Based on "${prompt}":\n\nStartup Idea: AI-powered solution that addresses this market need with innovative technology. This concept focuses on solving real problems for your target audience while maintaining scalability and market viability.`
      setIdeas([newIdea, ...ideas])
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-primary">Idea Generation</h1>
        <p className="text-lg text-secondary">
          Generate innovative startup ideas powered by AI. Describe your interests, skills, or market observations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Generate Your Idea
              </CardTitle>
              <CardDescription>Describe what you're passionate about or what problem you want to solve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="E.g., I'm interested in sustainable fashion and want to help reduce textile waste..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[150px]"
              />
              <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Generate Idea
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {ideas.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Generated Ideas</CardTitle>
                <CardDescription>Your AI-generated startup concepts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ideas.map((idea, index) => (
                  <div key={index} className="rounded-lg border border-border bg-accent/5 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{idea}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline">
                        Refine
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                History
              </CardTitle>
              <CardDescription>Your previous ideas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your idea history will appear here. Generate your first idea to get started!
              </p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Be Specific</p>
                <p className="text-muted-foreground">Include your skills, interests, and target market</p>
              </div>
              <div>
                <p className="font-medium">Think Problems</p>
                <p className="text-muted-foreground">Focus on problems you've experienced or observed</p>
              </div>
              <div>
                <p className="font-medium">Iterate</p>
                <p className="text-muted-foreground">Generate multiple ideas and refine the best ones</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
