import { useState, useEffect, useRef } from "react";
import { Button } from "../components/custom-ui/Button";
import { Card } from "../components/custom-ui/Card";
import { Badge } from "../components/custom-ui/Badge";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";
import {
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
  AlertCircle,
  Mail,
  Shield,
  FileText,
  CreditCard,
  BookOpen,
  Trash2,
  CheckCheck,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const statsRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await api.get("notifications/getAllNotifications");
        const formatted = res.data.data.map((item) => ({
          id: item._id,
          type: item.uiType,
          category: item.category,
          title: item.title,
          message: item.message,
          timestamp: timeAgo(item.createdAt),
          rawDate: new Date(item.createdAt),
          read: item.isRead,
          actionable: !!item.actionLink,
          actionText: item.actionText,
          actionLink: item.actionLink,
        }));
        setNotifications(formatted);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [navigate]);

  useEffect(() => {
    if (!loading && statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      );
    }
    if (!loading && notificationsRef.current) {
      gsap.fromTo(
        notificationsRef.current.children,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: {
            trigger: notificationsRef.current,
            start: "top 85%",
          },
        },
      );
    }
  }, [loading]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "account":
        return <CreditCard className="w-4 h-4" />;
      case "loan":
        return <CreditCard className="w-4 h-4" />;
      case "scheme":
        return <BookOpen className="w-4 h-4" />;
      case "payment":
        return <CreditCard className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "security":
        return <Shield className="w-4 h-4" />;
      case "message":
        return <Mail className="w-4 h-4" />;
      case "other":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`notifications/markAsRead/${id}`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif,
        ),
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("notifications/markAllAsRead");
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true })),
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;
    try {
      await api.delete(`notifications/deleteNotification/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all notifications?"))
      return;
    try {
      await api.delete("notifications/clearAllNotifications");
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notif) => notif.category === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const importantCount = notifications.filter(
    (n) => n.type === "alert" || n.type === "warning",
  ).length;
  const thisWeekCount = notifications.filter((n) => {
    const now = new Date();
    const weekAgo = new Date(now.setDate(now.getDate() - 7));
    return n.rawDate >= weekAgo;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-8 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <Bell className="w-8 h-8" />
                Notifications
              </h1>
              <p className="text-blue-100 mt-1">
                Stay updated with your financial activities{" "}
                {unreadCount > 0 && `(${unreadCount} unread)`}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {notifications.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Unread</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {unreadCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Important
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {importantCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    This Week
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {thisWeekCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            "all",
            "account",
            "loan",
            "scheme",
            "payment",
            "document",
            "security",
            "message",
            "other",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 capitalize ${
                filter === cat
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat !== "all" && getCategoryIcon(cat)}
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="border-0 shadow-xl rounded-2xl p-12 text-center bg-white">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Bell className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No notifications
            </h3>
            <p className="text-slate-500">
              You're all caught up! Check back later for updates.
            </p>
          </Card>
        ) : (
          <div ref={notificationsRef} className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`border-0 shadow-md rounded-2xl transition-all hover:shadow-lg ${
                  !notification.read
                    ? "bg-blue-50/50 border-l-4 border-l-blue-500"
                    : "bg-white"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        notification.type === "success"
                          ? "bg-green-100"
                          : notification.type === "info"
                            ? "bg-blue-100"
                            : notification.type === "warning"
                              ? "bg-orange-100"
                              : notification.type === "alert"
                                ? "bg-red-100"
                                : "bg-slate-100"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-800">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-blue-500 text-white border-0">
                              New
                            </Badge>
                          )}
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            {getCategoryIcon(notification.category)}
                            <span className="capitalize">
                              {notification.category}
                            </span>
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {notification.actionable && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            {notification.actionText || "View Details"}
                          </Button>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
