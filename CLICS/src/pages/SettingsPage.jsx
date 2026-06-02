import { useState, useEffect, useRef } from "react";
import { Card } from "../components/custom-ui/Card";
import { Input } from "../components/custom-ui/Input";
import { Label } from "../components/custom-ui/Label";
import { Button } from "../components/custom-ui/Button";
import { Checkbox } from "../components/custom-ui/Checkbox";
import { Select } from "../components/custom-ui/Select";
import { Badge } from "../components/custom-ui/Badge";
import { useAuth } from "../context/AuthProvider";
import api from "../utils/axios";
import {
  User,
  Settings,
  Shield,
  Lock,
  Bell,
  LogOut,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Laptop,
  Globe,
  Eye,
  EyeOff,
  Download,
  Trash2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout, loading } = useAuth();
  const sectionsRef = useRef(null);

  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    pincode: "42000",
  });

  // Password data state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Preferences state
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

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  // Sessions (static mock, can be replaced with API later)
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

  // Activities (static mock)
  const [activities] = useState([
    {
      id: 1,
      action: "Password changed",
      timestamp: "2024-01-15 10:30 AM",
      status: "success",
    },
    {
      id: 2,
      action: "Profile updated",
      timestamp: "2024-01-14 03:45 PM",
      status: "success",
    },
    {
      id: 3,
      action: "Failed login attempt",
      timestamp: "2024-01-12 11:20 PM",
      status: "warning",
    },
    {
      id: 4,
      action: "Loan application submitted",
      timestamp: "2024-01-10 09:15 AM",
      status: "success",
    },
  ]);

  // Populate profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
        address: user.address?.street || "",
        pincode: user.pincode || "42000",
      });
    }
  }, [user]);

  // GSAP animations for sections
  useEffect(() => {
    if (sectionsRef.current) {
      gsap.fromTo(
        sectionsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionsRef.current, start: "top 85%" },
        }
      );
    }
  }, [activeTab]);

  // Handlers
  const handleProfileUpdate = async () => {
    try {
      await api.put("/update-user-profile", {
        username: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: { street: profileData.address },
        dateOfBirth: profileData.dateOfBirth,
      });
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("Profile update failed");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long!");
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      alert("New password cannot be the same as current password!");
      return;
    }
    try {
      await api.put("/change_password", {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to change password");
    }
  };

  const handlePreferencesUpdate = () => {
    alert("Preferences saved successfully!");
  };

  const handleLogout = async () => {
    try {
      await api.post("/user-logout");
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleRevokeSession = (sessionId) => {
    if (window.confirm("Are you sure you want to revoke this session?")) {
      alert(`Session ${sessionId} revoked!`);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">User not found. Please log in again.</p>
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
                <Settings className="w-8 h-8" />
                Settings
              </h1>
              <p className="text-blue-100 mt-1">Manage your account and preferences</p>
            </div>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden h-fit sticky top-24">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user.username}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            </div>
            <nav className="p-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>

          {/* Main Content */}
          <div ref={sectionsRef} className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Profile Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6 pb-6 border-b">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {profileData.fullName ? profileData.fullName.split(" ").map(n => n[0]).join("") : "U"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-800">{profileData.fullName}</h3>
                      <p className="text-slate-500">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-slate-700 font-medium">Full Name</Label>
                      <Input
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700 font-medium">Email Address</Label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700 font-medium">Phone Number</Label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700 font-medium">Date of Birth</Label>
                      <Input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-slate-700 font-medium">Address</Label>
                      <Input
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700 font-medium">PIN Code</Label>
                      <Input
                        value={profileData.pincode}
                        onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button onClick={handleProfileUpdate} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => {}}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    General Preferences
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <Label className="text-slate-700 font-medium">Language</Label>
                    <Select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="mt-1.5"
                    >
                      <option value="english">English</option>
                      <option value="urdu">Urdu</option>
                      <option value="pashto">Pashto</option>
                      <option value="saraiki">Saraiki</option>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Currency</Label>
                    <Select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                      className="mt-1.5"
                    >
                      <option value="PKR">PKR (Rs)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-700 font-medium">Theme</Label>
                    <Select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                      className="mt-1.5"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </Select>
                  </div>
                  <Button onClick={handlePreferencesUpdate} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-600" />
                      Change Password
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <Label className="text-slate-700 font-medium">Current Password</Label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-700 font-medium">New Password</Label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-700 font-medium">Confirm New Password</Label>
                      <div className="relative mt-1.5">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700 mt-2">
                      Update Password
                    </Button>
                  </div>
                </Card>

                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Two-Factor Authentication
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        id="twoFactor"
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                      />
                      <div>
                        <label htmlFor="twoFactor" className="font-medium text-slate-800 cursor-pointer">
                          Enable Two-Factor Authentication
                        </label>
                        <p className="text-sm text-slate-500">Add an extra layer of security by requiring a verification code</p>
                      </div>
                    </div>
                    {securitySettings.twoFactorAuth && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-800">Two-factor authentication is enabled. You'll receive a code via SMS or email during login.</p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-blue-600" />
                      Active Sessions
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex flex-wrap items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <Smartphone className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">{session.device}</span>
                              {session.current && <Badge className="bg-green-500 text-white">Current</Badge>}
                            </div>
                            <p className="text-sm text-slate-500">{session.location}</p>
                            <p className="text-xs text-slate-400">{session.lastActive}</p>
                          </div>
                        </div>
                        {!session.current && (
                          <Button variant="outline" size="sm" onClick={() => handleRevokeSession(session.id)}>
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Recent Activity
                    </h2>
                  </div>
                  <div className="p-6 space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl border-l-4 border-l-blue-500 bg-white shadow-sm">
                        {activity.status === "success" ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{activity.action}</p>
                          <p className="text-xs text-slate-400">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Notification Preferences
                  </h2>
                </div>
                <div className="p-6 space-y-8">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">Notification Channels</h3>
                    <div className="space-y-4">
                      {[
                        { id: "emailNotif", label: "Email Notifications", desc: "Receive updates via email", checked: preferences.emailNotifications, key: "emailNotifications" },
                        { id: "smsNotif", label: "SMS Notifications", desc: "Receive important alerts via SMS", checked: preferences.smsNotifications, key: "smsNotifications" },
                        { id: "pushNotif", label: "Push Notifications", desc: "Get instant updates on your device", checked: preferences.pushNotifications, key: "pushNotifications" },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start gap-4">
                          <Checkbox
                            id={item.id}
                            checked={item.checked}
                            onCheckedChange={(checked) => setPreferences({ ...preferences, [item.key]: checked })}
                          />
                          <div>
                            <label htmlFor={item.id} className="font-medium text-slate-800 cursor-pointer">{item.label}</label>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-slate-800 mb-4">What to notify me about</h3>
                    <div className="space-y-4">
                      {[
                        { id: "loanAlerts", label: "Loan Status Updates", desc: "Application status, approvals, and EMI reminders", checked: preferences.loanAlerts, key: "loanAlerts" },
                        { id: "schemeUpdates", label: "Investment Scheme Updates", desc: "New schemes and interest rate changes", checked: preferences.schemeUpdates, key: "schemeUpdates" },
                        { id: "marketing", label: "Marketing & Promotional Emails", desc: "Special offers and product recommendations", checked: preferences.marketingEmails, key: "marketingEmails" },
                      ].map((item) => (
                        <div key={item.id} className="flex items-start gap-4">
                          <Checkbox
                            id={item.id}
                            checked={item.checked}
                            onCheckedChange={(checked) => setPreferences({ ...preferences, [item.key]: checked })}
                          />
                          <div>
                            <label htmlFor={item.id} className="font-medium text-slate-800 cursor-pointer">{item.label}</label>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handlePreferencesUpdate} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </div>
              </Card>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-white">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Privacy Settings
                  </h2>
                </div>
                <div className="p-6 space-y-8">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Data Sharing</h3>
                    <p className="text-sm text-slate-500 mb-4">Control how your data is used and shared</p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Checkbox id="analytics" defaultChecked />
                        <div>
                          <label htmlFor="analytics" className="font-medium text-slate-800 cursor-pointer">Analytics & Performance</label>
                          <p className="text-sm text-slate-500">Help us improve by sharing usage data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Checkbox id="personalization" defaultChecked />
                        <div>
                          <label htmlFor="personalization" className="font-medium text-slate-800 cursor-pointer">Personalization</label>
                          <p className="text-sm text-slate-500">Get personalized recommendations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-slate-800 mb-2">Account Data</h3>
                    <p className="text-sm text-slate-500 mb-4">Manage your account data and privacy</p>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Download className="w-4 h-4" />
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
     
    </div>
  </div>
  );
}