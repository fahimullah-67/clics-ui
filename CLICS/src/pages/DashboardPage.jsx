import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Heart, Eye, Download, MessageSquare, TrendingUp, Clock, Bell } from "lucide-react"
import { Link } from "react-router-dom"

export default function DashboardPage() {
  const stats = [
    {
      title: "Watchlist",
      value: "3",
      description: "Tracked loans",
      icon: Heart,
      href: "/watchlist",
      color: "text-red-600",
    },
    {
      title: "Comparisons",
      value: "5",
      description: "This month",
      icon: TrendingUp,
      href: "/schemes",
      color: "text-blue-600",
    },
    {
      title: "Recent Views",
      value: "12",
      description: "Last 7 days",
      icon: Eye,
      href: "/schemes",
      color: "text-green-600",
    },
    {
      title: "Alerts",
      value: "2",
      description: "Unread notifications",
      icon: Bell,
      href: "/watchlist",
      color: "text-orange-600",
    },
  ]

  const recentActivity = [
    {
      action: "Compared",
      loans: ["HBL Personal Loan", "MCB Home Loan"],
      date: "2 hours ago",
    },
    {
      action: "Added to watchlist",
      loans: ["UBL Auto Loan"],
      date: "1 day ago",
    },
    {
      action: "Viewed",
      loans: ["Bank Alfalah Student Loan"],
      date: "2 days ago",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b bg-muted/40">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground text-lg">Here's what's happening with your loan search</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={stat.href}>View</Link>
                    </Button>
                  </div>
                  <div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {activity.action === "Compared" ? (
                          <TrendingUp className="h-5 w-5 text-muted-foreground" />
                        ) : activity.action === "Added to watchlist" ? (
                          <Heart className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.action}{" "}
                          <span className="text-muted-foreground">{activity.loans.length > 1 ? "loans" : "loan"}</span>
                        </p>
                        {activity.loans.map((loan, loanIdx) => (
                          <Badge key={loanIdx} variant="secondary" className="mt-1 mr-1">
                            {loan}
                          </Badge>
                        ))}
                        <p className="text-xs text-muted-foreground mt-2">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/schemes">
                    <Eye className="h-4 w-4 mr-2" />
                    Browse All Loan Schemes
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/compare">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Start New Comparison
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/watchlist">
                    <Heart className="h-4 w-4 mr-2" />
                    View Watchlist
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/currency">
                    <Download className="h-4 w-4 mr-2" />
                    Currency Converter
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat with AI Assistant
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
