import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, href } from "react-router-dom";

import { Footer } from "../components/footer";
import { LoanCard } from "../components/loan-card";
import { Button } from "../components/custom-ui/Button";
import { Input } from "../components/custom-ui/Input";
import { Label } from "../components/custom-ui/Label";
import { Checkbox } from "../components/custom-ui/Checkbox";
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

import { mockLoans, banks } from "@/lib/mock-data";
import { ArrowUpDown, Filter, Search, X } from "lucide-react";
import { Badge } from "../components/custom-ui/Badge";
import gsap from "gsap";

export default function SchemesPage() {
  const [searchParams] = useSearchParams();

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

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleBankToggle = (bank) => {
    setSelectedBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank]
    );
  };

  const handleCompareToggle = (id) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else if (prev.length < 4) {
        const newLoan = mockLoans.find((l) => l.id === id);
        if (prev.length > 0) {
          const firstSelectedLoan = mockLoans.find((l) => l.id === prev[0]);
          if (
            newLoan &&
            firstSelectedLoan &&
            newLoan.type !== firstSelectedLoan.type
          ) {
            alert(
              `You can only compare loans of the same type. Currently comparing ${firstSelectedLoan.type} loans.`
            );
            return prev;
          }
        }
        return [...prev, id];
      } else {
        alert("You can only compare up to 4 loans at once.");
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
        }
      );
    }
  }, [
    selectedTypes,
    selectedBanks,
    searchQuery,
    amountRange,
    sortBy,
    hasInitialized,
    scrollY,
    scrollX,
  ]);

  const filteredLoans = mockLoans.filter((loan) => {
    const matchesSearch =
      loan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(loan.type);

    const matchesBank =
      selectedBanks.length === 0 || selectedBanks.includes(loan.bank);

    const matchesAmount =
      loan.maxAmount >= amountRange[0] && loan.minAmount <= amountRange[1];

    return matchesSearch && matchesType && matchesBank && matchesAmount;
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    switch (sortBy) {
      case "interest-low":
        return parseFloat(a.interestRate) - parseFloat(b.interestRate);
      case "interest-high":
        return parseFloat(b.interestRate) - parseFloat(a.interestRate);
      case "amount-low":
        return a.maxAmount - b.maxAmount;
      case "amount-high":
        return b.maxAmount - a.maxAmount;
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <main className="flex-1">
        {/* PAGE HEADER */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Banking Schemes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Explore and compare banking schemes from Pakistan's leading
              financial institutions
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* FILTERS */}
            <aside className={`lg:block ${showFilters ? "block" : "hidden"}`}>
              <Card className="sticky top-20">
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>Filters</CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  {/* Loan Types */}
                  <div>
                    <Label className="font-semibold mb-3 block">
                      Loan Type
                    </Label>
                    {loanTypes.map((type) => (
                      <div key={type} className="flex gap-2">
                        <Checkbox
                          id={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleTypeToggle(type)}
                        />
                        <label htmlFor={type} className="capitalize">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Banks */}
                  <div>
                    <Label className="font-semibold mb-3 block">Banks</Label>
                    {banks.map((bank) => (
                      <div key={bank} className="flex gap-2">
                        <Checkbox
                          id={bank}
                          checked={selectedBanks.includes(bank)}
                          onCheckedChange={() => handleBankToggle(bank)}
                        />
                        <label htmlFor={bank}>{bank}</label>
                      </div>
                    ))}
                  </div>

                  {/* Amount */}
                  <div>
                    <Label className="font-semibold mb-3 block">
                      Loan Amount: {formatAmount(amountRange[0])} -{" "}
                      {formatAmount(amountRange[1])}
                    </Label>
                    <Slider
                      min={0}
                      max={50000000}
                      step={100000}
                      value={amountRange}
                      onValueChange={setAmountRange}
                    />
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* CONTENT */}
            <div className="space-y-6">
              
              {/* Search */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4" />
                  <Input
                    className="pl-9"
                    placeholder="Search by bank or loan name..."
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

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {sortedLoans.length} of {mockLoans.length} schemes
                </p>
                {compareList.length > 0 && (
                  <Button  className="bg-blue-600 hover:bg-blue-700">
                    <Link to={`/compare?ids=${compareList.join(",")}`}>
                      Compare {compareList.length} Scheme
                      {compareList.length > 1 ? "s" : ""}
                    </Link>
                  </Button>
                )}
              </div>
              {/* RESULTS */}
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
                
         {/* Compare Bar (Fixed at bottom when items selected) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-blue-600 shadow-lg z-40   lg:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">
                {compareList.length} scheme{compareList.length > 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCompareList([])}>
                  Clear
                </Button>
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to={`/compare?ids=${compareList.join(",")}`}>Compare Now</Link>
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
