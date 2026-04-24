"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "../components/ui/use-toast";
import axios from "axios";

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
  MessageCircleWarningIcon,
} from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../utils/axios";
// import { toast } from "../hooks/use-toast";

gsap.registerPlugin(ScrollTrigger);

export default function SchemeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  // const { toast } = toast();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  /* ✅ FETCH FROM API */
  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true);

        const res = await api.get("/loanSchemes/getOne", {
          params: { id },
        });

        // console.log("FULL RESPONSE:", res);
        // console.log("DATA:", res.data);

        const data = res?.data?.data;

        // if (!data) {
        //   throw new Error("No data received from API");
        // } else {
        //   console.log("Received scheme data:", data);
        // }

        const formatted = {
          id: data._id,

          name: data.schemeName,
          bank: data.bankId?.name || "Unknown Bank",
          type: data.typeLoan,

          interestRate: `${data.interestRate}% (${data.interestType})`,

          minAmount: data.minSalaryRequired || 0,
          maxAmount: 0,

          tenure: `${data.tenureMin} - ${data.tenureMax} months`,

          processingFee:
            data.processingFee === "percentage"
              ? `${data.processingFee}%`
              : data.processingFee,

          // features: [data.eligibilityCriteria, data.requiredDocuments],
          eligibilityCriteria: data.eligibilityCriteria,
          requiredDocuments: data.requiredDocuments,

          lastUpdated: new Date(data.updatedAt).toLocaleDateString(),

          description: data.description,
          isVerified: data.isVerified,

          ageRange: `${data.ageMin} - ${data.ageMax}`,
          isIslamic: data.isIslamic,
          status: data.status,
          verifiedBy: data.verifiedBY,
        };

        setScheme(formatted);

        /* Animations */
        setTimeout(() => {
          gsap.fromTo(
            ".page-animate",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8 },
          );

          gsap.utils.toArray(".detail-section").forEach((section) => {
            gsap.fromTo(
              section,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                scrollTrigger: {
                  trigger: section,
                  start: "top 85%",
                },
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

  /* 🔄 LOADING */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading scheme...</p>
      </div>
    );
  }

  /* ❌ ERROR */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => navigate("/schemes")}>Back</Button>
        </div>
      </div>
    );
  }

  /* ❌ NOT FOUND */
  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2>Scheme not found</h2>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 page-animate"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate("/schemes")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Schemes
        </Button>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* HEADER */}
          <Card className="detail-section shadow-xl border-0 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
              <TrendingUp className="w-16 h-16 text-white" />
            </div>

            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{scheme.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {scheme.bank}
                  </CardDescription>
                </div>
                <Badge>{scheme.type}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InfoItem
                    icon={<Percent />}
                    label="Interest Rate"
                    value={scheme.interestRate}
                    color="blue"
                  />
                  <InfoItem
                    icon={<DollarSign />}
                    label="Loan Amount"
                    value={`PKR ${scheme.minAmount?.toLocaleString()} - ${scheme.maxAmount?.toLocaleString()}`}
                    color="green"
                  />
                </div>

                <div className="space-y-4">
                  <InfoItem
                    icon={<Calendar />}
                    label="Tenure"
                    value={scheme.tenure}
                    color="purple"
                  />
                  <InfoItem
                    icon={<Building2 />}
                    label="Processing Fee"
                    value={scheme.processingFee}
                    color="orange"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FEATURES */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{scheme.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{scheme.eligibilityCriteria}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{scheme.requiredDocuments}</p>
            </CardContent>
          </Card>

          <Card className="detail-section shadow-lg border-0">
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-6">
              <InfoItem
                icon={<Calendar />}
                label="Age Limit"
                value={scheme.ageRange}
                color="purple"
              />

              <InfoItem
                icon={<DollarSign />}
                label="Minimum Salary"
                value={`PKR ${scheme.minAmount.toLocaleString()}`}
                color="green"
              />

              <InfoItem
                icon={<Building2 />}
                label="Bank Type"
                value={scheme.isIslamic ? "Islamic" : "Conventional"}
                color="blue"
              />

              <InfoItem
                icon={<Percent />}
                label="Status"
                value={scheme.status}
                color="orange"
              />
            </CardContent>
          </Card>

          {/* VERIFICATION */}
          <Card
            className={`detail-section shadow-lg border ${
              scheme.isVerified
                ? "border-green-200 bg-green-50"
                : "border-yellow-200 bg-yellow-50"
            }`}
          >
            <CardHeader>
              <CardTitle
                className={`flex gap-2 ${
                  scheme.isVerified ? "text-green-800" : "text-yellow-800"
                }`}
              >
                <CheckCircle2 />
                Verification Status
              </CardTitle>
            </CardHeader>

            <CardContent>
              {scheme.isVerified ? (
                <p className="text-green-700">
                  <CheckCircle2 /> Verified by {scheme.verifiedBy || "Admin"}
                  <br />
                  Last updated: {scheme.lastUpdated}
                </p>
              ) : (
                <p className="text-yellow-700">
                  <MessageCircleWarningIcon></MessageCircleWarningIcon> Not
                  Verified Yet <br />
                  Status: {scheme.status}
                </p>
              )}
            </CardContent>
          </Card>

          {/* ACTIONS */}
          <div className="detail-section flex gap-4">
            <Button
              className="flex-1 bg-blue-600"
              onClick={() => {
                // Handle add to comparison logic
              }}
            >
              Add to Comparison
            </Button>

            <Button
              variant="outline"
              className="flex-1"
              disabled={addingToWatchlist}
              onClick={async () => {
                try {
                  setAddingToWatchlist(true);
                  const response = await api.post("watchlist/addWatchlist", {
                    loanSchemeId: scheme.id,
                  });
                  console.log("Response", response);

                  alert("Scheme added to watchlist!");
                  // toast({
                  //   title: "Success",
                  //   description: "Scheme added to watchlist!",
                  //   variant: "success",
                  // });
                } catch (error) {
                  console.error("Watchlist error full:", error);
                  console.error("Error response:", error.response?.data);

                  // Try multiple paths to extract error message
                  let errorMessage = "Failed to add to watchlist";

                  console.log("Response", error.response);

                  if (error.response?.data?.error) {
                    errorMessage = error.response.data.error;
                  } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                  } else if (error.message) {
                    errorMessage = error.message;
                  }

                  console.log("Final error message:", errorMessage);
                  alert(errorMessage);
                  // toast({
                  //   title: "Error",
                  //   description: errorMessage,
                  //   variant: "destructive",
                  // });
                } finally {
                  setAddingToWatchlist(false);
                }
              }}
            >
              {addingToWatchlist ? "Adding..." : "Add to Watchlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*  INFO ITEM */
function InfoItem({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-600">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
