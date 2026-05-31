import { useState, useEffect, useRef } from "react";
import { Button } from "../components/custom-ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/custom-ui/Card";
import {
  ArrowLeft,
  X,
  CheckCircle,
  Download,
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  Building2,
  Shield,
  Clock,
  Banknote,
} from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../utils/axios";

gsap.registerPlugin(ScrollTrigger);

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const comparisonId = searchParams.get("comparisonId");

  const containerRef = useRef(null);
  const cardsRef = useRef(null);
  const chartsRef = useRef(null);

  const [selectedLoans, setSelectedLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!comparisonId) {
      setLoading(false);
      return;
    }

    const fetchComparison = async () => {
      try {
        setLoading(true);
        const res = await api.get(`schemes/comparison/${comparisonId}`);
        const formatted = res.data.data.schemeIds.map((scheme) => ({
          id: scheme._id,
          bank: scheme.bankId?.name || "Unknown Bank",
          name: scheme.schemeName,
          type: scheme.typeLoan,
          interestRate: `${scheme.interestRate}%`,
          interestRateValue: scheme.interestRate,
          minAmount: scheme.minSalaryRequired || 0,
          maxAmount: scheme.maxAmount || 0,
          tenure: `${scheme.tenureMin} - ${scheme.tenureMax} months`,
          processingFee:
            typeof scheme.processingFee === "number"
              ? `${scheme.processingFee}%`
              : scheme.processingFee,
          eligibility: scheme.eligibilityCriteria,
          documents: scheme.requiredDocuments,
          lastUpdated: new Date(scheme.updatedAt).toLocaleDateString(),
          verified: scheme.isVerified,
          isIslamic: scheme.isIslamic ? "Yes" : "No",
          status: scheme.status,
        }));
        setSelectedLoans(formatted);
      } catch (err) {
        console.error("Fetch comparison error:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          alert("Failed to load comparison data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [comparisonId, navigate]);

  // Animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    }
  }, []);

  useEffect(() => {
    if (cardsRef.current && selectedLoans.length > 0) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }
      );
    }
    if (chartsRef.current) {
      gsap.fromTo(
        chartsRef.current.children,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, stagger: 0.2, duration: 0.6, scrollTrigger: { trigger: chartsRef.current, start: "top 85%" } }
      );
    }
  }, [selectedLoans]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRemove = async (schemeId) => {
    try {
      await api.delete(`schemes/comparison/${schemeId}`, {
        data: { comparisonId },
      });
      setSelectedLoans((prev) => prev.filter((loan) => loan.id !== schemeId));
      if (selectedLoans.length === 1) {
        navigate("/schemes");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to remove scheme");
    }
  };

  // Chart data
  const chartData = selectedLoans.map((loan) => ({
    name: loan.bank,
    interestRate: loan.interestRateValue,
    maxAmount: loan.maxAmount / 1000000,
  }));

  const projectedReturnsData = [3, 6, 12, 24, 36].map((months) => {
    const dataPoint = { months };
    selectedLoans.forEach((loan) => {
      const rate = loan.interestRateValue / 100;
      const principal = 100000;
      const returns = Math.round(principal * (1 + rate * (months / 12)));
      dataPoint[loan.bank] = returns;
    });
    return dataPoint;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  if (!comparisonId || selectedLoans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">No schemes to compare</h2>
          <p className="text-slate-500 mb-6">Please select schemes to compare first</p>
          <Link to="/schemes">
            <Button className="bg-blue-600 hover:bg-blue-700">Browse Schemes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-8 px-6 mb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                <TrendingUp className="w-8 h-8" />
                Compare Loan Schemes
              </h1>
              <p className="text-blue-100 mt-1">Side-by-side comparison of {selectedLoans.length} selected schemes</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate("/schemes")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
              variant="solid"
                className="bg-white text-blue-900 hover:bg-gray-100"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Comparison Cards Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {selectedLoans.map((loan) => (
            <Card key={loan.id} className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow relative group">
              <button
                onClick={() => handleRemove(loan.id)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                title="Remove from comparison"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">{loan.bank}</span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">{loan.name}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">{loan.type}</span>
                  {loan.isIslamic === "Yes" && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">Islamic</span>}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${loan.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {loan.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Percent className="w-4 h-4" />
                    <span className="text-sm">Interest Rate</span>
                  </div>
                  <span className="font-bold text-lg text-blue-600">{loan.interestRate}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Banknote className="w-4 h-4" />
                    <span className="text-sm">Min. Amount</span>
                  </div>
                  <span className="font-semibold">{formatAmount(loan.minAmount)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Tenure</span>
                  </div>
                  <span className="font-semibold">{loan.tenure}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                  {loan.verified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div ref={chartsRef} className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-blue-600" />
                Interest Rate Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fill: "#475569" }} />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="interestRate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-slate-500 mt-2">Interest Rate (%)</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Returns Projection (PKR 100,000 loan)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectedReturnsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="months" tick={{ fill: "#475569" }} />
                  <YAxis tick={{ fill: "#475569" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(value) => [`PKR ${value.toLocaleString()}`, ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  {selectedLoans.map((loan, i) => (
                    <Line key={i} type="monotone" dataKey={loan.bank} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} strokeWidth={2} dot={{ r: 4 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-slate-500 mt-2">Total repayment over time (months)</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Features & Eligibility */}
        <div className="grid md:grid-cols-2 gap-8">
          {selectedLoans.map((loan, idx) => (
            <Card key={idx} className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  {loan.bank} - {loan.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Eligibility
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{loan.eligibility || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Required Documents
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{loan.documents || "Not specified"}</p>
                </div>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                  Last updated: {loan.lastUpdated}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      
    </div>
  );
}