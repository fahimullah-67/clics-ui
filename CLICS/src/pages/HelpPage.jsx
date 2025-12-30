"use client"

import { useState } from "react"
import { Card } from "../components/custom-ui/Card"
import { Input } from "../components/custom-ui/Input"
import { Button } from "../components/custom-ui/Button"
import { Badge } from "../components/custom-ui/Badge"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Mock FAQ data
  const faqs = [
    {
      id: 1,
      category: "loans",
      question: "How do I apply for a loan?",
      answer:
        "To apply for a loan, navigate to the Loan Checker page, fill out the eligibility form with your financial details, and submit. Based on your eligibility, we'll recommend suitable banks and loan products. You can then click 'Apply Now' to proceed with the application.",
    },
    {
      id: 2,
      category: "loans",
      question: "What documents are required for loan application?",
      answer:
        "Common documents include: Identity proof (Aadhaar, PAN), Address proof (Utility bills), Income proof (Salary slips, ITR), Bank statements (last 6 months), Employment proof (Employment letter, business registration for self-employed).",
    },
    {
      id: 3,
      category: "loans",
      question: "How long does loan approval take?",
      answer:
        "Loan approval typically takes 3-7 business days depending on the bank and loan type. Personal loans are usually faster (2-3 days), while home loans may take up to 2 weeks due to property verification.",
    },
    {
      id: 4,
      category: "schemes",
      question: "What is the difference between PPF and FD?",
      answer:
        "PPF (Public Provident Fund) is a long-term savings scheme with a 15-year lock-in period and tax benefits. FD (Fixed Deposit) offers flexible tenure from 7 days to 10 years with guaranteed returns but limited tax benefits. PPF is ideal for retirement planning while FD suits short to medium-term goals.",
    },
    {
      id: 5,
      category: "schemes",
      question: "Can I withdraw money from investment schemes early?",
      answer:
        "Early withdrawal rules vary by scheme. PPF allows partial withdrawals after 7 years. Tax-saving FDs have a 5-year lock-in. Regular FDs allow premature withdrawal with penalty (usually 0.5-1% interest reduction). Always check scheme-specific terms before investing.",
    },
    {
      id: 6,
      category: "account",
      question: "How do I update my profile information?",
      answer:
        "Go to Settings > Profile Information, click Edit, update your details, and click Save Changes. For security reasons, changing email or mobile number requires OTP verification.",
    },
    {
      id: 7,
      category: "account",
      question: "How do I reset my password?",
      answer:
        'Click on "Forgot Password" on the login page, enter your registered email, and follow the reset link sent to your inbox. For security, password reset links expire in 1 hour.',
    },
    {
      id: 8,
      category: "security",
      question: "Is my financial information secure?",
      answer:
        "Yes, we use bank-grade 256-bit SSL encryption to protect your data. We never store your banking passwords. All sensitive information is encrypted and stored securely. We comply with RBI guidelines and data protection regulations.",
    },
    {
      id: 9,
      category: "security",
      question: "What should I do if I suspect unauthorized access?",
      answer:
        "Immediately change your password, review recent login activity in Settings > Security, enable two-factor authentication, and contact our support team. We'll help secure your account and investigate any suspicious activity.",
    },
    {
      id: 10,
      category: "payments",
      question: "What payment methods are accepted?",
      answer:
        "We accept UPI, Net Banking, Debit/Credit Cards (Visa, Mastercard, RuPay), and Digital Wallets (Paytm, PhonePe, Google Pay). All payments are processed through secure payment gateways.",
    },
    {
      id: 11,
      category: "payments",
      question: "How do I set up auto-pay for EMI?",
      answer:
        "Go to Dashboard > My Loans, select the loan, click 'Setup Auto-pay', choose your bank account, and authorize the mandate. EMI will be automatically debited on the due date each month.",
    },
    {
      id: 12,
      category: "general",
      question: "How can I contact customer support?",
      answer:
        "Contact us via: Live Chat (available 24/7 in the bottom-right corner), Email: support@clics.com, Phone: 1800-XXX-XXXX (Mon-Sat, 9 AM - 6 PM), or use the Contact page to submit your query.",
    },
  ]

  const categories = [
    { value: "all", label: "All Topics", icon: "📚" },
    { value: "loans", label: "Loans", icon: "💰" },
    { value: "schemes", label: "Investment Schemes", icon: "📈" },
    { value: "account", label: "Account", icon: "👤" },
    { value: "security", label: "Security", icon: "🔒" },
    { value: "payments", label: "Payments", icon: "💳" },
    { value: "general", label: "General", icon: "❓" },
  ]

  const quickLinks = [
    { title: "Getting Started Guide", description: "Learn the basics of using CLICS", icon: "🚀" },
    { title: "Video Tutorials", description: "Watch step-by-step video guides", icon: "🎥" },
    { title: "Compare Banks", description: "Find the best bank for your needs", icon: "🏦" },
    { title: "Loan Calculator", description: "Calculate EMI and loan eligibility", icon: "🧮" },
    { title: "Investment Tips", description: "Expert advice on investments", icon: "💡" },
    { title: "Contact Support", description: "Get help from our team", icon: "📞" },
  ]

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const filteredFaqs = selectedCategory === "all" ? faqs : faqs.filter((faq) => faq.category === selectedCategory)

  const searchedFaqs = filteredFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
        <p className="text-gray-600 text-lg mb-6">Search our FAQ or browse by category</p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <Card
              key={index}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{link.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className="flex items-center gap-2"
            >
              <span>{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <Badge variant="outline">{searchedFaqs.length} questions</Badge>
        </div>

        {searchedFaqs.length === 0 ? (
          <Card className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">Try different keywords or browse all categories</p>
            <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {searchedFaqs.map((faq) => (
              <Card key={faq.id} className="overflow-hidden">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          expandedFaq === faq.id ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <svg
                          className={`w-6 h-6 ${expandedFaq === faq.id ? "text-blue-600" : "text-gray-600"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{faq.question}</h3>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                      expandedFaq === faq.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 pb-6 border-t bg-gray-50">
                    <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline">
                        Was this helpful?
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <Card className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-6">Our support team is here to assist you</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button>Contact Support</Button>
            <Button variant="outline">Schedule a Call</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
