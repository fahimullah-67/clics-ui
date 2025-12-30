import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { Button } from "../components/custom-ui/Button"
import { Input } from "../components/custom-ui/Input"
import { Card, CardContent } from "../components/custom-ui/Card"

import {
  Search,
  TrendingUp,
  Shield,
  Zap,
  MessageSquare,
  Bell,
  Building2,
} from "lucide-react"

import {
  fadeUp,
  scrollFadeUp,
  scrollStagger,
} from "../animations/gsapAnimations"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fadeUp(".hero-title")
    fadeUp(".hero-subtitle", 0.2)
    fadeUp(".hero-search", 0.4)

    scrollStagger(".feature-card")
    scrollStagger(".bank-card")
    scrollFadeUp(".cta-section")
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const query = searchQuery.toLowerCase()
    const types = ["personal", "car", "home", "student", "business"]
    const match = types.find((t) => query.includes(t))

    navigate(match ? `/schemes?type=${match}` : `/schemes?search=${searchQuery}`)
  }

  return (
    <main className="flex-1">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
            Compare Banking Schemes
          </h1>

          <p className="hero-subtitle mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore and compare banking schemes from Pakistan’s leading banks
          </p>

          <div className="hero-search max-w-2xl mx-auto mt-8">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search for personal, car, home, student, or business loans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12"
              />
              <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700">
                <Search className="h-5 w-5" />
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {["personal", "car", "home", "student", "business"].map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  size="sm"
                  className="capitalize"
                  onClick={() => navigate(`/schemes?type=${t}`)}
                >
                  {t} Loans
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything you need to find the perfect loan
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Search, title: "Comprehensive Search", desc: "Search all loan types" },
              { icon: TrendingUp, title: "Side-by-Side Compare", desc: "Compare rates & fees" },
              { icon: MessageSquare, title: "AI Chatbot", desc: "Evidence-based answers" },
              { icon: Shield, title: "Verified Sources", desc: "Original bank documents" },
              { icon: Bell, title: "Real-Time Alerts", desc: "Get notified on changes" },
              { icon: Zap, title: "Export & Share", desc: "PDF & CSV export" },
            ].map((f, i) => (
              <Card
                key={i}
                className="feature-card bg-white border hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition"
              >
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <f.icon className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-600">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BANKS ================= */}
      <section className="py-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">
          Trusted by data from leading banks
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {["HBL", "UBL", "MCB", "ABL", "Meezan", "Faysal", "Askari", "JS Bank"].map((b) => (
            <Card key={b} className="bank-card">
              <CardContent className="p-6 text-center">
                <Building2 className="mx-auto mb-2 text-gray-400" />
                <span className="text-sm font-medium">{b}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta-section py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white">
        <div className="text-center px-4">
          <h2 className="text-4xl font-bold mb-4">
            Ready to find your perfect loan?
          </h2>
          <p className="mb-8 opacity-90">
            Join thousands who trust CLICS for smart decisions
          </p>

          <div className="flex gap-4 justify-center">
            <Button variants="default" className="bg-white ">
        
              <Link className="text-blue-700 hover:text-white " to="/schemes">Browse Loans</Link>
            </Button>
            <Button className="border border-white text-white bg-transparent">
              <Link to="/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
