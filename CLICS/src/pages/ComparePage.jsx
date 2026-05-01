import { useState, useEffect, useRef } from "react";
import { Button } from "../components/custom-ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/custom-ui/Card";
import { ArrowLeft, X, CheckCircle, Download } from "lucide-react";
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
import api from "../utils/axios";

// export default function ComparePage() {
//   console.log("🔥 ComparePage is rendering");
// }

export default function ComparePage() {
  console.log("🔥 ComparePage is rendering");
  const [searchParams] = useSearchParams();
  console.log(
    "SearchParams: ",
    searchParams,
    "IDS:",
    searchParams.get("comparisonId"),
  );

  const navigate = useNavigate();

  const comparisonId = searchParams.get("comparisonId");
  console.log("comparison ID", comparisonId);

  const containerRef = useRef(null);
  const cardsRef = useRef(null);

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

        // Token is added automatically by axios interceptor
        const res = await api.get(`schemes/comparison/${comparisonId}`);
        console.log("Response:", res);

        const formatted = res.data.data.schemeIds.map((scheme) => ({
          id: scheme._id,
          bank: scheme.bankId?.name || "Unknown Bank",
          name: scheme.schemeName,
          type: scheme.typeLoan,
          interestRate: `${scheme.interestRate}%`,
          minAmount: scheme.minSalaryRequired || 0,
          maxAmount: scheme.maxAmount || 0,
          tenure: `${scheme.tenureMin} - ${scheme.tenureMax} months`,
          processingFee:
            typeof scheme.processingFee === "number"
              ? `${scheme.processingFee}%`
              : scheme.processingFee,
          eligibility: [scheme.eligibilityCriteria],
          features: [scheme.eligibilityCriteria, scheme.requiredDocuments],
          lastUpdated: new Date(scheme.updatedAt).toLocaleDateString(),
          verified: scheme.isVerified,
          isIslamic: scheme.isIslamic ? "Yes" : "No",
          status: scheme.status,
        }));

        console.debug("Formatted comparison data:", formatted);
        setSelectedLoans(formatted);
      } catch (err) {
        console.error("Fetch comparison error:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [comparisonId, navigate]);

  /* ================= ANIMATIONS ================= */
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
      );
    }
  }, []);

  useEffect(() => {
    if (cardsRef.current && selectedLoans.length > 0) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.1 },
      );
    }
  }, [selectedLoans]);

  /* ================= HELPERS ================= */
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /* ================= DELETE ================= */
  const handleRemove = async (schemeId) => {
    try {
      // Token is added automatically by axios interceptor
      await api.delete(`schemes/comparison/${schemeId}`, {
        data: {
          comparisonId,
        },
      });

      setSelectedLoans((prev) => prev.filter((loan) => loan.id !== schemeId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to remove scheme");
    }
  };

  /* ================= CHART DATA ================= */
  const chartData = selectedLoans.map((loan) => ({
    name: loan.bank,
    interestRate: Number(loan.interestRate.replace("%", "")),
    maxAmount: loan.maxAmount / 1000000,
  }));

  const projectedReturnsData = [3, 6, 12, 24, 36].map((months) => {
    const dataPoint = { months };

    selectedLoans.forEach((loan) => {
      const rate = Number(loan.interestRate.replace("%", "")) / 100;
      const principal = 100000;
      const returns = principal * (1 + rate * (months / 12));
      dataPoint[loan.bank] = Math.round(returns);
    });

    return dataPoint;
  });

  /* ================= LOADING ================= */
  if (loading) {
    return <div className="text-center py-20">Loading comparison...</div>;
  }

  /* ================= EMPTY STATE ================= */
  if (!comparisonId || comparisonId?.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-3">No schemes to compare</h2>
        <p className="mb-4 text-gray-500">
          Please select schemes to compare first
        </p>
        <Link to="/schemes">
          <Button>Browse Schemes</Button>
        </Link>
      </div>
    );
  }

  /* ================= TABLE CONFIG ================= */
  const features = [
    { label: "Scheme Name", key: "name" },
    { label: "Interest Rate", key: "interestRate" },
    { label: "Type", key: "type" },
    { label: "Min Amount", key: "minAmount", format: formatAmount },
    { label: "Tenure", key: "tenure" },
    { label: "Status", key: "status" },
    { label: "Islamic", key: "isIslamic" },
    { label: "Verified", key: "verified" },
  ];

  return (
    <main ref={containerRef} className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <Button asChild>
          <Link to="/schemes">
            <ArrowLeft /> Back
          </Link>
        </Button>

        <Button onClick={() => window.print()} className="bg-green-600">
          <Download /> Download
        </Button>
      </div>

      {/* TABLE */}
      <Card ref={cardsRef}>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Feature</th>
                  {selectedLoans.map((loan) => (
                    <th key={loan.id} className="relative">
                      <button
                        onClick={() => handleRemove(loan.id)}
                        className="absolute top-1 right-1"
                      >
                        <X size={14} />
                      </button>
                      {loan.bank}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {features.map((f) => (
                  <tr key={f.key}>
                    <td>{f.label}</td>
                    {selectedLoans.map((loan) => {
                      let value = loan[f.key];

                      if (f.format) value = f.format(value);

                      return <td key={loan.id}>{value}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Interest Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="interestRate" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Returns Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={projectedReturnsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="months" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedLoans.map((loan, i) => (
                  <Line key={i} dataKey={loan.bank} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* FEATURES */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          {selectedLoans.map((loan) => (
            <div key={loan.id}>
              <h4 className="font-bold mb-2">{loan.bank}</h4>
              <ul>
                {loan.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle size={14} /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
