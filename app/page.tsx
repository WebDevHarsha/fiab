import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, FileText, CheckCircle, Megaphone, Target, LayoutDashboard } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: Lightbulb,
      title: "Idea Generation",
      description: "Generate innovative startup ideas powered by AI. Get instant feedback and refinement suggestions.",
      href: "/idea-generation",
    },
    {
      icon: FileText,
      title: "Pitch Deck Generator",
      description: "Create professional pitch decks in minutes. Auto-generate all essential sections for investors.",
      href: "/pitch-deck",
    },
    {
      icon: CheckCircle,
      title: "Idea Validation",
      description: "Validate your startup idea with AI-powered analysis. Get scores, feedback, and recommendations.",
      href: "/validation",
    },
    {
      icon: Megaphone,
      title: "Ad Making",
      description: "Generate creative ad concepts and scripts. Create compelling video, text, and image ads.",
      href: "/ad-making",
    },
    {
      icon: Target,
      title: "PMF & GTM Strategy",
      description: "Build your product-market fit and go-to-market strategy. Define target users and channels.",
      href: "/pmf-gtm",
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      description: "Track all your projects and tools in one place. Monitor progress and access your work history.",
      href: "/dashboard",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-accent/10 px-4 py-24 md:py-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-primary">
              Your AI-Powered Startup Toolkit
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-primary md:text-6xl lg:text-7xl">
              Startups, Simplified.
            </h1>
            <p className="mb-8 text-pretty text-lg text-secondary md:text-xl">
              From idea to launch, FIAB provides everything founders need to build, validate, and grow their startups
              with AI-powered tools.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/idea-generation">Try Idea Generator</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="/dashboard">Launch FIAB</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-primary md:text-4xl">
              Everything You Need to Launch
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-lg text-secondary">
              Powerful AI tools designed specifically for founders. Build faster, validate smarter, and launch with
              confidence.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Link key={feature.title} href={feature.href}>
                  <Card className="group h-full transition-all hover:shadow-lg hover:shadow-accent/20">
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-primary transition-colors group-hover:bg-accent/30">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary px-4 py-24 text-primary-foreground">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-balance text-3xl font-bold md:text-4xl">Ready to Build Your Startup?</h2>
            <p className="mb-8 text-pretty text-lg opacity-90">
              Join thousands of founders using FIAB to turn their ideas into successful businesses.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
