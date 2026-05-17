import { Link } from "react-router-dom"
import { useState } from "react"
import { Menu, Search, User, Bell, X, MessageSquareText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Chatbot } from "./Chatbot";
import { Input } from "../components/custom-ui/Input";
import { useTranslation } from "react-i18next";


export function Header() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat toggle state
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="overflow-hidden flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg">
            <img
              src="/clicslogo.png"
              alt="CLICS Logo"
              className="h-full w-full "
            />
          </div>
          <span className="font-bold text-xl">CLICS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all relative"
            >
              <MessageSquareText size={22} />
              {/* Notification Ping */}
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </button>
          </div>
          <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded">
            <Search size={20} />
          </button>

          <button
            className="hidden sm:flex p-2 hover:bg-gray-100 rounded"
            onClick={() => navigate("/notifications")}
          >
            <Bell size={20} />
          </button>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="hidden sm:flex items-center gap-1 rounded p-2 hover:bg-gray-100"
            >
              <span className="text-sm font-medium uppercase">
                {currentLanguage}
              </span>
              <span className="text-xs">▾</span>
            </button>
            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-50">
                <button
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage("en");
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 ${currentLanguage === "en" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}`}
                >
                  {t("language.english", "English")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage("ur");
                    setShowLangDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 ${currentLanguage === "ur" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}`}
                >
                  {t("language.urdu", "اردو")}
                </button>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <User size={20} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-white border rounded shadow">
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                {t("user.dashboard", "Dashboard")}
              </Link>
              <Link
                to="/watchlist"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                {t("user.watchlist", "Watchlist")}
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                {t("user.settings", "Settings")}
              </Link>
              <hr />
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                {t("user.login", "Login")}
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="absolute right-0 top-0 h-full w-64 bg-white p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">
                {t("header.menu", "Menu")}
              </span>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-lg hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
