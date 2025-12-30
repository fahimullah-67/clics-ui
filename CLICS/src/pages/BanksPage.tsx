"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight } from "lucide-react"
import { loanSchemes } from "@/lib/mock-data"
import gsap from "gsap"

const banks = [
  { id: "hbl", name: "HBL", fullName: "Habib Bank Limited", color: "from-red-600 to-red-700" },
  { id: "ubl", name: "UBL", fullName: "United Bank Limited", color: "from-green-600 to-green-700" },
  { id: "mcb", name: "MCB", fullName: "Muslim Commercial Bank", color: "from-blue-600 to-blue-700" },
  { id: "abl", name: "ABL", fullName: "Allied Bank Limited", color: "from-purple-600 to-purple-700" },
  { id: "meezan", name: "Meezan", fullName: "Meezan Bank", color: "from-teal-600 to-teal-700" },
  { id: "alfah", name: "Alfah", fullName: "Bank Alfalah", color: "from-orange-600 to-orange-700" },
  { id: "faysal", name: "Faysal", fullName: "Faysal Bank", color: "from-indigo-600 to-indigo-700" },
  { id: "sc", name: "SC", fullName: "Standard Chartered", color: "from-cyan-600 to-cyan-700" },
]

export default function BanksPage() {
  const navigate = useNavigate()
  const [bankStats, setBankStats] = useState<Record<string, number>>({})

  useEffect(() => {
    const stats: Record<string, number> = {}
    banks.forEach((bank) => {
      stats[bank.id] = loanSchemes.filter((s) => s.bank.toLowerCase() === bank.name.toLowerCase()).length
    })
    setBankStats(stats)

    gsap.fromTo(
      ".bank-card",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" },
    )
  }, [])

  const handleViewSchemes = (bankName: string) => {
    navigate(`/schemes?bank=${bankName}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Partner Banks</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore loan schemes from Pakistan's leading financial institutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {banks.map((bank) => (
            <Card
              key={bank.id}
              className="bank-card overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-0"
            >
              <div className={`h-32 bg-gradient-to-br ${bank.color} flex items-center justify-center`}>
                <Building2 className="w-16 h-16 text-white" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{bank.name}</CardTitle>
                <CardDescription>{bank.fullName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Available Schemes:</span>
                    <span className="font-bold text-blue-600">{bankStats[bank.id] || 0}</span>
                  </div>
                  <Button onClick={() => handleViewSchemes(bank.name)} className="w-full bg-blue-600 hover:bg-blue-700">
                    View Loan Schemes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
