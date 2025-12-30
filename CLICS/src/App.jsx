import { Routes, Route } from "react-router-dom"
import  {Header}  from "./components/header"
import { Footer } from "./components/footer"
import { Chatbot } from "./components/chatbot"
import HomePage from "./pages/HomePage"
import SchemesPage from "./pages/SchemesPage"
import SchemeDetailPage from "./pages/SchemeDetailPage"
import ComparePage from "./pages/ComparePage"
import BanksPage from "./pages/BanksPage"
import WatchlistPage from "./pages/WatchlistPage"
import DashboardPage  from "./pages/DashboardPage"
import  CurrencyPage  from "./pages/CurrencyPage"
import AdminPage from "./pages/AdminPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import MessagesPage from "./pages/MessagesPage"
import ReviewsPage from "./pages/ReviewsPage"
import LoanCheckerPage from "./pages/LoanCheckerPage"
import NotificationsPage from "./pages/NotificationsPage"
import HelpPage from "./pages/HelpPage"
import SettingsPage from "./pages/SettingsPage"

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/schemes/:id" element={<SchemeDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/banks" element={<BanksPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/currency" element={<CurrencyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/loan-checker" element={<LoanCheckerPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default App
