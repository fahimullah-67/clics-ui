import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import api from "../utils/axios";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Heart,
  Eye,
  TrendingUp,
  Bell,
  Clock,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Download,
  ChevronRight,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DashboardPage() {
  const { user } = useAuth();
  const statsRef = useRef(null);
  const activityRef = useRef(null);

  // State for real data
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [comparisonsCount, setComparisonsCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch watchlist length
        const watchlistRes = await api.get("watchlist/getWatchlist");
        const watchlist = watchlistRes.data?.data || [];
        setWatchlistCount(watchlist.length);

        // 2. Fetch notifications to get unread count and recent activity
        const notifRes = await api.get("notifications/getAllNotifications");
        const notifications = notifRes.data?.data || [];
        const unread = notifications.filter((n) => !n.isRead).length;
        setUnreadNotifications(unread);

        // 3. Recent activity: take latest 5 notifications and format
        const latest = notifications.slice(0, 5);
        const formattedActivity = latest.map((notif) => ({
          id: notif._id,
          action: notif.title,
          description: notif.message,
          timestamp: timeAgo(notif.createdAt),
          type: notif.uiType || "info",
        }));
        setRecentActivity(formattedActivity);

        // 4. Comparisons count (if you have an endpoint for user comparisons)
        // If not, you can either set a default or fetch from comparison history.
        // I'll assume you have a "comparisons/getUserComparisons" endpoint.
        // If not, we can show a placeholder or skip. I'll add a try-catch.
        try {
          const compareRes = await api.get("comparisons/user");
          const comparisons = compareRes.data?.data || [];
          setComparisonsCount(comparisons.length);
        } catch (err) {
          console.warn("Comparison endpoint not available yet, using default 0");
          setComparisonsCount(0);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Helper: time ago
  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    return date.toLocaleDateString();
  };

  // GSAP animations
  useEffect(() => {
    if (!loading && statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
    if (!loading && activityRef.current) {
      gsap.fromTo(
        activityRef.current.children,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: { trigger: activityRef.current, start: "top 85%" },
        }
      );
    }
  }, [loading]);

  const stats = [
    {
      title: "Watchlist",
      value: watchlistCount,
      description: "Tracked loans",
      icon: Heart,
      href: "/watchlist",
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      title: "Comparisons",
      value: comparisonsCount,
      description: "Total created",
      icon: TrendingUp,
      href: "/compare",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Unread Alerts",
      value: unreadNotifications,
      description: "New notifications",
      icon: Bell,
      href: "/notifications",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ];

  // Quick actions (navigation)
  const quickActions = [
    { title: "Browse All Loan Schemes", icon: Eye, href: "/schemes", color: "blue" },
    { title: "Start New Comparison", icon: TrendingUp, href: "/compare", color: "green" },
    { title: "View Watchlist", icon: Heart, href: "/watchlist", color: "red" },
    { title: "Currency Converter", icon: Download, href: "/currency", color: "purple" },
    { title: "Chat with AI Assistant", icon: MessageSquare, href: "/", color: "indigo" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-10 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-sm font-medium text-blue-100">Dashboard</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, {user?.username || "User"}!
              </h1>
              <p className="text-blue-100 mt-2 text-lg">
                Here's what's happening with your loan search
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white text-black hover:bg-white/10"
            >
              <Link to="/schemes">
                Browse Loans
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div ref={statsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-slate-500">
                    <Link to={stat.href}>
                      View <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
                <div>
                  <p className="text-4xl font-bold text-slate-800 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity Card */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="w-5 h-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent ref={activityRef} className="p-0">
              {recentActivity.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No recent activity yet. Start exploring loans!
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          {activity.type === "alert" ? (
                            <Bell className="w-5 h-5 text-red-500" />
                          ) : activity.type === "success" ? (
                            <TrendingUp className="w-5 h-5 text-green-500" />
                          ) : (
                            <Eye className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{activity.action}</p>
                          <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                            {activity.description}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">{activity.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {quickActions.map((action, idx) => {
                const colorClasses = {
                  blue: "hover:bg-blue-50 border-blue-200 text-blue-700",
                  green: "hover:bg-green-50 border-green-200 text-green-700",
                  red: "hover:bg-red-50 border-red-200 text-red-700",
                  purple: "hover:bg-purple-50 border-purple-200 text-purple-700",
                  indigo: "hover:bg-indigo-50 border-indigo-200 text-indigo-700",
                };
                return (
                  <Button
                    key={idx}
                    asChild
                    variant="outline"
                    className={`w-full justify-start gap-3 py-6 rounded-xl transition-all ${colorClasses[action.color]}`}
                  >
                    <Link to={action.href}>
                      <action.icon className="w-5 h-5" />
                      {action.title}
                      <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                    </Link>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links & Resources (Sidebar style) */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <Card className="border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { name: "Browse Loans", href: "/schemes" },
                { name: "Compare", href: "/compare" },
                { name: "Banks", href: "/banks" },
                { name: "Currency Converter", href: "/currency" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  {link.name}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-1"
                >
                  <ChevronRight className="w-3 h-3" />
                  {link.name}
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}