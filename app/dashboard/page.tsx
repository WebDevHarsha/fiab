"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, FileText, CheckCircle, Megaphone, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"

export default function DashboardPage() {
  const tools = [
    {
      icon: Lightbulb,
      title: "Idea Generation",
      description: "3 ideas generated",
      href: "/idea-generation",
      color: "text-yellow-500",
    },
    {
      icon: FileText,
      title: "Pitch Decks",
      description: "1 deck created",
      href: "/pitch-deck",
      color: "text-blue-500",
    },
    {
      icon: CheckCircle,
      title: "Validations",
      description: "2 ideas validated",
      href: "/validation",
      color: "text-green-500",
    },
    {
      icon: Megaphone,
      title: "Ad Campaigns",
      description: "5 ads generated",
      href: "/ad-making",
      color: "text-purple-500",
    },
    {
      icon: Target,
      title: "GTM Strategies",
      description: "1 strategy built",
      href: "/pmf-gtm",
      color: "text-red-500",
    },
  ]

  const recentActivity = [
    { action: "Generated startup idea", tool: "Idea Generation", time: "2 hours ago" },
    { action: "Created pitch deck", tool: "Pitch Deck", time: "1 day ago" },
    { action: "Validated idea", tool: "Validation", time: "2 days ago" },
    { action: "Generated ad concepts", tool: "Ad Making", time: "3 days ago" },
  ]

  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-primary">
            Dashboard
          </h1>
          <p className="text-lg text-secondary">
            Welcome back{user?.displayName ? `, ${user.displayName}` : ""}! Here's an overview of your startup toolkit activity.
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">12</p>
            <p className="mt-2 text-sm opacity-90">Across all tools</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent to-accent/80 text-primary">
          <CardHeader>
            <CardTitle className="text-2xl">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">5</p>
            <p className="mt-2 text-sm opacity-90">New items created</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">7</p>
            <p className="mt-2 text-sm opacity-90">Days active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Tools</CardTitle>
              <CardDescription>Quick access to all FIAB features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link key={tool.title} href={tool.href}>
                      <Card className="group transition-all hover:shadow-lg hover:shadow-accent/20">
                        <CardContent className="flex items-start gap-4 p-6">
                          <div className={`${tool.color}`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold">{tool.title}</h3>
                            <p className="text-sm text-muted-foreground">{tool.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start working on your startup</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/idea-generation">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate Idea
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/pitch-deck">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Pitch Deck
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/validation">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Validate Idea
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.tool} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tips & Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Start with Validation</p>
                <p className="text-muted-foreground">Validate your idea before building</p>
              </div>
              <div>
                <p className="font-medium">Iterate Quickly</p>
                <p className="text-muted-foreground">Use feedback to refine your approach</p>
              </div>
              <div>
                <p className="font-medium">Focus on PMF</p>
                <p className="text-muted-foreground">Product-market fit is everything</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  )
}
