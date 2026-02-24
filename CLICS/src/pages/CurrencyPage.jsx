import { useState, useEffect } from "react";
import { Button } from "../components/custom-ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/custom-ui/Card";
import { Input } from "../components/custom-ui/Input";
import { Label } from "../components/custom-ui/Label";
import { Select } from "../components/custom-ui/Select";
import { Badge } from "../components/custom-ui/Badge";
import { TrendingUp } from "lucide-react";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/custom-ui/Select";

export default function CurrencyPage() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState(null);

  const [exchangeRates, setExchangeRates] = useState({});
  const [conversionHistory, setConversionHistory] = useState([]);
  const [favorites, setFavorites] = useState(["USD", "EUR", "GBP"]);

  const currencies = [
    { code: "PKR", label: "₨ Pakistani Rupee (PKR)", symbol: "₨" },
    { code: "INR", label: "₹ Indian Rupee (INR)", symbol: "₹" },
    { code: "USD", label: "$ US Dollar (USD)", symbol: "$" },
    { code: "EUR", label: "€ Euro (EUR)", symbol: "€" },
    { code: "GBP", label: "£ British Pound (GBP)", symbol: "£" },
    { code: "AED", label: "د.إ UAE Dirham (AED)", symbol: "د.إ" },
    { code: "SAR", label: "﷼ Saudi Riyal (SAR)", symbol: "﷼" },
    { code: "JPY", label: "¥ Japanese Yen (JPY)", symbol: "¥" },
    { code: "CNY", label: "¥ Chinese Yuan (CNY)", symbol: "¥" },
    { code: "SGD", label: "S$ Singapore Dollar (SGD)", symbol: "S$" },
  ];

  const getCurrencyInfo = (code) =>
    currencies.find((c) => c.code === code);

  /* ================= FETCH LIVE RATES ================= */
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`
        );
        const data = await res.json();
        setExchangeRates(data[fromCurrency.toLowerCase()]);
      } catch (err) {
        console.error("Rate fetch failed", err);
      }
    };

    fetchRates();
  }, [fromCurrency]);

  /* ================= CONVERT ================= */
  const handleConvert = () => {
    if (!exchangeRates[toCurrency]) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return;

    const rate = exchangeRates[toCurrency];
    const converted = amountNum * rate;

    setResult(converted);

    setConversionHistory((prev) => [
      {
        id: Date.now(),
        from: fromCurrency,
        to: toCurrency,
        amount: amountNum,
        result: converted,
        rate,
        timestamp: new Date().toLocaleString(),
      },
      ...prev.slice(0, 9),
    ]);
  };

  /* ================= ACTIONS ================= */
  const swapCurrencies = () => {
    setFromCurrency((prev) => {
      setToCurrency(prev);
      return toCurrency;
    });
  };

  const toggleFavorite = (code) => {
    setFavorites((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  };

  const quickConvert = (code) => {
    setToCurrency(code);
  };

  const clearHistory = () => {
    if (window.confirm("Clear all conversion history?")) {
      setConversionHistory([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Currency Converter
        </h1>
        <p className="text-gray-600 mt-2">
          Real-time currency conversion with live exchange rates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= MAIN ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Converter */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Convert Currency
            </h2>

            <div className="space-y-6">
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>

              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={swapCurrencies}
                >
                  ⇅
                </Button>
              </div>

              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="w-full h-12 bg-black text-white"
                onClick={handleConvert}
              >
                Convert
              </Button>

              {result !== null && (
                <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border">
                  <p className="text-sm mb-1">Converted Amount</p>
                  <p className="text-4xl font-bold">
                    {getCurrencyInfo(toCurrency)?.symbol}{" "}
                    {result.toFixed(2)}
                  </p>
                  <p className="text-xs mt-2">
                    Exchange Rate: 1 {fromCurrency} ={" "}
                    {exchangeRates[toCurrency]?.toFixed(4)} {toCurrency}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Favorites */}
          <Card className="p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Quick Convert to Favorites</h3>
              <Badge>{favorites.length} favorites</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favorites.map((code) => (
                <button
                  key={code}
                  onClick={() => quickConvert(code)}
                  className="p-4 border rounded-lg hover:bg-blue-50"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">{code}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(code);
                      }}
                      className="text-yellow-500"
                    >
                      ★
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* History */}
          {conversionHistory.length > 0 && (
            <Card className="p-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Conversion History</h3>
                <Button size="sm" variant="outline" onClick={clearHistory}>
                  Clear
                </Button>
              </div>

              <div className="space-y-3">
                {conversionHistory.map((h) => (
                  <div key={h.id} className="p-3 border rounded">
                    <p className="font-medium">
                      {h.amount} {h.from} → {h.result.toFixed(2)} {h.to}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rate: {h.rate.toFixed(4)} • {h.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* ================= SIDEBAR ================= */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2">
                <TrendingUp size={18} />
                Current Exchange Rates
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm mb-4">
                1 {fromCurrency} equals:
              </p>

              <div className="space-y-2">
                {Object.entries(exchangeRates).map(([code, rate]) => (
                  <div
                    key={code}
                    className="flex justify-between p-3 bg-gray-100 rounded cursor-pointer"
                    onClick={() => setToCurrency(code)}
                  >
                    <span>{code}</span>
                    <span>{rate.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
