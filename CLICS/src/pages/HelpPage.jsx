"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "../components/custom-ui/Card";
import { Input } from "../components/custom-ui/Input";
import { Button } from "../components/custom-ui/Button";
import { Badge } from "../components/custom-ui/Badge";
import {
  Search,
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Video,
  Building2,
  Calculator,
  Lightbulb,
  Headphones,
  DollarSign,
  PiggyBank,
  User,
  Shield,
  CreditCard,
  Globe,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const quickLinksRef = useRef(null);
  const faqRef = useRef(null);

  // Professional FAQ data
  const faqs = [
    {
      id: 1,
      category: "loans",
      question: "How do I apply for a loan through CLICS?",
      answer:
        "To apply for a loan, navigate to the Schemes page, use filters to find suitable loans, click on any scheme to view details, then click 'Apply Now' which will redirect you to the bank's official application portal. CLICS does not process loans directly but provides verified information to help you choose the best option.",
    },
    {
      id: 2,
      category: "loans",
      question: "What documents are typically required for loan applications?",
      answer:
        "Common documents include: CNIC copy, proof of income (salary slips for last 3 months or business financials), bank statements (last 6 months), employment letter, and sometimes collateral documents for secured loans. Requirements vary by bank and loan type.",
    },
    {
      id: 3,
      category: "loans",
      question: "How long does loan approval usually take?",
      answer:
        "Approval timelines vary: Personal loans: 2-5 business days. Car loans: 3-7 business days. Home loans: 7-14 business days. Business loans: 5-10 business days. These are estimates; actual time depends on document completeness and bank processing.",
    },
    {
      id: 4,
      category: "schemes",
      question: "How are banking schemes verified on CLICS?",
      answer:
        "We automatically collect data from official bank websites and PDFs. Each scheme's source URL and capture date are stored. Our team periodically reviews and updates information. Verified schemes have a 'Verified' badge, but we always recommend confirming details directly with the bank.",
    },
    {
      id: 5,
      category: "schemes",
      question: "Can I trust the interest rates shown on CLICS?",
      answer:
        "Interest rates are sourced from official bank documents. However, rates can change. We display the rate as per the latest source capture. Always check with the bank for the most current rate before applying.",
    },
    {
      id: 6,
      category: "account",
      question: "How do I update my profile information?",
      answer:
        "Go to Settings → Profile Information. Click the edit icon next to each field, update your details, and click 'Save Changes'. For email or phone changes, OTP verification is required for security.",
    },
    {
      id: 7,
      category: "account",
      question: "How do I reset my password if I forgot it?",
      answer:
        "On the login page, click 'Forgot Password'. Enter your registered email address. You'll receive a password reset link that expires in 1 hour. Click the link and follow the instructions to set a new password.",
    },
    {
      id: 8,
      category: "security",
      question: "Is my personal and financial data secure on CLICS?",
      answer:
        "Yes. We use 256-bit SSL encryption, never store banking passwords, and all sensitive data is encrypted at rest. We comply with data protection regulations. Two-factor authentication is available in your security settings.",
    },
    {
      id: 9,
      category: "security",
      question: "What should I do if I notice suspicious activity on my account?",
      answer:
        "Immediately change your password, enable two-factor authentication if not already active, review your recent login sessions in Settings → Security, and contact our support team. We'll help secure your account and investigate.",
    },
    {
      id: 10,
      category: "payments",
      question: "What payment methods does CLICS accept?",
      answer:
        "CLICS itself does not process payments for loans. For any premium features (future), we will support bank transfers, credit/debit cards, and digital wallets. Loan repayments are made directly to the respective bank as per their instructions.",
    },
    {
      id: 11,
      category: "payments",
      question: "How do I set up automatic EMI payments?",
      answer:
        "Once your loan is approved by the bank, you can set up auto-debit through the bank's portal or mobile app. Each bank has its own process. CLICS provides links to the bank's official application portal where you can manage payments.",
    },
    {
      id: 12,
      category: "general",
      question: "How can I contact CLICS customer support?",
      answer:
        "You can reach us via: Live chat (bottom-right corner, available 24/7), Email: support@clics.com, Phone: +92 (21) 1234-5678 (Mon-Sat, 9 AM - 6 PM), or use the Contact page form. We typically respond within 24 hours.",
    },
  ];

  const categories = [
    { value: "all", label: "All Topics", icon: Globe },
    { value: "loans", label: "Loans", icon: DollarSign },
    { value: "schemes", label: "Schemes", icon: PiggyBank },
    { value: "account", label: "Account", icon: User },
    { value: "security", label: "Security", icon: Shield },
    { value: "payments", label: "Payments", icon: CreditCard },
    { value: "general", label: "General", icon: HelpCircle },
  ];

  const quickLinks = [
    { title: "Getting Started", description: "Learn the basics of CLICS", icon: BookOpen, href: "/getting-started" },
    { title: "Video Tutorials", description: "Step-by-step video guides", icon: Video, href: "/tutorials" },
    { title: "Compare Banks", description: "Find the best bank for you", icon: Building2, href: "/banks" },
    { title: "Loan Calculator", description: "Calculate EMI & eligibility", icon: Calculator, href: "/calculator" },
    { title: "Expert Tips", description: "Advice on loans & investments", icon: Lightbulb, href: "/tips" },
    { title: "Support", description: "Get help from our team", icon: Headphones, href: "/contact" },
  ];

  // GSAP Animations
  useEffect(() => {
    gsap.fromTo(".hero-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    gsap.fromTo(".hero-subtitle", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
    gsap.fromTo(".search-bar", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.4 });

    if (quickLinksRef.current) {
      gsap.fromTo(".quick-link-card", { opacity: 0, y: 30 }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: { trigger: quickLinksRef.current, start: "top 85%" }
      });
    }
    if (faqRef.current) {
      gsap.fromTo(".faq-item", { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        scrollTrigger: { trigger: faqRef.current, start: "top 85%" }
      });
    }
  }, []);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const filteredFaqs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter((faq) => faq.category === selectedCategory);
  const searchedFaqs = filteredFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Help Center</span>
          </div>
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-4">How can we help you?</h1>
          <p className="hero-subtitle text-xl text-blue-100 mb-10">Search our knowledge base or browse by category</p>
          
          {/* Search Bar */}
          <div className="search-bar relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg rounded-2xl border-0 shadow-xl bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Quick Links */}
        <div ref={quickLinksRef} className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-10 text-center">Quick Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, idx) => (
              <Card key={idx} className="quick-link-card border-0 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer group bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <link.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg mb-1">{link.title}</h3>
                    <p className="text-slate-500 text-sm">{link.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.value
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div ref={faqRef}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Frequently Asked Questions</h2>
            <Badge variant="outline" className="text-sm px-3 py-1 bg-white border-slate-200">
              {searchedFaqs.length} {searchedFaqs.length === 1 ? "answer" : "answers"}
            </Badge>
          </div>

          {searchedFaqs.length === 0 ? (
            <Card className="border-0 shadow-xl rounded-2xl p-16 text-center bg-white">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No results found</h3>
              <p className="text-slate-500 mb-6">Try different keywords or browse all categories</p>
              <Button onClick={() => setSearchQuery("")} className="bg-blue-600 hover:bg-blue-700">
                Clear Search
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {searchedFaqs.map((faq) => (
                <Card key={faq.id} className="faq-item border-0 shadow-md rounded-xl overflow-hidden transition-all hover:shadow-lg bg-white">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${expandedFaq === faq.id ? "bg-blue-100" : "bg-slate-100"}`}>
                          <HelpCircle className={`w-5 h-5 ${expandedFaq === faq.id ? "text-blue-600" : "text-slate-500"}`} />
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-800 text-lg pr-4 text-left">{faq.question}</h3>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${expandedFaq === faq.id ? "rotate-180" : ""}`} />
                  </button>

                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6 pt-0 border-t border-slate-100 bg-slate-50/50">
                      <p className="text-slate-600 leading-relaxed pt-5">{faq.answer}</p>
                      <div className="mt-5 flex gap-2">
                        <Button size="sm" variant="outline" className="text-sm border-slate-200">
                          👍 Helpful
                        </Button>
                        <Button size="sm" variant="outline" className="text-sm border-slate-200">
                          👎 Not helpful
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support CTA */}
        <Card className="mt-16 p-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl rounded-2xl">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Still need help?</h2>
            <p className="text-blue-100 mb-8 text-lg">Our support team is available 24/7 to assist you</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" className="bg-white text-blue-600 hover:bg-slate-100 rounded-full px-6 py-2.5">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-6 py-2.5">
                <Phone className="w-4 h-4 mr-2" />
                Schedule a Call
              </Button>
            </div>
            <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
              <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> Live Chat</span>
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> clicsuwm.pk.67@gmail.com</span>
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +92 (21) 1234-5678</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}