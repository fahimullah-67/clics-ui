import { useState, useEffect, act } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthProvider";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Navigation,
} from "lucide-react";
import { mockLoans } from "../lib/mock-data";
import { useAuth } from "../context/AuthProvider";
import api from "../utils/axios";
import { timeAgo } from "../utils/timeAgo";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isScraperRunning, setIsScraperRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([
    {
      id: "11",
      bank: "Soneri Bank",
      name: "Soneri Car Loan",
      type: "car",
      status: "inactive",
      captureDate: "2025-01-14",
      changes: "Processing fee changed",
    },
    {
      id: "11",
      bank: "Soneri Bank",
      name: "Soneri Car Loan",
      type: "car",
      status: "warning",
      captureDate: "2025-01-14",
      changes: "Processing fee changed",
    },
    {
      id: "11",
      bank: "Soneri Bank",
      name: "Soneri Car Loan",
      type: "car",
      status: "inactive",
      captureDate: "2025-01-14",
      changes: "Processing fee changed",
    },
  ]);
  const [verify, setVerify] = useState([]);
  const [scheme, setScheme] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await api.get("/adminLogs");

      console.log("Fetched admin logs:", res);
      const data = res.data.data;
      setLogs(data);
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      setLoader(true);
      try {
        const res = await api.get("/loanSchemes/getAll");
        console.log("res", res);

        const schemes = res.data?.data?.allLoanScheme;
        console.log("Fetched schemes for pending reviews:", schemes);

        const formatted = schemes?.map((scheme) => ({
          id: scheme._id,
          bank: scheme.bankId?.name || "Unknown Bank",
          name: scheme.schemeName,
          type: scheme.typeLoan,
          status: scheme.status,
          interestRate: scheme.interestRate,
          lastUpdated: new Date(scheme.updatedAt).toLocaleDateString(),
          verified: scheme.isVerified,
          captureDate: new Date(scheme.createdAt).toLocaleDateString(),
          changes: scheme.isVerified
            ? "Verified - no changes"
            : "Pending verification",
        }));

        console.log("Formatted Pending Reviews:", formatted);

        // Set all schemes for admin view
        setScheme(formatted);
        // Filter for inactive/pending schemes
        const inactiveSchemes = formatted?.filter(
          (s) => s.status === "inactive",
        );
        console.log("Inactive Schemes:", inactiveSchemes);
        setPendingReviews(inactiveSchemes);

        // Filter for verified schemes
        const verifiedSchemes = formatted?.filter((s) => s.verified === true);
        console.log("Verified Schemes:", verifiedSchemes);
        setVerify(verifiedSchemes);
        console.log("Set Verify:", setVerify);
      } catch (error) {
        console.error(error);
        setError("Failed to load scheme");
      } finally {
        setLoader(false);
        console.log("Finished fetching pending reviews");
      }
    };

    fetchPendingReviews();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoader(true);
      try {
        const res = await api.get("/all-user");
        console.log("Fetched ALL users data:", res);

        const users = res.data?.data;
        console.log("Fetched users for admin view:", users);

        const formatted = users?.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: timeAgo(user.createdAt),
          actions: "View | Edit | Delete",
          phone: user.phone || "N/A",
          isActive: user.isLoggedIn,
          lastLogin: user.lastLoginAt ? timeAgo(user.lastLoginAt) : "Never",
        }));
        console.log("Formatted Users for Admin:", formatted);
        setUsers(formatted);
      } catch (error) {
        console.error("Error fetching users for admin:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Failed to load users");
        }
      } finally {
        setLoader(false);
        console.log("Finished fetching users for admin");
      }
    };
    fetchUser();
  }, [navigate]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const stats = [
    {
      title: "Total Loan Schemes",
      value: scheme?.length?.toString() || "0",
      change: "+3 this week",
      icon: Database,
      color: "text-blue-600",
    },
    {
      title: "Verified Records",
      value: (
        scheme?.filter((r) => r.verified === true).length ?? 0
      ).toString(),
      change: `${(((scheme?.filter((r) => r.verified === true).length ?? 0) / (scheme?.length ?? 1)) * 100).toFixed(2)}% verified`,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Pending Review",
      value: (
        scheme?.filter((r) => r.status === "inactive").length ?? 0
      ).toString(),
      change: "Needs attention",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.isActive).length.toString(),
      change: `${(((users.filter((u) => u.isActive).length ?? 0) / (users.length ?? 1)) * 100).toFixed(2)}% active`,
      icon: Users,
      color: "text-purple-600",
    },
  ];

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
  ];

  const handleApprove = (id) => {
    console.log("Approving record:", id);
    alert(`Record ${id} approved successfully!`);
  };

  const handleReject = (id) => {
    console.log("Rejecting record:", id);
    alert(`Record ${id} rejected`);
  };

  const toggleScraper = () => {
    setIsScraperRunning(!isScraperRunning);
    alert(isScraperRunning ? "Scraper stopped" : "Scraper started");
  };

  const handleViewAllUsers = () => {
    navigate("/users");
  };

  const handleExportUserData = () => {
    if (!users || users.length === 0) {
      alert("No user data to export");
      return;
    }

    // Convert users array to CSV format
    const headers = ["ID", "Name", "Email", "Role", "Active", "Created Date"];
    const csvContent = [
      headers.join(","),
      ...users.map((u) =>
        [
          u.id || "",
          u.name || "",
          u.email || "",
          u.role || "",
          u.isActive ? "Yes" : "No",
          new Date(u.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `users-export-${new Date().getTime()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("User data exported successfully!");
  };

  if (loader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b bg-muted/40">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage loan data and system operations
                </p>
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
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
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
              <TabsTrigger value="logs">Admin Logs</TabsTrigger>
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
                      {pendingReviews?.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.bank}
                          </TableCell>
                          <TableCell>{record.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {record.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {record.changes}
                          </TableCell>
                          <TableCell className="text-sm">
                            {record.captureDate}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(record.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(record.id)}
                              >
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
                      <div
                        key={idx}
                        className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                      >
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
                            <span className="text-xs text-muted-foreground">
                              {log.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {log.message}
                          </p>
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
                      <Button
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Logs
                      </Button>
                      <Button
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
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
                      {verify
                        .filter((l) => l.verified)
                        .slice(0, 5)
                        .map((loan) => (
                          <TableRow key={loan.id}>
                            <TableCell className="font-medium">
                              {loan.bank}
                            </TableCell>
                            <TableCell>{loan.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize">
                                {loan.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {loan.interestRate}
                            </TableCell>
                            <TableCell className="text-sm">
                              {loan.lastUpdated}
                            </TableCell>
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
                          <p className="text-2xl font-bold">{users.length}</p>
                          <p className="text-sm text-muted-foreground">
                            Total Users
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-2xl font-bold">
                            {users.filter((u) => u.isActive).length}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Active (30 days)
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-2xl font-bold">
                            {users.filter((u) => u.role === "admin").length}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Admins
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        User management features include viewing user activity,
                        managing permissions, and handling support requests.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="bg-transparent"
                          onClick={handleViewAllUsers}
                        >
                          View All Users
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-transparent"
                          onClick={handleExportUserData}
                        >
                          Export User Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Admin Activity Logs
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Admin</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Collection</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {logs?.map((log) => (
                        <TableRow key={log._id}>
                          <TableCell>{log.adminId?.name}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.targetCollection}</TableCell>
                          <TableCell>
                            {new Date(log.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
