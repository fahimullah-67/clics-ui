import { Link } from "react-router-dom"
import { useState } from "react"
import { Menu, Search, User, Bell, X } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/schemes", label: "Schemes" },
    { path: "/compare", label: "Compare" },
    { path: "/currency", label: "Currency" },
    { path: "/banks", label: "Pakistani Banks" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ]

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
          <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded">
            <Search size={20} />
          </button>

          <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded">
            <Bell size={20} />
          </button>

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
                Dashboard
              </Link>
              <Link
                to="/watchlist"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                Watchlist
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                Settings
              </Link>
              <hr />
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                Login
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="absolute right-0 top-0 h-full w-64 bg-white p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Menu</span>
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
