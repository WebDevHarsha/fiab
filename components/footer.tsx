import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="text-xl font-bold text-primary-foreground">F</span>
              </div>
              <span className="text-xl font-bold text-primary">FIAB</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Startups, Simplified.</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/idea-generation" className="text-muted-foreground hover:text-foreground">
                  Idea Generator
                </Link>
              </li>
              <li>
                <Link href="/pitch-deck" className="text-muted-foreground hover:text-foreground">
                  Pitch Deck
                </Link>
              </li>
              <li>
                <Link href="/validation" className="text-muted-foreground hover:text-foreground">
                  Validation
                </Link>
              </li>
              <li>
                <Link href="/ad-making" className="text-muted-foreground hover:text-foreground">
                  Ad Making
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FIAB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
