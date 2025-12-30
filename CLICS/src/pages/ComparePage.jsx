"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "../components/custom-ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/custom-ui/Card"
import { ArrowLeft, X, CheckCircle, Download } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts"
import gsap from "gsap"

export default function ComparePage() {
  const [searchParams] = useSearchParams()
  const ids = searchParams.get("ids")?.split(",") || []
  const cardsRef = useRef(null)
  const containerRef = useRef(null)

  const [mockLoans] = useState([
  {
    id: "1",
    bank: "HBL",
    name: "HBL Personal Loan",
    type: "personal",
    interestRate: "14.5% - 18%",
    minAmount: 50000,
    maxAmount: 3000000,
    tenure: "12 - 60 months",
    processingFee: "1% + documentation charges",
    eligibility: ["Minimum age 21 years", "Maximum age 60 years", "Minimum salary Rs. 25,000"],
    features: ["Quick approval", "Flexible repayment", "No collateral required"],
    sourceUrl: "https://www.hbl.com/personal-loans",
    captureDate: "2025-01-15",
    lastUpdated: "2025-01-15",
    verified: true,
  },
  {
    id: "2",
    bank: "UBL",
    name: "UBL Auto Loan",
    type: "car",
    interestRate: "16% - 19%",
    minAmount: 500000,
    maxAmount: 10000000,
    tenure: "12 - 84 months",
    processingFee: "1.5% of loan amount",
    eligibility: ["Age 21-65 years", "Minimum income Rs. 40,000", "Valid driving license"],
    features: ["Up to 85% financing", "New and used cars", "Comprehensive insurance"],
    sourceUrl: "https://www.ubl.com/auto-finance",
    captureDate: "2025-01-14",
    lastUpdated: "2025-01-14",
    verified: true,
  },
  {
    id: "3",
    bank: "MCB",
    name: "MCB Home Loan",
    type: "home",
    interestRate: "15% - 17%",
    minAmount: 1000000,
    maxAmount: 50000000,
    tenure: "60 - 240 months",
    processingFee: "0.5% of loan amount",
    eligibility: ["Age 21-60 years", "Stable income", "Property must be approved"],
    features: ["Up to 90% financing", "Construction & purchase", "Fixed & variable rates"],
    sourceUrl: "https://www.mcb.com.pk/home-loan",
    captureDate: "2025-01-12",
    lastUpdated: "2025-01-12",
    verified: true,
  },
  {
    id: "4",
    bank: "Bank Alfalah",
    name: "Alfalah Student Loan",
    type: "student",
    interestRate: "10% - 12%",
    minAmount: 100000,
    maxAmount: 2000000,
    tenure: "12 - 84 months",
    processingFee: "Waived for students",
    eligibility: ["Admission confirmed", "Co-signer required", "Age 18-30 years"],
    features: ["Grace period available", "Low interest rates", "Local & international studies"],
    sourceUrl: "https://www.bankalfalah.com/student-loan",
    captureDate: "2025-01-10",
    lastUpdated: "2025-01-10",
    verified: true,
  },
  {
    id: "5",
    bank: "Meezan Bank",
    name: "Meezan Business Finance",
    type: "business",
    interestRate: "13% - 16%",
    minAmount: 500000,
    maxAmount: 25000000,
    tenure: "12 - 120 months",
    processingFee: "1.25% of facility",
    eligibility: ["Business operational for 2+ years", "Audited financials", "Shariah compliant"],
    features: ["Working capital", "Asset financing", "Islamic banking"],
    sourceUrl: "https://www.meezanbank.com/business-finance",
    captureDate: "2025-01-08",
    lastUpdated: "2025-01-08",
    verified: true,
  },
  {
    id: "6",
    bank: "ABL",
    name: "ABL Quick Personal Loan",
    type: "personal",
    interestRate: "15% - 19%",
    minAmount: 30000,
    maxAmount: 2500000,
    tenure: "6 - 48 months",
    processingFee: "1.5% flat",
    eligibility: ["Salaried individuals", "Age 21-60", "Minimum salary Rs. 20,000"],
    features: ["Instant approval", "Online application", "Minimal documentation"],
    sourceUrl: "https://www.abl.com/personal-loan",
    captureDate: "2025-01-15",
    lastUpdated: "2025-01-15",
    verified: true,
  },
  {
    id: "7",
    bank: "Standard Chartered",
    name: "SC Premier Auto Loan",
    type: "car",
    interestRate: "17% - 20%",
    minAmount: 800000,
    maxAmount: 15000000,
    tenure: "12 - 96 months",
    processingFee: "2% of amount",
    eligibility: ["Premier banking customer", "Age 25-65", "Monthly income Rs. 100,000+"],
    features: ["Premium service", "Fast track approval", "Flexible repayment options"],
    sourceUrl: "https://www.sc.com/pk/auto-loan",
    captureDate: "2025-01-13",
    lastUpdated: "2025-01-13",
    verified: true,
  },
  {
    id: "8",
    bank: "Faysal Bank",
    name: "Faysal Home Finance",
    type: "home",
    interestRate: "14% - 16.5%",
    minAmount: 1500000,
    maxAmount: 40000000,
    tenure: "60 - 300 months",
    processingFee: "0.75% of loan",
    eligibility: ["Age 21-65", "Salaried/Self-employed", "Property evaluation required"],
    features: ["Long tenure options", "Renovation loans", "Balance transfer facility"],
    sourceUrl: "https://www.faysalbank.com/home-finance",
    captureDate: "2025-01-11",
    lastUpdated: "2025-01-11",
    verified: true,
  },
  ])

  const [selectedLoans, setSelectedLoans] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("compareList")
      if (stored && stored.length > 0) {
        const storedIds = JSON.parse(stored)
        return mockLoans.filter((loan) => storedIds.includes(loan.id))
      }
    }
    return mockLoans.filter((loan) => ids.includes(loan.id))
  })

  useEffect(() => {
    if (selectedLoans.length > 0) {
      localStorage.setItem("compareList", JSON.stringify(selectedLoans.map((l) => l.id)))
    }
  }, [selectedLoans])

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
    }
  }, [])

  useEffect(() => {
    if (cardsRef.current && selectedLoans.length > 0) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" },
      )
    }
  }, [selectedLoans.length])

  const loanTypes = [...new Set(selectedLoans.map((loan) => loan.type))]
  const isSameCategory = loanTypes.length === 1

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleDownload = () => {
    let content = "CLICS - Loan Comparison Report\n"
    content += "=".repeat(60) + "\n\n"
    content += `Generated: ${new Date().toLocaleString()}\n\n`

    selectedLoans.forEach((loan, idx) => {
      content += `\nLoan ${idx + 1}: ${loan.name}\n`
      content += "-".repeat(60) + "\n"
      content += `Bank: ${loan.bank}\n`
      content += `Interest Rate: ${loan.interestRate}\n`
      content += `Type: ${loan.type}\n`
      content += `Min Amount: ${formatAmount(loan.minAmount)}\n`
      content += `Max Amount: ${formatAmount(loan.maxAmount)}\n`
      content += `Tenure: ${loan.tenure}\n`
      content += `Processing Fee: ${loan.processingFee}\n\n`
      content += `Key Features:\n`
      loan.features.forEach((f) => (content += `  • ${f}\n`))
      content += "\n"
    })

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `CLICS-Comparison-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const chartData = selectedLoans.map((loan) => ({
    name: loan.bank,
    interestRate: Number.parseFloat(loan.interestRate.split("-")[0].trim()),
    maxAmount: loan.maxAmount / 1000000,
    minTenure: Number.parseInt(loan.tenure.split("-")[0].trim()),
    processingFee: Number.parseFloat(loan.processingFee.split("%")[0].trim()) || 1,
  }))

  const projectedReturnsData = [3, 6, 12, 24, 36].map((months) => {
    const dataPoint = { months }
    selectedLoans.forEach((loan) => {
      const rate = Number.parseFloat(loan.interestRate.split("-")[0].trim()) / 100
      const principal = 100000
      const returns = principal * (1 + rate * (months / 12))
      dataPoint[loan.bank] = Math.round(returns)
    })
    return dataPoint
  })

  if (selectedLoans.length === 0) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto p-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">No Loans Selected</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Please select loans to compare.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/schemes">Browse Loan Schemes</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  if (!isSameCategory && selectedLoans.length > 1) {
    return (
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto p-12 border-2 border-yellow-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Cannot Compare Different Loan Types</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You're comparing:{" "}
                <span className="font-semibold">
                  {loanTypes.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please select loans of the same type for comparison.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/schemes">Browse Loan Schemes</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  const comparisonFeatures = [
    { label: "Scheme Name", key: "name" },
    { label: "Interest Rate", key: "interestRate" },
    { label: "Type", key: "type" },
    { label: "Min. Deposit", key: "minAmount", format: formatAmount },
    { label: "Tenure", key: "tenure" },
  ]

  return (
    <main className="flex-1" ref={containerRef}>
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/schemes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schemes
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Compare Schemes</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Compare up to 3 banking schemes side-by-side to make the best decision
              </p>
            </div>
            <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 overflow-hidden border border-gray-200 dark:border-gray-800" ref={cardsRef}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4 text-left font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900">
                    Feature
                  </th>
                  {selectedLoans.map((loan) => (
                    <th
                      key={loan.id}
                      className="p-4 text-center font-semibold min-w-[200px] relative bg-white dark:bg-gray-950"
                    >
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" asChild>
                        <Link to={`/compare?ids=${ids.filter((id) => id !== loan.id).join(",")}`}>
                          <X className="h-4 w-4" />
                        </Link>
                      </Button>
                      <div className="text-base font-bold text-gray-900 dark:text-white">{loan.bank}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr
                    key={feature.key}
                    className={idx % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}
                  >
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-800">
                      {feature.label}
                    </td>
                    {selectedLoans.map((loan) => {
                      const value = loan[feature.key]
                      const displayValue = feature.format ? feature.format(value) : value
                      return (
                        <td key={loan.id} className="p-4 text-center">
                          {feature.key === "interestRate" ? (
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">{displayValue}</span>
                          ) : feature.key === "type" ? (
                            <span className="capitalize">{displayValue}</span>
                          ) : (
                            <span className="text-gray-900 dark:text-white">{displayValue}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border border-gray-200 dark:border-gray-800">
            <CardHeader className="bg-gray-50 dark:bg-gray-900">
              <CardTitle className="text-lg">Interest Rate Comparison</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="interestRate" fill="#2563eb" name="Interest Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 dark:border-gray-800">
            <CardHeader className="bg-gray-50 dark:bg-gray-900">
              <CardTitle className="text-lg">Projected Returns Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={projectedReturnsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="months" stroke="#6b7280" label={{ value: "Months", position: "bottom" }} />
                  <YAxis stroke="#6b7280" label={{ value: "Returns (₨)", angle: -90, position: "insideLeft" }} />
                  <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb" }} />
                  <Legend />
                  {selectedLoans.map((loan, idx) => (
                    <Line
                      key={loan.id}
                      type="monotone"
                      dataKey={loan.bank}
                      stroke={["#2563eb", "#16a34a", "#ea580c"][idx]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Based on PKR 100,000 initial deposit
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader className="bg-gray-50 dark:bg-gray-900">
            <CardTitle className="text-lg">Features Comparison</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {selectedLoans.map((loan) => (
                <div key={loan.id}>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3">{loan.bank}</h4>
                  <ul className="space-y-2">
                    {loan.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
