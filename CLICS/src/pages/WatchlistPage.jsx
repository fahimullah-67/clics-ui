"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "../components/custom-ui/Card"
import { Button } from "../components/custom-ui/Button"
import { TrendingDown, TrendingUp, Trash2 } from "lucide-react"
import gsap from "gsap"

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([
    {
      id: "1",
      schemeName: "HBL Car Financing",
      bank: "HBL",
      interestRate: "14.5%",
      change: -0.5,
      lastChecked: "2 hours ago",
      alertsEnabled: true,
    },
    {
      id: "2",
      schemeName: "UBL Personal Loan",
      bank: "UBL",
      interestRate: "16%",
      change: 0.2,
      lastChecked: "5 hours ago",
      alertsEnabled: false,
    },
  ])

  useEffect(() => {
    gsap.fromTo(
      ".watchlist-card",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    )
  }, [])

  const handleToggleAlerts = (id) => {
    setWatchlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, alertsEnabled: !item.alertsEnabled } : item)),
    )
  }

  const handleDelete = (id) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">My Watchlist</h1>
          <p className="text-lg text-slate-600">Track your favorite loan schemes</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {watchlist.map((item) => (
            <Card key={item.id} className="watchlist-card shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.schemeName}</h3>
                    <p className="text-slate-600 mb-3">{item.bank}</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Current Rate</p>
                        <p className="text-2xl font-bold text-blue-600">{item.interestRate}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.change < 0 ? (
                          <>
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-semibold">{Math.abs(item.change)}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span className="text-red-600 font-semibold">+{item.change}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Alerts</span>
                      <button
                        onClick={() => handleToggleAlerts(item.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.alertsEnabled ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.alertsEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-3">Last checked: {item.lastChecked}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
