import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/custom-ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/custom-ui/Card";
import { Badge } from "../components/custom-ui/Badge";
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
  TrendingUp,
  UserCheck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  ListChecks,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import api from "../utils/axios";
import { timeAgo } from "../utils/timeAgo";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [schemes, setSchemes] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [scraperLogs, setScraperLogs] = useState([]);
  const [isScraperRunning, setIsScraperRunning] = useState(false);
  const [scraperLoading, setScraperLoading] = useState(false);

  // Pagination states for each tab
  const [pagination, setPagination] = useState({
    pending: { page: 1, total: 0 },
    verified: { page: 1, total: 0 },
    users: { page: 1, total: 0 },
    logs: { page: 1, total: 0 },
    scraperLogs: { page: 1, total: 0 },
  });
  const itemsPerPage = 10;

  // Fetch all schemes
  const fetchSchemes = useCallback(async () => {
    try {
      const res = await api.get("/loanSchemes/getAll");
      const allSchemes = res.data?.data?.allLoanScheme || [];
      const formatted = allSchemes.map((s) => ({
        id: s._id,
        bank: s.bankId?.name || "Unknown Bank",
        name: s.schemeName,
        type: s.typeLoan,
        status: s.status,
        interestRate: s.interestRate,
        lastUpdated: new Date(s.updatedAt).toLocaleDateString(),
        verified: s.isVerified,
        captureDate: new Date(s.createdAt).toLocaleDateString(),
        changes: s.isVerified ? "Verified" : "Pending verification",
      }));
      setSchemes(formatted);
    } catch (err) {
      console.error("Failed to fetch schemes:", err);
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/all-user");
      const allUsers = res.data?.data || [];
      const formatted = allUsers.map((u) => ({
        id: u._id,
        name: u.username || u.name,
        email: u.email,
        role: u.role || "user",
        createdAt: timeAgo(u.createdAt),
        phone: u.phone || "N/A",
        isActive: u.isLoggedIn || false,
        lastLogin: u.lastLoginAt ? timeAgo(u.lastLoginAt) : "Never",
      }));
      setUsers(formatted);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  }, [navigate]);

  // Fetch admin logs
  const fetchAdminLogs = useCallback(async () => {
    try {
      const res = await api.get("/adminLogs");
      setLogs(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  }, []);

  // Fetch scraper logs and format them for display
  const fetchScraperLogs = useCallback(async () => {
    try {
      const res = await api.get("/scraper/logs");
      const rawLogs = res.data?.data || [];
      // Format logs for display
      const formatted = rawLogs.map((log) => ({
        id: log._id,
        status: log.status,
        runDate: log.runDate || log.createdAt,
        totalSchemesFound: log.totalSchemesFound || 0,
        totalCreated: log.totalCreated || 0,
        totalUpdated: log.totalUpdated || 0,
        errorMessage: log.errorMessage || null,
      }));
      setScraperLogs(formatted);
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        scraperLogs: { ...prev.scraperLogs, total: Math.ceil(formatted.length / itemsPerPage) }
      }));
    } catch (err) {
      console.error("Failed to fetch scraper logs:", err);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchSchemes(), fetchUsers(), fetchAdminLogs(), fetchScraperLogs()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchSchemes, fetchUsers, fetchAdminLogs, fetchScraperLogs]);

  // Approve / Reject scheme (using PUT /loanSchemes/update)
  const handleUpdateScheme = async (id, newStatus, isVerified) => {
    try {
      const scheme = schemes.find(s => s.id === id);
      if (!scheme) throw new Error("Scheme not found");

      const payload = {
        schemeId: id,
        status: newStatus,
        isVerified: isVerified,
      };
      await api.put("/loanSchemes/update", payload);
      await fetchSchemes();
      alert(`Scheme ${newStatus === "active" ? "approved" : "rejected"} successfully!`);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update scheme. Check console for details.");
    }
  };

  const handleApprove = (id) => handleUpdateScheme(id, "active", true);
  const handleReject = (id) => handleUpdateScheme(id, "inactive", false);

  // Run scraper
  const runScraper = async () => {
    setScraperLoading(true);
    try {
      await api.post("/scraper/run-default");
      alert("Scraper started successfully!");
      setIsScraperRunning(true);
      // Refresh logs after 5 seconds
      setTimeout(() => fetchScraperLogs(), 5000);
    } catch (err) {
      console.error("Scraper run error:", err);
      alert("Failed to start scraper");
    } finally {
      setScraperLoading(false);
    }
  };

  const stopScraper = () => {
    alert("Scraper stop not implemented in backend yet.");
    setIsScraperRunning(false);
  };

  const toggleScraper = () => {
    if (isScraperRunning) stopScraper();
    else runScraper();
  };

  // Pagination helpers
  const getPaginatedData = (data, tabKey) => {
    const start = (pagination[tabKey].page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  };

  const updatePage = (tabKey, newPage) => {
    setPagination(prev => ({
      ...prev,
      [tabKey]: { ...prev[tabKey], page: newPage }
    }));
  };

  // Prepare filtered lists
  const pendingSchemes = schemes.filter(s => s.status === "inactive" || !s.verified);
  const verifiedSchemes = schemes.filter(s => s.verified);
  
  // Update total counts for pagination (except scraper logs already updated)
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      pending: { ...prev.pending, total: Math.ceil(pendingSchemes.length / itemsPerPage) },
      verified: { ...prev.verified, total: Math.ceil(verifiedSchemes.length / itemsPerPage) },
      users: { ...prev.users, total: Math.ceil(users.length / itemsPerPage) },
      logs: { ...prev.logs, total: Math.ceil(logs.length / itemsPerPage) },
    }));
  }, [pendingSchemes.length, verifiedSchemes.length, users.length, logs.length]);

  const currentPending = getPaginatedData(pendingSchemes, "pending");
  const currentVerified = getPaginatedData(verifiedSchemes, "verified");
  const currentUsers = getPaginatedData(users, "users");
  const currentLogs = getPaginatedData(logs, "logs");
  const currentScraperLogs = getPaginatedData(scraperLogs, "scraperLogs");

  // Stats
  const totalSchemes = schemes.length;
  const verifiedCount = verifiedSchemes.length;
  const pendingCount = pendingSchemes.length;
  const activeUsers = users.filter(u => u.isActive).length;

  const stats = [
    { title: "Total Loan Schemes", value: totalSchemes, change: "+3 this week", icon: Database, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Verified Records", value: verifiedCount, change: `${((verifiedCount / totalSchemes) * 100).toFixed(1)}% verified`, icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { title: "Pending Review", value: pendingCount, change: "Needs attention", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Active Users", value: activeUsers, change: `${((activeUsers / users.length) * 100).toFixed(1)}% active`, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  const exportUsers = () => {
    if (!users.length) return alert("No user data to export");
    const headers = ["ID", "Name", "Email", "Role", "Active", "Created"];
    const csv = [headers.join(","), ...users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.isActive ? "Yes" : "No"},${u.createdAt}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users-${Date.now()}.csv`;
    link.click();
    alert("User data exported!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="ml-2 text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-8 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <Shield className="w-8 h-8" />
                Admin Dashboard
              </h1>
              <p className="text-blue-100 mt-1">Manage loan data, users, and system operations</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button onClick={toggleScraper} disabled={scraperLoading} className="bg-white text-blue-700 hover:bg-gray-100">
                {scraperLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : isScraperRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {scraperLoading ? "Starting..." : isScraperRunning ? "Stop Scraper" : "Run Scraper"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-slate-300" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500 mt-1">{stat.title}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
            {[
              { id: "pending", label: "Pending Review", icon: Clock, count: pendingCount },
              { id: "scraper", label: "Scraper Logs", icon: RefreshCw, count: scraperLogs.length },
              { id: "verified", label: "Verified Records", icon: CheckCircle, count: verifiedCount },
              { id: "users", label: "User Management", icon: Users, count: users.length },
              { id: "logs", label: "Admin Logs", icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && <Badge variant="secondary" className="ml-1 text-xs">{tab.count}</Badge>}
              </button>
            ))}
          </div>
        </div>

        {/* Pending Review Tab */}
        {activeTab === "pending" && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Pending Review ({pendingSchemes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Bank</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Loan Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Changes</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Capture Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPending.map((scheme) => (
                    <tr key={scheme.id} className="border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{scheme.bank}</td>
                      <td className="px-6 py-4">{scheme.name}</td>
                      <td className="px-6 py-4"><Badge variant="secondary" className="capitalize">{scheme.type}</Badge></td>
                      <td className="px-6 py-4 text-sm text-slate-500">{scheme.changes}</td>
                      <td className="px-6 py-4 text-sm">{scheme.captureDate}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleApprove(scheme.id)} className="text-green-600 border-green-200 hover:bg-green-50">
                          <CheckCircle className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleReject(scheme.id)} className="text-red-600 border-red-200 hover:bg-red-50">
                          <AlertCircle className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {currentPending.length === 0 && (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No pending reviews</td></tr>
                  )}
                </tbody>
              </table>
              {pagination.pending.total > 1 && (
                <div className="flex justify-center items-center gap-2 py-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => updatePage("pending", pagination.pending.page - 1)} disabled={pagination.pending.page === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">Page {pagination.pending.page} of {pagination.pending.total}</span>
                  <Button variant="outline" size="sm" onClick={() => updatePage("pending", pagination.pending.page + 1)} disabled={pagination.pending.page === pagination.pending.total}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Scraper Logs Tab - Fixed display and pagination */}
        {activeTab === "scraper" && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-500" />
                  Scraper Activity Logs
                </CardTitle>
                <Button variant="outline" size="sm" onClick={fetchScraperLogs} className="gap-1">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {scraperLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No scraper logs available. Run scraper to see results.</div>
              ) : (
                <>
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Run Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentScraperLogs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <Badge className={`${log.status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} border-0`}>
                              {log.status === "completed" ? <CheckCircle className="w-3 h-3 mr-1 inline" /> : <AlertCircle className="w-3 h-3 mr-1 inline" />}
                              {log.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {new Date(log.runDate).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {log.status === "completed" ? (
                              <div className="space-y-1 text-sm">
                                <div className="flex gap-4">
                                  <span><ListChecks className="w-3 h-3 inline mr-1" /> Found: {log.totalSchemesFound}</span>
                                  <span><CheckCircle className="w-3 h-3 inline mr-1 text-green-500" /> Created: {log.totalCreated}</span>
                                  <span><RefreshCw className="w-3 h-3 inline mr-1 text-blue-500" /> Updated: {log.totalUpdated}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-red-600 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 mt-0.5" />
                                <span className="break-all">{log.errorMessage || "Unknown error"}</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pagination.scraperLogs.total > 1 && (
                    <div className="flex justify-center items-center gap-2 py-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => updatePage("scraperLogs", pagination.scraperLogs.page - 1)} disabled={pagination.scraperLogs.page === 1}>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm">Page {pagination.scraperLogs.page} of {pagination.scraperLogs.total}</span>
                      <Button variant="outline" size="sm" onClick={() => updatePage("scraperLogs", pagination.scraperLogs.page + 1)} disabled={pagination.scraperLogs.page === pagination.scraperLogs.total}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Verified Records Tab */}
        {activeTab === "verified" && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Verified Loan Records ({verifiedSchemes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Bank</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Loan Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Interest Rate</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Last Updated</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVerified.map((scheme) => (
                    <tr key={scheme.id} className="border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{scheme.bank}</td>
                      <td className="px-6 py-4">{scheme.name}</td>
                      <td className="px-6 py-4"><Badge variant="secondary" className="capitalize">{scheme.type}</Badge></td>
                      <td className="px-6 py-4">{scheme.interestRate}%</td>
                      <td className="px-6 py-4 text-sm">{scheme.lastUpdated}</td>
                      <td className="px-6 py-4"><Button size="sm" variant="outline"><FileText className="w-4 h-4 mr-1" /> Edit</Button></td>
                    </tr>
                  ))}
                  {currentVerified.length === 0 && <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No verified records</td></tr>}
                </tbody>
              </table>
              {pagination.verified.total > 1 && (
                <div className="flex justify-center items-center gap-2 py-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => updatePage("verified", pagination.verified.page - 1)} disabled={pagination.verified.page === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">Page {pagination.verified.page} of {pagination.verified.total}</span>
                  <Button variant="outline" size="sm" onClick={() => updatePage("verified", pagination.verified.page + 1)} disabled={pagination.verified.page === pagination.verified.total}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* User Management Tab */}
        {activeTab === "users" && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{users.length}</p><p className="text-sm text-slate-500">Total Users</p></CardContent></Card>
                <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{activeUsers}</p><p className="text-sm text-slate-500">Active (30 days)</p></CardContent></Card>
                <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{users.filter(u => u.role === "admin").length}</p><p className="text-sm text-slate-500">Admins</p></CardContent></Card>
              </div>
              <div className="flex gap-3 mb-6">
                <Button variant="outline" onClick={() => navigate("/admin/users")}><UserCheck className="w-4 h-4 mr-2" /> View All Users</Button>
                <Button variant="outline" onClick={exportUsers}><FileText className="w-4 h-4 mr-2" /> Export User Data</Button>
              </div>
              {currentUsers.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50"><tr><th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Email</th><th className="px-4 py-2 text-left">Role</th><th className="px-4 py-2 text-left">Status</th></tr></thead>
                    <tbody>
                      {currentUsers.map(u => (
                        <tr key={u.id} className="border-b"><td className="px-4 py-2">{u.name}</td><td className="px-4 py-2">{u.email}</td><td className="px-4 py-2 capitalize">{u.role}</td><td className="px-4 py-2">{u.isActive ? <Badge className="bg-green-100 text-green-700">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {pagination.users.total > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => updatePage("users", pagination.users.page - 1)} disabled={pagination.users.page === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">Page {pagination.users.page} of {pagination.users.total}</span>
                  <Button variant="outline" size="sm" onClick={() => updatePage("users", pagination.users.page + 1)} disabled={pagination.users.page === pagination.users.total}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Logs Tab */}
        {activeTab === "logs" && (
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Admin Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Admin</th><th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Action</th><th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Collection</th><th className="px-6 py-3 text-left text-sm font-semibold text-slate-600">Date</th></tr></thead>
                <tbody>
                  {currentLogs.map((log) => (
                    <tr key={log._id} className="border-b hover:bg-slate-50">
                      <td className="px-6 py-4">{log.adminId?.name || "System"}</td>
                      <td className="px-6 py-4">{log.action}</td>
                      <td className="px-6 py-4">{log.targetCollection}</td>
                      <td className="px-6 py-4 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {currentLogs.length === 0 && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No logs available</td></tr>}
                </tbody>
              </table>
              {pagination.logs.total > 1 && (
                <div className="flex justify-center items-center gap-2 py-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => updatePage("logs", pagination.logs.page - 1)} disabled={pagination.logs.page === 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">Page {pagination.logs.page} of {pagination.logs.total}</span>
                  <Button variant="outline" size="sm" onClick={() => updatePage("logs", pagination.logs.page + 1)} disabled={pagination.logs.page === pagination.logs.total}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}