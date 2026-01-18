import {Link} from "react-router-dom"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="overflow-hidden flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                <img 
                src="/clicslogo.png" 
                alt="CLICS Logo" 
                className="h-full w-full "
                />
              </div>
              <span className="font-bold text-lg">CLICS</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Centralized Loan Information & Comparison System - Your trusted source for comparing loans from Pakistani
              banks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/schemes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse Loans
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-muted-foreground hover:text-foreground transition-colors">
                  Compare
                </Link>
              </li>
              <li>
                <Link to="/banks" className="text-muted-foreground hover:text-foreground transition-colors">
                  Banks
                </Link>
              </li>
              <li>
                <Link to="/currency" className="text-muted-foreground hover:text-foreground transition-colors">
                  Currency Converter
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-3 mb-4">
              <Link
                to="#"
                className="h-9 w-9 rounded-md bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                to="#"
                className="h-9 w-9 rounded-md bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                to="https://www.linkedin.com/in/fahimullah-fu67/"
                className="h-9 w-9 rounded-md bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                to="#"
                className="h-9 w-9 rounded-md bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">info@clics.pk</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 CLICS. All rights reserved. | University of Mianwali Final Year Project</p>
        </div>
      </div>
    </footer>
  )
}
