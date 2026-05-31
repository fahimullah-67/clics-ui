"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/custom-ui/Card";
import { Button } from "../components/custom-ui/Button";
import { Badge } from "../components/custom-ui/Badge";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Clock,
  Shield,
  BookOpen,
  Heart,
  GitCompare,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../utils/axios";

gsap.registerPlugin(ScrollTrigger);

export default function SchemeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true);
        const res = await api.get("/loanSchemes/getOne", { params: { id } });
        const data = res?.data?.data;

        const formatted = {
          id: data._id,
          name: data.schemeName,
          bank: data.bankId?.name || "Unknown Bank",
          bankLogo: data.bankId?.logo || null,
          type: data.typeLoan,
          interestRate: `${data.interestRate}%`,
          interestType: data.interestType,
          minAmount: data.minSalaryRequired || 0,
          maxAmount: data.maxLoanAmount || 0,
          tenureMin: data.tenureMin,
          tenureMax: data.tenureMax,
          processingFee:
            data.processingFee === "percentage"
              ? `${data.processingFeeValue}%`
              : data.processingFee,
          eligibilityCriteria: data.eligibilityCriteria,
          requiredDocuments: data.requiredDocuments,
          lastUpdated: new Date(data.updatedAt).toLocaleDateString(),
          description: data.description,
          isVerified: data.isVerified,
          ageMin: data.ageMin,
          ageMax: data.ageMax,
          isIslamic: data.isIslamic,
          status: data.status,
          verifiedBy: data.verifiedBY,
        };

        setScheme(formatted);

        setTimeout(() => {
          gsap.fromTo(
            ".page-animate",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7 },
          );
          gsap.utils.toArray(".detail-section").forEach((section) => {
            gsap.fromTo(
              section,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                scrollTrigger: { trigger: section, start: "top 85%" },
              },
            );
          });
        }, 100);
      } catch (err) {
        console.error(err);
        setError("Failed to load scheme");
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  const handleAddToWatchlist = async () => {
    try {
      setAddingToWatchlist(true);
      await api.post("watchlist/addWatchlist", { loanSchemeId: scheme.id });
      alert("Scheme added to watchlist!");
    } catch (error) {
      let errorMessage = "Failed to add to watchlist";
      if (error.response?.data?.error) errorMessage = error.response.data.error;
      else if (error.response?.data?.message)
        errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      alert(errorMessage);
    } finally {
      setAddingToWatchlist(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading scheme details...</p>
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || "Scheme not found"}</p>
          <Button onClick={() => navigate("/schemes")}>Back to Schemes</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 page-animate"
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/schemes")}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Schemes
        </Button>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Main Header Card */}
          <Card className="detail-section shadow-xl border-0 overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-8 md:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {scheme.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Building2 className="w-4 h-4 text-blue-200" />
                    <p className="text-blue-100">{scheme.bank}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-white/20 text-white border-0 capitalize px-3 py-1">
                    {scheme.type}
                  </Badge>
                  {scheme.isIslamic && (
                    <Badge className="bg-emerald-500/80 text-white border-0">
                      Islamic
                    </Badge>
                  )}
                  <Badge
                    className={`capitalize ${
                      scheme.status === "active"
                        ? "bg-green-500/80"
                        : "bg-yellow-500/80"
                    } text-white border-0`}
                  >
                    {scheme.status}
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard
                  icon={<Percent className="w-5 h-5" />}
                  label="Interest Rate"
                  value={`${scheme.interestRate} ${scheme.interestType ? `(${scheme.interestType})` : ""}`}
                  color="blue"
                />
                <InfoCard
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Loan Amount"
                  value={`PKR ${scheme.minAmount.toLocaleString()} - ${scheme.maxAmount.toLocaleString()}`}
                  color="green"
                />
                <InfoCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="Tenure"
                  value={`${scheme.tenureMin} - ${scheme.tenureMax} months`}
                  color="purple"
                />
                <InfoCard
                  icon={<Building2 className="w-5 h-5" />}
                  label="Processing Fee"
                  value={scheme.processingFee || "Not specified"}
                  color="orange"
                />
                <InfoCard
                  icon={<Users className="w-5 h-5" />}
                  label="Age Limit"
                  value={`${scheme.ageMin} - ${scheme.ageMax} years`}
                  color="cyan"
                />
                <InfoCard
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Min. Salary"
                  value={`PKR ${scheme.minAmount.toLocaleString()}`}
                  color="emerald"
                />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="detail-section border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5 text-blue-600" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-700 leading-relaxed">
                {scheme.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card className="detail-section border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="w-5 h-5 text-blue-600" />
                Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {scheme.eligibilityCriteria ||
                    "No specific eligibility criteria provided."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card className="detail-section border-0 shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="border-b bg-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {scheme.requiredDocuments || "No document list provided."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card
            className={`detail-section border-0 shadow-md rounded-2xl overflow-hidden ${
              scheme.isVerified ? "bg-green-50/50" : "bg-yellow-50/50"
            }`}
          >
            <CardHeader className="border-b border-transparent">
              <CardTitle
                className={`flex items-center gap-2 text-xl ${
                  scheme.isVerified ? "text-green-700" : "text-yellow-700"
                }`}
              >
                {scheme.isVerified ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheme.isVerified ? (
                <div className="flex items-center gap-3 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    Verified by {scheme.verifiedBy || "Admin"} • Last updated:{" "}
                    {scheme.lastUpdated}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-yellow-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>Not Verified Yet • Status: {scheme.status}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="detail-section flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl py-6 text-base font-semibold shadow-md transition-all flex items-center justify-center gap-2"
              onClick={() => navigate(`/compare?ids=${scheme.id}`)}
            >
              <GitCompare className="w-5 h-5" />
              Add to Comparison
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl py-6 text-base font-semibold transition-all flex items-center justify-center gap-2"
              disabled={addingToWatchlist}
              onClick={handleAddToWatchlist}
            >
              <Heart
                className={`w-5 h-5 ${addingToWatchlist ? "animate-pulse" : ""}`}
              />
              {addingToWatchlist ? "Adding..." : "Add to Watchlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable info card component
function InfoCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    cyan: "bg-cyan-100 text-cyan-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">
          {label}
        </p>
        <p className="text-base md:text-lg font-bold text-slate-800 mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}