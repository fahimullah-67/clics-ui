"use client"

import { Card, CardContent, CardFooter } from "../components/custom-ui/Card"
import { Badge } from "../components/custom-ui/Badge"
import { Button } from "../components/custom-ui/Button"
import { CheckCircle2, Plus } from "lucide-react"
import type { LoanScheme } from "../lib/mock-data"
import {Link} from "react-router-dom"

interface LoanCardProps {
  loan: LoanScheme
  onCompare?: (id: string) => void
  isComparing?: boolean
}

export function LoanCard({ loan, onCompare, isComparing }: LoanCardProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const loanTypeBadgeColors = {
    personal: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    car: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    home: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    student: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    business: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }

  const loanTypeGradients = {
    personal: "from-blue-500 to-blue-600",
    car: "from-purple-500 to-purple-600",
    home: "from-green-500 to-green-600",
    student: "from-orange-500 to-orange-600",
    business: "from-red-500 to-red-600",
  }

  return (
    <Card className="hover:shadow-lg transition-all h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${loanTypeGradients[loan.type]} p-6 text-white relative`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1">{loan.bank}</h3>
            <p className="text-sm text-white/90 mb-3">{loan.name}</p>
            <p className="text-2xl font-bold">{loan.interestRate.split("-")[0].trim()} p.a.</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={() => onCompare?.(loan.id)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Card Body */}
      <CardContent className="flex-1 p-6 space-y-4 bg-white dark:bg-gray-900">
        {/* Type Badge */}
        <div className="flex items-center justify-between">
          <Badge className={`${loanTypeBadgeColors[loan.type]} border-0 px-3 py-1`} variant="secondary">
            {loan.type.charAt(0).toUpperCase() + loan.type.slice(1)}
          </Badge>
          {loan.verified && (
            <Badge
              variant="secondary"
              className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0"
            >
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        {/* Loan Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-28">Type</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {loan.type.charAt(0).toUpperCase() + loan.type.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-28">Min. Deposit</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatAmount(loan.minAmount)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-28">Tenure</span>
            <span className="font-medium text-gray-900 dark:text-white">{loan.tenure}</span>
          </div>
        </div>

        {/* Key Features as Pills */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Key Features:</p>
          <div className="flex flex-wrap gap-2">
            {loan.features.slice(0, 3).map((feature, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
              >
                {feature.length > 20 ? feature.substring(0, 20) + "..." : feature}
              </Badge>
            ))}
            {loan.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{loan.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 bg-white dark:bg-gray-900">
        <Button
          variant="outline"
          size="sm"
          
          className="w-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100"
        >
          <Link to={`/schemes/${loan.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
