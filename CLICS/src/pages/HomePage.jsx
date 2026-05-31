import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "../components/custom-ui/Button";
import { Input } from "../components/custom-ui/Input";
import { Card, CardContent } from "../components/custom-ui/Card";

import {
  Search,
  TrendingUp,
  Shield,
  Zap,
  MessageSquare,
  Bell,
  Building2,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

import {
  fadeUp,
  scrollFadeUp,
  scrollStagger,
} from "../animations/gsapAnimations";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fadeUp(".hero-title");
    fadeUp(".hero-subtitle", 0.2);
    fadeUp(".hero-search", 0.4);
    fadeUp(".hero-badge", 0.1);

    scrollStagger(".feature-card");
    scrollStagger(".bank-card");
    scrollFadeUp(".cta-section");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    const types = ["personal", "car", "home", "student", "business"];
    const match = types.find((t) => query.includes(t));

    navigate(
      match ? `/schemes?type=${match}` : `/schemes?search=${searchQuery}`,
    );
  };

  return (
    <main className="flex-1 overflow-hidden">
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="hero-title pb-5 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-900 via-indigo-800 to-cyan-800 bg-clip-text text-transparent">
            Compare Banking Schemes
          </h1>

          <p className="hero-subtitle mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t(
              "home.heroSubtitle",
              "Explore and compare banking schemes from Pakistan's leading banks",
            )}
          </p>

          {/* Search box with glass effect */}
          <div className="hero-search max-w-2xl mx-auto mt-10">
            <form
              onSubmit={handleSearch}
              className="flex gap-3 p-1 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50"
            >
              <Input
                placeholder={t(
                  "home.searchPlaceholder",
                  "Search for personal, car, home, student, or business loans...",
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              />
              <Button className="h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md transition-all duration-300">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </form>

            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              {["personal", "car", "home", "student", "business"].map(
                (loanType) => (
                  <Button
                    key={loanType}
                    variant="outline"
                    size="sm"
                    className="capitalize rounded-full border-gray-300 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-blue-400 hover:shadow-md transition-all"
                    onClick={() => navigate(`/schemes?type=${loanType}`)}
                  >
                    {t(
                      `home.loanTypes.${loanType}`,
                      `${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loans`,
                    )}
                  </Button>
                ),
              )}
            </div>
          </div>

          {/* Trust badge */}
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Trusted by over 10,000+ users</span>
          </div>
        </div>
      </section>

      {/* ================= FEATURES (Modern Cards) ================= */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {t(
                "home.featuresHeading",
                "Everything you need to find the perfect loan",
              )}
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              Powerful tools to compare, analyze, and choose the best banking
              scheme
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Search,
                title: t("home.features.search.title", "Comprehensive Search"),
                desc: t(
                  "home.features.search.desc",
                  "Search all loan types across multiple banks",
                ),
                color: "blue",
              },
              {
                icon: TrendingUp,
                title: t("home.features.compare.title", "Side-by-Side Compare"),
                desc: t(
                  "home.features.compare.desc",
                  "Compare rates, fees, and terms instantly",
                ),
                color: "indigo",
              },
              {
                icon: MessageSquare,
                title: t("home.features.chatbot.title", "AI Chatbot Assistant"),
                desc: t(
                  "home.features.chatbot.desc",
                  "Get evidence-based answers 24/7",
                ),
                color: "cyan",
              },
              {
                icon: Shield,
                title: t("home.features.verified.title", "Verified Sources"),
                desc: t(
                  "home.features.verified.desc",
                  "Direct from original bank documents",
                ),
                color: "green",
              },
              {
                icon: Bell,
                title: t("home.features.alerts.title", "Real-Time Alerts"),
                desc: t(
                  "home.features.alerts.desc",
                  "Get notified on rate changes & offers",
                ),
                color: "orange",
              },
              {
                icon: Zap,
                title: t("home.features.export.title", "Export & Share"),
                desc: t(
                  "home.features.export.desc",
                  "Download reports as PDF or CSV",
                ),
                color: "purple",
              },
            ].map((f, i) => {
              const colorMap = {
                blue: "from-blue-500 to-blue-600",
                indigo: "from-indigo-500 to-indigo-600",
                cyan: "from-cyan-500 to-cyan-600",
                green: "from-green-500 to-green-600",
                orange: "from-orange-500 to-orange-600",
                purple: "from-purple-500 to-purple-600",
              };
              return (
                <Card
                  key={i}
                  className="feature-card group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                >
                  <CardContent className="p-8">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[f.color]} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <f.icon className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {f.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= BANKS (Improved Logos) ================= */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {t("home.banksHeading", "Trusted by data from leading banks")}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 max-w-6xl mx-auto">
            {[
              "HBL",
              "UBL",
              "MCB",
              "ABL",
              "Meezan",
              "Faysal",
              "Askari",
              "JS Bank",
            ].map((bank) => (
              <div key={bank} className="bank-card group">
                <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                  <div className="w-14 h-14 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Building2 className="text-blue-600 w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {bank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA (Enhanced Gradient + Animation) ================= */}
      <section className="cta-section py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220%200%2060%2060%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {t("home.ctaTitle", "Ready to find your perfect loan?")}
          </h2>
          <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
            {t(
              "home.ctaSubtitle",
              "Join thousands who trust CLICS for smart banking decisions",
            )}
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <Button
            variant="primary"
              className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              onClick={() => navigate("/schemes")}
            >
              Browse Loans <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full text-lg font-semibold backdrop-blur-sm transition-all"
              onClick={() => navigate("/register")}
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
