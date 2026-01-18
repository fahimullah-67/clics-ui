import { useState } from "react"
import { Button } from "../components/custom-ui/Button"
import { Card } from "../components/custom-ui/Card"
import { Badge } from "../components/custom-ui/Badge"

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      category: "loan",
      title: "Loan Application Approved",
      message: "Congratulations! Your home loan application has been approved. Amount: ₹50,00,000",
      timestamp: "2 hours ago",
      read: false,
      actionable: true,
      actionText: "View Details",
    },
    {
      id: 2,
      type: "info",
      category: "scheme",
      title: "New Investment Scheme Available",
      message: "Check out the new PPF scheme with attractive interest rates starting from 7.1%",
      timestamp: "5 hours ago",
      read: false,
      actionable: true,
      actionText: "Explore Scheme",
    },
    {
      id: 3,
      type: "warning",
      category: "payment",
      title: "EMI Payment Due Soon",
      message: "Your EMI payment of ₹15,000 is due in 3 days. Please ensure sufficient balance.",
      timestamp: "1 day ago",
      read: true,
      actionable: true,
      actionText: "Pay Now",
    },
    {
      id: 4,
      type: "success",
      category: "document",
      title: "Documents Verified",
      message: "All your submitted documents have been verified successfully.",
      timestamp: "2 days ago",
      read: true,
      actionable: false,
    },
    {
      id: 5,
      type: "info",
      category: "rate",
      title: "Interest Rate Update",
      message: "SBI has reduced home loan interest rates to 8.5%. Consider refinancing your existing loan.",
      timestamp: "3 days ago",
      read: true,
      actionable: true,
      actionText: "Learn More",
    },
    {
      id: 6,
      type: "alert",
      category: "security",
      title: "New Login Detected",
      message: "A new login was detected from Chrome on Windows. If this wasn't you, secure your account.",
      timestamp: "3 days ago",
      read: true,
      actionable: true,
      actionText: "Review Activity",
    },
    {
      id: 7,
      type: "info",
      category: "message",
      title: "New Message from HDFC Bank",
      message: "You have received a new message regarding your query about credit cards.",
      timestamp: "1 week ago",
      read: true,
      actionable: true,
      actionText: "View Message",
    },
    {
      id: 8,
      type: "success",
      category: "account",
      title: "Profile Updated Successfully",
      message: "Your profile information has been updated. Review your changes in settings.",
      timestamp: "1 week ago",
      read: true,
      actionable: false,
    },
  ])

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case "info":
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
      case "warning":
        return (
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        )
      case "alert":
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const handleMarkAsRead = (id) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([])
    }
  }

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((notif) => notif.category === filter)

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with your financial activities {unreadCount > 0 && `(${unreadCount} unread)`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
          <Button variant="outline" onClick={handleClearAll} disabled={notifications.length === 0}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Important</p>
              <p className="text-2xl font-bold text-red-600">
                {notifications.filter((n) => n.type === "alert" || n.type === "warning").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  notifications.filter(
                    (n) => n.timestamp.includes("hours") || n.timestamp.includes("day") || n.timestamp.includes("days"),
                  ).length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All
        </Button>
        <Button variant={filter === "loan" ? "default" : "outline"} onClick={() => setFilter("loan")}>
          Loans
        </Button>
        <Button variant={filter === "scheme" ? "default" : "outline"} onClick={() => setFilter("scheme")}>
          Schemes
        </Button>
        <Button variant={filter === "payment" ? "default" : "outline"} onClick={() => setFilter("payment")}>
          Payments
        </Button>
        <Button variant={filter === "document" ? "default" : "outline"} onClick={() => setFilter("document")}>
          Documents
        </Button>
        <Button variant={filter === "security" ? "default" : "outline"} onClick={() => setFilter("security")}>
          Security
        </Button>
        <Button variant={filter === "message" ? "default" : "outline"} onClick={() => setFilter("message")}>
          Messages
        </Button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all ${
                !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50" : "hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                {getNotificationIcon(notification.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      {!notification.read && <Badge variant="default">New</Badge>}
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{notification.timestamp}</span>
                  </div>

                  <p className="text-gray-700 mb-3">{notification.message}</p>

                  <div className="flex items-center gap-3">
                    {notification.actionable && (
                      <Button size="sm" variant="outline">
                        {notification.actionText}
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
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
