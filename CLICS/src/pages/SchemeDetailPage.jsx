"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/custom-ui/Card"
import { Button } from "../components/custom-ui/Button"
import { Badge } from "../components/custom-ui/Badge"

import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  Building2,
  CheckCircle2,
} from "lucide-react"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function SchemeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef(null)

  const [scheme, setScheme] = useState(null)

  /* ✅ MOCK DATA INSIDE PAGE (as requested) */
  const [loanSchemes] = useState([
    {
      id: "1",
      name: "HBL Car Financing",
      bank: "HBL",
      type: "Car Financing",
      interestRate: "14.5% - 16%",
      minAmount: 500000,
      maxAmount: 5000000,
      tenure: "1-7 years",
      processingFee: "1%",
      features: [
        "Quick Approval",
        "Up to 90% Financing",
        "Flexible Tenure",
        "Insurance Options",
      ],
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      name: "UBL Personal Loan",
      bank: "UBL",
      type: "Personal Loan",
      interestRate: "16% - 18%",
      minAmount: 100000,
      maxAmount: 3000000,
      tenure: "1-5 years",
      processingFee: "1.5%",
      features: [
        "No Collateral",
        "Same Day Disbursement",
        "Flexible Repayment",
      ],
      lastUpdated: "2024-01-14",
    },
    {
      id: "3",
      name: "MCB Home Loan",
      bank: "MCB",
      type: "Home Loan",
      interestRate: "13% - 15%",
      minAmount: 1000000,
      maxAmount: 50000000,
      tenure: "5-25 years",
      processingFee: "0.5%",
      features: ["Low Interest", "Long Tenure", "Up to 85% Financing"],
      lastUpdated: "2024-01-16",
    },
  ])

  /* ✅ FIND SCHEME + GSAP */
  useEffect(() => {
    const found = loanSchemes.find((s) => s.id === id)
    setScheme(found)

    if (!found) return

    /* Page intro animation */
    gsap.fromTo(
      ".page-animate",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )

    /* Scroll-based animation */
    gsap.utils.toArray(".detail-section").forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
        }
      )
    })
  }, [id, loanSchemes])

  /* ❌ NOT FOUND */
  if (!scheme) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Scheme not found
          </h2>
          <Button onClick={() => navigate("/schemes")}>
            Back to Schemes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 page-animate"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/schemes")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Schemes
        </Button>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <Card className="detail-section shadow-xl border-0 overflow-hidden">
            <div
              className={`h-32 bg-gradient-to-r ${
                scheme.type === "Car Financing"
                  ? "from-blue-600 to-blue-700"
                  : scheme.type === "Personal Loan"
                  ? "from-green-600 to-green-700"
                  : scheme.type === "Home Loan"
                  ? "from-purple-600 to-purple-700"
                  : "from-orange-600 to-orange-700"
              } flex items-center justify-center`}
            >
              <TrendingUp className="w-16 h-16 text-white" />
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">
                    {scheme.name}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {scheme.bank}
                  </CardDescription>
                </div>
                <Badge className="px-3 py-1">{scheme.type}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-4">
                  <InfoItem
                    icon={<Percent />}
                    label="Interest Rate"
                    value={scheme.interestRate}
                    color="blue"
                  />
                  <InfoItem
                    icon={<DollarSign />}
                    label="Loan Amount"
                    value={`PKR ${scheme.minAmount.toLocaleString()} - ${scheme.maxAmount.toLocaleString()}`}
                    color="green"
                  />
                </div>

                {/* Right */}
                <div className="space-y-4">
                  <InfoItem
                    icon={<Calendar />}
                    label="Tenure"
                    value={scheme.tenure}
                    color="purple"
                  />
                  <InfoItem
                    icon={<Building2 />}
                    label="Processing Fee"
                    value={scheme.processingFee}
                    color="orange"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="detail-section shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {scheme.features.map((feature, index) => (
                <Badge key={index} className="px-3 py-1">
                  {feature}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {/* Verification */}
          <Card className="detail-section shadow-lg border border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                Verified by our team. Last updated: {scheme.lastUpdated}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="detail-section flex gap-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add to Comparison
            </Button>
            <Button variant="outline" className="flex-1">
              Add to Watchlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ✅ Reusable Info Item */
function InfoItem({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  )
}
