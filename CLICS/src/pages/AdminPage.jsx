import { useState } from "react"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Database,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  FileText,
  Activity,
  Settings,
  Play,
  Pause,
} from "lucide-react"
import  {mockLoans}  from "../lib/mock-data"

export default function AdminDashboard() {
  const [isScraperRunning, setIsScraperRunning] = useState(false)

  const stats = [
    {
      title: "Total Loan Schemes",
      value: mockLoans.length.toString(),
      change: "+3 this week",
      icon: Database,
      color: "text-blue-600",
    },
    {
      title: "Verified Records",
      value: mockLoans.filter((l) => l.verified).length.toString(),
      change: "92% verified",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Review",
      value: "4",
      change: "Needs attention",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+12% this month",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  const pendingReviews = [
    {
      id: "9",
      bank: "JS Bank",
      name: "JS Bank Business Loan",
      type: "business",
      status: "pending",
      captureDate: "2025-01-16",
      changes: "New scheme detected",
    },
    {
      id: "10",
      bank: "Askari Bank",
      name: "Askari Home Finance",
      type: "home",
      status: "pending",
      captureDate: "2025-01-15",
      changes: "Interest rate updated",
    },
    {
      id: "11",
      bank: "Soneri Bank",
      name: "Soneri Car Loan",
      type: "car",
      status: "pending",
      captureDate: "2025-01-14",
      changes: "Processing fee changed",
    },
  ]

  const scraperLogs = [
    {
      bank: "HBL",
      status: "success",
      time: "2 hours ago",
      records: 12,
      message: "Successfully scraped 12 loan schemes",
    },
    {
      bank: "UBL",
      status: "success",
      time: "3 hours ago",
      records: 8,
      message: "Successfully scraped 8 loan schemes",
    },
    {
      bank: "MCB",
      status: "warning",
      time: "4 hours ago",
      records: 5,
      message: "Page structure changed - manual review needed",
    },
    {
      bank: "Bank Alfalah",
      status: "error",
      time: "5 hours ago",
      records: 0,
      message: "Connection timeout - will retry",
    },
  ]

  const handleApprove = (id) => {
    console.log("Approving record:", id)
    alert(`Record ${id} approved successfully!`)
  }

  const handleReject = (id) => {
    console.log("Rejecting record:", id)
    alert(`Record ${id} rejected`)
  }

  const toggleScraper = () => {
    setIsScraperRunning(!isScraperRunning)
    alert(isScraperRunning ? "Scraper stopped" : "Scraper started")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b bg-muted/40">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground text-lg">Manage loan data and system operations</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button className="gap-2" onClick={toggleScraper}>
                  {isScraperRunning ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Stop Scraper
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Scraper
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="scraper">Scraper Logs</TabsTrigger>
              <TabsTrigger value="verified">Verified Records</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>

            {/* Pending Review Tab */}
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bank</TableHead>
                        <TableHead>Loan Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Changes</TableHead>
                        <TableHead>Capture Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingReviews.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.bank}</TableCell>
                          <TableCell>{record.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {record.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{record.changes}</TableCell>
                          <TableCell className="text-sm">{record.captureDate}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleApprove(record.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleReject(record.id)}>
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scraper Logs Tab */}
            <TabsContent value="scraper">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Scraper Activity Logs
                    </CardTitle>
                    <Badge variant={isScraperRunning ? "default" : "secondary"}>
                      {isScraperRunning ? "Running" : "Idle"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scraperLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                            log.status === "success"
                              ? "bg-green-500/10"
                              : log.status === "warning"
                                ? "bg-orange-500/10"
                                : "bg-red-500/10"
                          }`}
                        >
                          {log.status === "success" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : log.status === "warning" ? (
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">{log.bank}</p>
                            <span className="text-xs text-muted-foreground">{log.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{log.message}</p>
                          {log.records > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {log.records} records
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <RefreshCw className="h-4 w-4" />
                        Refresh Logs
                      </Button>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <FileText className="h-4 w-4" />
                        Export Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Verified Records Tab */}
            <TabsContent value="verified">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Verified Loan Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bank</TableHead>
                        <TableHead>Loan Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Interest Rate</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLoans
                        .filter((l) => l.verified)
                        .slice(0, 5)
                        .map((loan) => (
                          <TableRow key={loan.id}>
                            <TableCell className="font-medium">{loan.bank}</TableCell>
                            <TableCell>{loan.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize">
                                {loan.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{loan.interestRate}</TableCell>
                            <TableCell className="text-sm">{loan.lastUpdated}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-2xl font-bold">1,234</p>
                          <p className="text-sm text-muted-foreground">Total Users</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-2xl font-bold">892</p>
                          <p className="text-sm text-muted-foreground">Active (30 days)</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-2xl font-bold">5</p>
                          <p className="text-sm text-muted-foreground">Admins</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        User management features include viewing user activity, managing permissions, and handling
                        support requests.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="bg-transparent">
                          View All Users
                        </Button>
                        <Button variant="outline" className="bg-transparent">
                          Export User Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
