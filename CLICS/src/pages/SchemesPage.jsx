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
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ArrowUpDown,
  Activity,
} from "lucide-react";
import gsap from "gsap";
import api from "../utils/axios";

export default function SchemesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loans, setLoans] = useState([]);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [amountRange, setAmountRange] = useState([0, 50000000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [compareList, setCompareList] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const gridRef = useRef(null);
  const loanTypes = ["personal", "car", "home", "student", "business"];

  // Fetch loans
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
      const res = await api.post("schemes/comparison", { ids: compareList });
      const comparisonId = res.data?._id || res.data?.data?._id;
      if (comparisonId) navigate(`/compare?comparisonId=${comparisonId}`);
      else alert("Failed to create comparison");
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
    setCurrentPage(1);
  };

  const handleBankToggle = (bank) => {
    setSelectedBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank],
    );
    setCurrentPage(1);
  };

  const handleCompareToggle = (id) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length < 4) {
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
        return prev;
      }
    });
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedBanks([]);
    setAmountRange([0, 50000000]);
    setSearchQuery("");
    setCurrentPage(1);
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

  // Animation when filtered results change
  useEffect(() => {
    if (gridRef.current && hasInitialized) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
      );
    }
  }, [
    selectedTypes,
    selectedBanks,
    searchQuery,
    amountRange,
    sortBy,
    currentPage,
  ]);

  // Filter and sort
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

  // Pagination logic
  const totalPages = Math.ceil(sortedLoans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLoans = sortedLoans.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(amount);

  // Loading skeleton
  if (loading && loans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading loan schemes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <main className="flex-1">
        {/* Header - modern gradient */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Banking Schemes
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              Explore and compare loan schemes from Pakistan's top banks
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* FILTERS SIDEBAR - now scrollable */}
            <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <Card className="sticky top-24 shadow-md border-0 rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Filter className="h-5 w-5 text-blue-600" />
                      Filters
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear all
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Loan Type */}
                  <div>
                    <Label className="font-semibold text-gray-700 mb-3 block">
                      Loan Type
                    </Label>
                    <div className="space-y-2">
                      {loanTypes.map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => handleTypeToggle(type)}
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="text-sm capitalize cursor-pointer"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Banks - scrollable if many */}
                  <div>
                    <Label className="font-semibold text-gray-700 mb-3 block">
                      Banks
                    </Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {banks.map((bank) => (
                        <div key={bank} className="flex items-center gap-2">
                          <Checkbox
                            id={`bank-${bank}`}
                            checked={selectedBanks.includes(bank)}
                            onCheckedChange={() => handleBankToggle(bank)}
                          />
                          <label
                            htmlFor={`bank-${bank}`}
                            className="text-sm cursor-pointer"
                          >
                            {bank}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Salary Required */}
                  <div>
                    <Label className="font-semibold text-gray-700 mb-3 block">
                      Min. Salary Required
                    </Label>
                    <Slider
                      min={0}
                      max={500000}
                      step={5000}
                      value={amountRange}
                      onValueChange={setAmountRange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatAmount(amountRange[0])}</span>
                      <span>{formatAmount(amountRange[1])}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* MAIN CONTENT */}
            <div className="space-y-6">
              {/* Search & Sort Bar */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9 bg-white rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-300"
                    placeholder="Search by name, bank or type..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <Select
                  value={sortBy}
                  onValueChange={(val) => {
                    setSortBy(val);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[190px] bg-white rounded-xl">
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
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden rounded-xl"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* Result count & Compare button */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {paginatedLoans.length}
                  </span>{" "}
                  of <span className="font-semibold">{sortedLoans.length}</span>{" "}
                  schemes
                </p>
                {compareList.length > 0 && (
                  <Button
                    onClick={handleCompare}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 rounded-full px-5"
                  >
                    Compare {compareList.length}{" "}
                    {compareList.length === 1 ? "Scheme" : "Schemes"}
                  </Button>
                )}
              </div>

              {/* Loan Cards Grid */}
              <div ref={gridRef} className="grid md:grid-cols-2 gap-6">
                {paginatedLoans.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    loan={loan}
                    onCompare={handleCompareToggle}
                    isComparing={compareList.includes(loan.id)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2)
                        pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;
                      if (pageNum > 0 && pageNum <= totalPages) {
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              currentPage === pageNum ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => goToPage(pageNum)}
                            className={`w-9 h-9 rounded-full ${currentPage === pageNum ? "bg-blue-600" : ""}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Compare Bar (mobile) */}
        {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-blue-600 shadow-lg z-40 lg:hidden">
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
                    onClick={handleCompare}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Compare Now
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