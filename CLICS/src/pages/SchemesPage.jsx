import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";

import { LoanCard } from "../components/loan-card";
import { Button } from "../components/custom-ui/Button";
import { Input } from "../components/custom-ui/Input";
import { Label } from "../components/custom-ui/Label";
import { Checkbox } from "../components/custom-ui/Checkbox";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/custom-ui/Card";
import { Slider } from "../components/custom-ui/Slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/custom-ui/Select";

import { ArrowUpDown, Filter, Search } from "lucide-react";
import gsap from "gsap";
import api from "../utils/axios"; // axios instance

export default function SchemesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loans, setLoans] = useState([]);
  const [banks, setBanks] = useState([]);
  // Add this to your useState section
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [amountRange, setAmountRange] = useState([0, 50000000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [compareList, setCompareList] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  const gridRef = useRef(null);

  const loanTypes = ["personal", "car", "home", "student", "business"];

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const res = await api.get("/loanSchemes/getAll");

        const schemes = res.data.data.allLoanScheme;

        const formatted = schemes.map((scheme) => ({
          id: scheme._id,
          name: scheme.schemeName,
          bank: scheme.bankId.name || "Unknown Bank",
          bankId: scheme.bankId?._id,
          type: scheme.typeLoan,
          interestRate: `${scheme.interestRate}%`,
          tenure: `${scheme.tenureMin} - ${scheme.tenureMax} months`,
          minAmount: scheme.minSalaryRequired || 0,
          features: [
            scheme.interestType,
            scheme.processingFee,
            scheme.isIslamic ? "Islamic" : "Conventional",
          ],
          verified: scheme.isVerified,
        }));

        setLoans(formatted);

        const uniqueBanks = [
          ...new Set(formatted.map((loan) => loan.bank)),
        ].filter(Boolean);

        setBanks(uniqueBanks);
      } catch (error) {
        console.log("Loan fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleCompare = async () => {
    try {
      setLoading(true);
      console.debug("Comparing schemes with IDs:", compareList);
      const res = await api.post("schemes/comparison", { ids: compareList });
      console.debug("Comparison response:", res);

      const comparisonId = res.data?._id || res.data?.data?._id;
      if (comparisonId) {
        // Navigate to the compare page with the saved comparison ID
        navigate(`/compare?comparisonId=${comparisonId}`);
      } else {
        console.warn("No comparison ID returned", comparisonId, res);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create comparison");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleBankToggle = (bank) => {
    setSelectedBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank],
    );
  };

  const handleCompareToggle = (id) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else if (prev.length < 4) {
        const newLoan = loans.find((l) => l.id === id);

        if (prev.length > 0) {
          const firstSelectedLoan = loans.find((l) => l.id === prev[0]);

          if (
            newLoan &&
            firstSelectedLoan &&
            newLoan.type !== firstSelectedLoan.type
          ) {
            alert(
              `You can only compare loans of the same type. Currently comparing ${firstSelectedLoan.type} loans.`,
            );
            return prev;
          }
        }

        return [...prev, id];
      } else {
        alert("You can only compare up to 4 loans.");
      }

      return prev;
    });
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedBanks([]);
    setAmountRange([0, 50000000]);
    setSearchQuery("");
  };

  useEffect(() => {
    if (!hasInitialized) {
      const typeParam = searchParams.get("type");
      const bankParam = searchParams.get("bank");
      const searchParam = searchParams.get("search");

      if (typeParam) setSelectedTypes([typeParam]);
      if (bankParam) setSelectedBanks([bankParam]);
      if (searchParam) setSearchQuery(searchParam);

      setHasInitialized(true);
    }
  }, [searchParams, hasInitialized]);

  useEffect(() => {
    if (gridRef.current && hasInitialized) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    }
  }, [selectedTypes, selectedBanks, searchQuery, amountRange, sortBy]);

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(loan.type);

    const matchesBank =
      selectedBanks.length === 0 || selectedBanks.includes(loan.bank);

    const matchesAmount =
      loan.minAmount >= amountRange[0] && loan.minAmount <= amountRange[1];

    return matchesSearch && matchesType && matchesBank && matchesAmount;
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    switch (sortBy) {
      case "interest-low":
        return parseFloat(a.interestRate) - parseFloat(b.interestRate);
      case "interest-high":
        return parseFloat(b.interestRate) - parseFloat(a.interestRate);
      default:
        return 0;
    }
  });

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(amount);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading your Scheme Loan...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <main className="flex-1">
        {/* HEADER */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Banking Schemes</h1>
            <p className="text-gray-600">Explore and compare loan schemes</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* FILTERS */}
            <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <Card className="sticky top-20">
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>Filters</CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* TYPES */}
                  <div>
                    <Label className="font-semibold mb-3 block">
                      Loan Type
                    </Label>
                    {loanTypes.map((type) => (
                      <div key={type} className="flex gap-2">
                        <Checkbox
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleTypeToggle(type)}
                        />
                        <label className="capitalize">{type}</label>
                      </div>
                    ))}
                  </div>

                  {/* BANKS */}
                  <div>
                    <Label className="font-semibold mb-3 block">Banks</Label>
                    {banks.map((bank) => (
                      <div key={bank} className="flex gap-2">
                        <Checkbox
                          checked={selectedBanks.includes(bank)}
                          onCheckedChange={() => handleBankToggle(bank)}
                        />
                        <label>{bank}</label>
                      </div>
                    ))}
                  </div>

                  {/* AMOUNT */}
                  <div>
                    <Label className="font-semibold mb-3 block">
                      Salary Required
                    </Label>

                    <Slider
                      min={0}
                      max={500000}
                      step={5000}
                      value={amountRange}
                      onValueChange={setAmountRange}
                    />

                    <p className="text-sm text-gray-500 mt-2">
                      {formatAmount(amountRange[0])} -{" "}
                      {formatAmount(amountRange[1])}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* CONTENT */}
            <div className="space-y-6">
              {/* SEARCH */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4" />

                  <Input
                    className="pl-9"
                    placeholder="Search schemes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="`w-[180px]`">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="interest-low">
                      Interest: Low to High
                    </SelectItem>
                    <SelectItem value="interest-high">
                      Interest: High to Low
                    </SelectItem>
                    <SelectItem value="amount-low">
                      Amount: Low to High
                    </SelectItem>
                    <SelectItem value="amount-high">
                      Amount: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* RESULT COUNT */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {sortedLoans.length} of {loans.length} schemes
                </p>

                {compareList.length > 0 && (
                  <Button onClick={handleCompare} disabled={loading}>
                    {compareList.length} Scheme
                    {compareList.length > 1 ? "s" : ""}
                    {loading ? "Comparing..." : "Compare Now"}
                  </Button>
                )}
              </div>

              {/* LOAN CARDS */}
              <div ref={gridRef} className="grid md:grid-cols-2 gap-6">
                {sortedLoans.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    loan={loan}
                    onCompare={handleCompareToggle}
                    isComparing={compareList.includes(loan.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-blue-600 shadow-lg z-40   lg:hidden">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium">
                  {compareList.length} scheme{compareList.length > 1 ? "s" : ""}{" "}
                  selected
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCompareList([])}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Link to={`/compare?ids=${compareList.join(",")}`}>
                      Compare Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
