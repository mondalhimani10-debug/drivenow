import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-semibold">DriveNow</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium vehicle rentals made simple. From daily drives to special occasions, we have the perfect ride for you.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Vehicles</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/vehicles?category=sedan" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sedans
                </Link>
              </li>
              <li>
                <Link href="/vehicles?category=suv" className="text-muted-foreground hover:text-foreground transition-colors">
                  SUVs
                </Link>
              </li>
              <li>
                <Link href="/vehicles?category=luxury" className="text-muted-foreground hover:text-foreground transition-colors">
                  Luxury
                </Link>
              </li>
              <li>
                <Link href="/vehicles?category=electric" className="text-muted-foreground hover:text-foreground transition-colors">
                  Electric
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/locations" className="text-muted-foreground hover:text-foreground transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            2026 DriveNow. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-foreground transition-colors">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
