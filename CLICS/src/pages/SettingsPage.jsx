"use client"

import { useState } from "react"
import { Card } from "../components/custom-ui/Card"
import { Input } from "../components/custom-ui/Input"
import { Label } from "../components/custom-ui/Label"
import { Button } from "../components/custom-ui/Button"
import { Checkbox } from "../components/custom-ui/Checkbox"
import { Select } from "../components/custom-ui/Select"
import { Badge } from "../components/custom-ui/Badge"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState({
    fullName: "Fahim Ullah",
    email: "fahimullah446.@email.com",
    phone: "+92 319 9036170",
    dateOfBirth: "2005-25-03",
    address: "123 Kundian Chashama, Mianwali",
    pincode: "42000",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    loanAlerts: true,
    schemeUpdates: true,
    marketingEmails: false,
    language: "english",
    currency: "PKR",
    theme: "light",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
  })

  const [sessions] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Mianwali, Pakistan",
      lastActive: "Active now",
      current: true,
    },
    {
      id: 2,
      device: "Dell on Windows",
      location: "Mianwali, Pakistan",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Firefox on Linux",
      location: "Mianwali, Pakistan",
      lastActive: "1 day ago",
      current: false,
    },
  ]);

  const [activities] = useState([
    { id: 1, action: "Password changed", timestamp: "2024-01-15 10:30 AM", status: "success" },
    { id: 2, action: "Profile updated", timestamp: "2024-01-14 03:45 PM", status: "success" },
    { id: 3, action: "Failed login attempt", timestamp: "2024-01-12 11:20 PM", status: "warning" },
    { id: 4, action: "Loan application submitted", timestamp: "2024-01-10 09:15 AM", status: "success" },
  ])

  const handleProfileUpdate = () => {
    alert("Profile updated successfully!")
  }

  const handlePreferencesUpdate = () => {
    alert("Preferences saved successfully!")
  }

  const handlePasswordChange = () => {
    alert("Password changed successfully!")
  }

  const handleRevokeSession = (sessionId) => {
    if (window.confirm("Are you sure you want to revoke this session?")) {
      alert(`Session ${sessionId} revoked!`)
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "privacy", label: "Privacy", icon: "🛡️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="p-4 h-fit">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Profile Information
                </h2>

                <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    RK
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {profileData.fullName}
                    </h3>
                    <p className="text-gray-600">{profileData.email}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-transparent"
                    >
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      value={profileData.pincode}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          pincode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </Card>
            </>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  General Preferences
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      id="language"
                      value={preferences.language}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          language: e.target.value,
                        })
                      }
                    >
                      <option value="english">English</option>
                      <option value="hindi">Urdu</option>
                      <option value="tamil">Pashto</option>
                      <option value="bengali">Saraiki</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      id="currency"
                      value={preferences.currency}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          currency: e.target.value,
                        })
                      }
                    >
                      <option value="INR">PKR (RS)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      id="theme"
                      value={preferences.theme}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          theme: e.target.value,
                        })
                      }
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </Select>
                  </div>
                </div>

                <Button onClick={handlePreferencesUpdate} className="mt-6">
                  Save Preferences
                </Button>
              </Card>
            </>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Password
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>

                <Button onClick={handlePasswordChange} className="mt-6">
                  Change Password
                </Button>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Two-Factor Authentication
                </h2>

                <div className="flex items-start gap-4 mb-4">
                  <Checkbox
                    id="twoFactor"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: e.target.checked,
                      })
                    }
                  />
                  <div>
                    <label
                      htmlFor="twoFactor"
                      className="font-medium text-gray-900 cursor-pointer"
                    >
                      Enable Two-Factor Authentication
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Add an extra layer of security by requiring a verification
                      code
                    </p>
                  </div>
                </div>

                {securitySettings.twoFactorAuth && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Two-factor authentication is enabled. You'll receive a
                      code via SMS or email during login.
                    </p>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Active Sessions
                </h2>

                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {session.device}
                            </h3>
                            {session.current && <Badge>Current</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">
                            {session.location}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.lastActive}
                          </p>
                        </div>
                      </div>
                      {!session.current && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevokeSession(session.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h2>

                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 border-l-4 border-l-blue-500"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.status === "success"
                            ? "bg-green-100"
                            : "bg-orange-100"
                        }`}
                      >
                        {activity.status === "success" ? (
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-orange-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Notification Channels
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="emailNotif"
                          checked={preferences.emailNotifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              emailNotifications: e.target.checked,
                            })
                          }
                        />
                        <div>
                          <label
                            htmlFor="emailNotif"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            Email Notifications
                          </label>
                          <p className="text-sm text-gray-600">
                            Receive updates via email
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="smsNotif"
                          checked={preferences.smsNotifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              smsNotifications: e.target.checked,
                            })
                          }
                        />
                        <div>
                          <label
                            htmlFor="smsNotif"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            SMS Notifications
                          </label>
                          <p className="text-sm text-gray-600">
                            Receive important alerts via SMS
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="pushNotif"
                          checked={preferences.pushNotifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              pushNotifications: e.target.checked,
                            })
                          }
                        />
                        <div>
                          <label
                            htmlFor="pushNotif"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            Push Notifications
                          </label>
                          <p className="text-sm text-gray-600">
                            Get instant updates on your device
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      What to notify me about
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="loanAlerts"
                          checked={preferences.loanAlerts}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              loanAlerts: e.target.checked,
                            })
                          }
                        />
                        <div>
                          <label
                            htmlFor="loanAlerts"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            Loan Status Updates
                          </label>
                          <p className="text-sm text-gray-600">
                            Application status, approvals, and EMI reminders
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="schemeUpdates"
                          checked={preferences.schemeUpdates}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              schemeUpdates: e.target.checked,
                            })
                          }
                        />
                        <div>
                          <label
                            htmlFor="schemeUpdates"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            Investment Scheme Updates
                          </label>
                          <p className="text-sm text-gray-600">
                            New schemes and interest rate changes
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="marketing"
                          checked={preferences.marketingEmails}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              marketingEmails: e.target.checked,
                            })
                          }
                        />
                        <div>
                          <label
                            htmlFor="marketing"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            Marketing & Promotional Emails
                          </label>
                          <p className="text-sm text-gray-600">
                            Special offers and product recommendations
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handlePreferencesUpdate} className="mt-6">
                  Save Notification Preferences
                </Button>
              </Card>
            </>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Privacy Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Data Sharing
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Control how your data is used and shared
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Checkbox id="analytics" defaultChecked />
                        <div>
                          <label
                            htmlFor="analytics"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            Analytics & Performance
                          </label>
                          <p className="text-sm text-gray-600">
                            Help us improve by sharing usage data
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Checkbox id="personalization" defaultChecked />
                        <div>
                          <label
                            htmlFor="personalization"
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            Personalization
                          </label>
                          <p className="text-sm text-gray-600">
                            Get personalized recommendations
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Account Data
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Manage your account data and privacy
                    </p>

                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        Download My Data
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                      >
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
