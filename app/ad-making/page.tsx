"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, Video, FileText, ImageIcon, Sparkles } from "lucide-react"

export default function AdMakingPage() {
  const [adType, setAdType] = useState("")
  const [productName, setProductName] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAds, setGeneratedAds] = useState<any[]>([])

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedAds([
        {
          type: adType,
          title: "Ad Concept 1",
          content:
            "Engaging hook that captures attention immediately, followed by clear value proposition and strong call-to-action.",
          script:
            "Scene 1: Problem visualization\nScene 2: Solution introduction\nScene 3: Product demonstration\nScene 4: Call to action",
        },
        {
          type: adType,
          title: "Ad Concept 2",
          content:
            "Emotional storytelling approach that connects with audience pain points and presents your product as the hero.",
          script: "Opening: Relatable scenario\nMiddle: Transformation story\nClosing: Compelling offer",
        },
      ])
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-primary">Ad Making</h1>
        <p className="text-lg text-secondary">
          Generate creative ad concepts and scripts for video, text, and image ads.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-accent" />
                Create Your Ad
              </CardTitle>
              <CardDescription>Tell us about your product and we'll generate compelling ad concepts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adType">Ad Type</Label>
                <Select value={adType} onValueChange={setAdType}>
                  <SelectTrigger id="adType">
                    <SelectValue placeholder="Select ad type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Video Ad
                      </div>
                    </SelectItem>
                    <SelectItem value="text">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Text Ad
                      </div>
                    </SelectItem>
                    <SelectItem value="image">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Image Ad
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product/Service Name</Label>
                <Input
                  id="productName"
                  placeholder="E.g., EcoThread"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product, target audience, and key benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !adType || !productName || !description}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Ads...
                  </>
                ) : (
                  <>
                    <Megaphone className="mr-2 h-4 w-4" />
                    Generate Ad Concepts
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedAds.length > 0 && (
            <div className="mt-6 space-y-6">
              {generatedAds.map((ad, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{ad.title}</CardTitle>
                    <CardDescription>
                      {ad.type === "video" && "Video Ad Concept"}
                      {ad.type === "text" && "Text Ad Copy"}
                      {ad.type === "image" && "Image Ad Concept"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border border-border bg-accent/5 p-4">
                      <p className="mb-4 text-sm leading-relaxed">{ad.content}</p>
                      {ad.type === "video" && (
                        <div className="mt-4 border-t border-border pt-4">
                          <p className="mb-2 text-sm font-medium">Script Outline:</p>
                          <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{ad.script}</pre>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Export
                      </Button>
                      <Button size="sm" variant="outline">
                        Generate More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ad Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Hook in 3 Seconds</p>
                <p className="text-muted-foreground">Capture attention immediately with a strong opening</p>
              </div>
              <div>
                <p className="font-medium">Clear Value Prop</p>
                <p className="text-muted-foreground">Communicate benefits quickly and clearly</p>
              </div>
              <div>
                <p className="font-medium">Strong CTA</p>
                <p className="text-muted-foreground">Tell viewers exactly what to do next</p>
              </div>
              <div>
                <p className="font-medium">Test Variations</p>
                <p className="text-muted-foreground">Generate multiple concepts and A/B test</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Platform Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium">Facebook/Instagram:</span> Visual storytelling, 15-30s
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">TikTok:</span> Authentic, trend-driven, 15-60s
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">YouTube:</span> Longer form, educational, 30-90s
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Google Ads:</span> Clear, benefit-focused, concise
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
