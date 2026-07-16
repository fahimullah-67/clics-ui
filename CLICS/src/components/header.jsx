import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, Search, User, Bell, X, MessageSquareText,  LayoutDashboard, 
  Heart, 
  Settings, 
  LogOut  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Chatbot } from "./chatbot";
import { Input } from "../components/custom-ui/Input";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthProvider";
import api from "../utils/axios";

export function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const currentLanguage = i18n.language?.startsWith("ur") ? "ur" : "en";

  const navLinks = [
    { path: "/", label: t("nav.home", "Home") },
    { path: "/schemes", label: t("nav.schemes", "Schemes") },
    { path: "/compare", label: t("nav.compare", "Compare") },
    { path: "/currency", label: t("nav.currency", "Currency") },
    { path: "/banks", label: t("nav.banks", "Pakistani Banks") },
    { path: "/about", label: t("nav.about", "About") },
    { path: "/contact", label: t("nav.contact", "Contact") },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/user-logout");
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="overflow-hidden flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-md">
              <img
                src="/clicslogo.png"
                alt="CLICS Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              CLICS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5"
                      : "text-gray-600 hover:text-blue-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all relative"
              aria-label="Chat assistant"
            >
              <MessageSquareText size={20} />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </button>

            <button
              className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-600" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="hidden sm:flex items-center gap-1 rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium uppercase">
                  {currentLanguage}
                </span>
                <span className="text-xs">▾</span>
              </button>
              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      i18n.changeLanguage("en");
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${currentLanguage === "en" ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-50"}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      i18n.changeLanguage("ur");
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${currentLanguage === "ur" ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-50"}`}
                  >
                    اردو
                  </button>
                </div>
              )}
            </div>

            {/* User Avatar / Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="User menu"
              >
                <User size={20} className="text-gray-600" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-12 w-56 bg-white border rounded-xl shadow-xl z-50 overflow-hidden">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <p className="text-sm font-semibold text-gray-800">
                          {user?.username || user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <NavLink
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </NavLink>
                      <NavLink
                        to="/watchlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Heart size={16} /> Watchlist
                      </NavLink>
                      <NavLink
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings size={16} /> Settings
                      </NavLink>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/register"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        Sign Up
                      </NavLink>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsOpen(true)}
              aria-label="Menu"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-xl text-gray-800">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `text-lg transition-colors ${isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <hr className="my-2" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/notifications");
                }}
                className="text-left text-lg text-gray-700 hover:text-blue-600 flex items-center gap-2"
              >
                <Bell size={18} /> Notifications
              </button>
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className="text-lg text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/watchlist"
                    className="text-lg text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Watchlist
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="text-lg text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </NavLink>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="text-left text-lg text-red-600 hover:text-red-700 flex items-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="text-lg text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="text-lg text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </>
  );
}
