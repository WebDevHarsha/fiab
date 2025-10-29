"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Target, Users, TrendingUp, DollarSign, Sparkles } from "lucide-react"

export default function PMFGTMPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    targetCustomer: "",
    valueProposition: "",
  })
  const [strategy, setStrategy] = useState<any>(null)

  const steps = [
    { number: 1, title: "Product Info", icon: Target },
    { number: 2, title: "Target Market", icon: Users },
    { number: 3, title: "Strategy", icon: TrendingUp },
    { number: 4, title: "Metrics", icon: DollarSign },
  ]

  const handleGenerate = () => {
    setStrategy({
      targetUsers: [
        {
          segment: "Early Adopters",
          description: "Tech-savvy users looking for innovative solutions",
          size: "10K-50K",
        },
        { segment: "SMB Owners", description: "Small business owners seeking efficiency", size: "50K-200K" },
      ],
      channels: [
        { name: "Content Marketing", priority: "High", rationale: "Build authority and organic traffic" },
        { name: "LinkedIn Outreach", priority: "High", rationale: "Direct access to decision makers" },
        { name: "Product Hunt", priority: "Medium", rationale: "Early adopter community" },
        { name: "Partnerships", priority: "Medium", rationale: "Leverage existing networks" },
      ],
      metrics: [
        { name: "Customer Acquisition Cost (CAC)", target: "$50-100" },
        { name: "Lifetime Value (LTV)", target: "$500+" },
        { name: "Conversion Rate", target: "2-5%" },
        { name: "Churn Rate", target: "<5%" },
      ],
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-primary">PMF & GTM Strategy</h1>
        <p className="text-lg text-secondary">
          Build your product-market fit and go-to-market strategy with AI guidance.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent/20 text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="mt-2 text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-1 flex-1 ${currentStep > step.number ? "bg-primary" : "bg-accent/20"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Build Your Strategy</CardTitle>
              <CardDescription>Answer a few questions to generate your PMF and GTM strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="Your product name"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription">Product Description</Label>
                <Textarea
                  id="productDescription"
                  placeholder="What does your product do?"
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetCustomer">Target Customer</Label>
                <Textarea
                  id="targetCustomer"
                  placeholder="Who is your ideal customer?"
                  value={formData.targetCustomer}
                  onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valueProposition">Value Proposition</Label>
                <Textarea
                  id="valueProposition"
                  placeholder="What unique value do you provide?"
                  value={formData.valueProposition}
                  onChange={(e) => setFormData({ ...formData, valueProposition: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!formData.productName || !formData.productDescription}
                className="w-full"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Strategy
              </Button>
            </CardContent>
          </Card>

          {strategy && (
            <>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Target User Segments
                  </CardTitle>
                  <CardDescription>Who you should focus on first</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {strategy.targetUsers.map((user: any, index: number) => (
                    <div key={index} className="rounded-lg border border-border bg-accent/5 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold">{user.segment}</h4>
                        <span className="text-sm text-muted-foreground">{user.size} users</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Go-To-Market Channels
                  </CardTitle>
                  <CardDescription>Recommended channels and tactics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {strategy.channels.map((channel: any, index: number) => (
                    <div key={index} className="rounded-lg border border-border bg-accent/5 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold">{channel.name}</h4>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            channel.priority === "High"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          {channel.priority} Priority
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{channel.rationale}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    Key Metrics
                  </CardTitle>
                  <CardDescription>Track these metrics for success</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {strategy.metrics.map((metric: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-accent/5 p-4"
                    >
                      <span className="font-medium">{metric.name}</span>
                      <span className="text-sm text-primary">{metric.target}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Strategy Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Product-Market Fit</p>
                <p className="text-muted-foreground">Ensure your product solves a real problem for a specific market</p>
              </div>
              <div>
                <p className="font-medium">Target Segmentation</p>
                <p className="text-muted-foreground">Identify and prioritize your ideal customer segments</p>
              </div>
              <div>
                <p className="font-medium">Channel Strategy</p>
                <p className="text-muted-foreground">Choose the right channels to reach your audience</p>
              </div>
              <div>
                <p className="font-medium">Metrics & KPIs</p>
                <p className="text-muted-foreground">Define success metrics and track progress</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
