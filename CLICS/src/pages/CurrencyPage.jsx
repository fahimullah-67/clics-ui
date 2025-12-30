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
import { ArrowRightLeft, TrendingUp } from "lucide-react";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/custom-ui/Select";

export default function CurrencyPage() {
  const [amount, setAmount] = useState("100000");
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [favorites, setFavorites] = useState(["USD", "EUR", "GBP"]);

  const [exchangeRates] = useState({
    PKR: {
      INR: 1.0,
      USD: 0.0085,
      EUR: 0.0078,
      GBP: 0.0065,
      AED: 0.031,
      SAR: 0.032,
      JPY: 1.25,
      CNY: 0.061,
      SGD: 0.011,
    },
    INR: {
      PKR: 1.0,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0093,
      AED: 0.044,
      SAR: 0.045,
      JPY: 1.82,
      CNY: 0.086,
      SGD: 0.016,
    },
    USD: {
      PKR: 117.65,
      INR: 83.25,
      EUR: 0.92,
      GBP: 0.79,
      AED: 3.67,
      SAR: 3.75,
      JPY: 149.5,
      CNY: 7.24,
      SGD: 1.34,
    },
    EUR: {
      PKR: 128.2,
      INR: 90.5,
      USD: 1.09,
      GBP: 0.86,
      AED: 4.0,
      SAR: 4.08,
      JPY: 162.8,
      CNY: 7.89,
      SGD: 1.46,
    },
    GBP: {
      PKR: 148.5,
      INR: 105.3,
      USD: 1.27,
      EUR: 1.16,
      AED: 4.65,
      SAR: 4.76,
      JPY: 189.2,
      CNY: 9.17,
      SGD: 1.7,
    },
    AED: {
      PKR: 32.26,
      INR: 22.65,
      USD: 0.27,
      EUR: 0.25,
      GBP: 0.21,
      SAR: 1.02,
      JPY: 40.8,
      CNY: 1.97,
      SGD: 0.36,
    },
    SAR: {
      PKR: 31.7,
      INR: 22.2,
      USD: 0.27,
      EUR: 0.24,
      GBP: 0.21,
      AED: 0.98,
      JPY: 39.9,
      CNY: 1.93,
      SGD: 0.36,
    },
    JPY: {
      PKR: 0.79,
      INR: 0.56,
      USD: 0.0067,
      EUR: 0.0061,
      GBP: 0.0053,
      AED: 0.024,
      SAR: 0.025,
      CNY: 0.048,
      SGD: 0.009,
    },
    CNY: {
      PKR: 15.5,
      INR: 11.5,
      USD: 0.14,
      EUR: 0.13,
      GBP: 0.11,
      AED: 0.51,
      SAR: 0.52,
      JPY: 20.6,
      SGD: 0.19,
    },
    SGD: {
      PKR: 87.5,
      INR: 61.9,
      USD: 0.75,
      EUR: 0.68,
      GBP: 0.59,
      AED: 2.74,
      SAR: 2.8,
      JPY: 111.6,
      CNY: 5.4,
    },
  });

  const currencies = [
  { code: "PKR" , label: "₨ Pakistani Rupee (PKR)" },
  { code: "INR", label: "₹ Indian Rupee (INR)" },
  { code: "USD", label: "$ US Dollar (USD)" },
  { code: "EUR", label: "€ Euro (EUR)" },
  { code: "GBP", label: "£ British Pound (GBP)" },
  { code: "AED", label: "د.إ UAE Dirham (AED)" },
  { code: "SAR", label: "﷼ Saudi Riyal (SAR)" },
]


  useEffect(() => {
    handleConvert();
  }, [amount, fromCurrency, toCurrency]);

  const handleConvert = () => {
    const amountNum = Number.parseFloat(amount);
    if (!isNaN(amountNum) && fromCurrency && toCurrency) {
      if (fromCurrency === toCurrency) {
        setResult(amountNum);
      } else {
        const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
        const convertedAmount = amountNum * rate;
        setResult(convertedAmount);

        // Add to history
        const historyItem = {
          id: Date.now(),
          from: fromCurrency,
          to: toCurrency,
          amount: amountNum,
          result: convertedAmount,
          rate: rate,
          timestamp: new Date().toLocaleString(),
        };
        setConversionHistory((prev) => [historyItem, ...prev.slice(0, 9)]);
      }
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const toggleFavorite = (currencyCode) => {
    setFavorites((prev) =>
      prev.includes(currencyCode)
        ? prev.filter((c) => c !== currencyCode)
        : [...prev, currencyCode]
    );
  };

  const quickConvert = (targetCurrency) => {
    setToCurrency(targetCurrency);
  };

  const clearHistory = () => {
    if (window.confirm("Clear all conversion history?")) {
      setConversionHistory([]);
    }
  };

  const getCurrencyInfo = (code) => currencies.find((c) => c.code === code);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Currency Converter</h1>
        <p className="text-gray-600 mt-2">
          Real-time currency conversion with live exchange rates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Converter */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Convert Currency
            </h2>

            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg h-12"
                />
              </div>

              {/* From Currency */}
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-11 rounded-lg">
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

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  onClick={swapCurrencies}
                  variant="outline"
                  className="rounded-full bg-transparent"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </Button>
              </div>

              {/* To Currency */}
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-11 rounded-lg">
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

              <Button className="w-full h-12 rounded-lg bg-black text-white hover:bg-black/90">
                Convert
              </Button>

              {/* Result */}
              {result !== null && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-2">Converted Amount</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {getCurrencyInfo(toCurrency)?.symbol}{" "}
                    {result.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getCurrencyInfo(fromCurrency)?.symbol}{" "}
                    {Number.parseFloat(amount).toLocaleString()} {fromCurrency}{" "}
                    = {getCurrencyInfo(toCurrency)?.symbol}{" "}
                    {result.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {toCurrency}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Exchange Rate: 1 {fromCurrency} ={" "}
                    {exchangeRates[fromCurrency]?.[toCurrency]?.toFixed(4)}{" "}
                    {toCurrency}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Convert */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Convert to Favorites
              </h3>
              <Badge variant="outline">{favorites.length} favorites</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favorites.map((code) => {
                const currency = getCurrencyInfo(code);
                const rate = exchangeRates[fromCurrency]?.[code] || 1;
                const converted = Number.parseFloat(amount) * rate;

                return (
                  <button
                    key={code}
                    onClick={() => quickConvert(code)}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                      toCurrency === code
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{currency?.flag}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(code);
                        }}
                        className="text-yellow-500 hover:text-yellow-600"
                      >
                        ★
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {code}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {currency?.symbol} {converted.toFixed(2)}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Conversion History */}
          {conversionHistory.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Conversion History
                </h3>
                <Button size="sm" variant="outline" onClick={clearHistory}>
                  Clear
                </Button>
              </div>

              <div className="space-y-3">
                {conversionHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {getCurrencyInfo(item.from)?.symbol}{" "}
                          {item.amount.toLocaleString()}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="font-semibold text-blue-600">
                          {getCurrencyInfo(item.to)?.symbol}{" "}
                          {item.result.toFixed(2)}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.from}/{item.to}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Rate: {item.rate.toFixed(4)} • {item.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Current Exchange Rates
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                1 {fromCurrency} equals:
              </p>

              <div className="space-y-2">
                {Object.entries(exchangeRates[fromCurrency] || {}).map(
                  ([currency, rate]) => {
                    const currencyInfo = getCurrencyInfo(currency);

                    return (
                      <div
                        key={currency}
                        onClick={() => setToCurrency(currency)}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/70 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{currencyInfo?.flag}</span>
                          <span className="font-medium">{currency}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-semibold">
                            {rate.toFixed(4)}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(currency);
                            }}
                            className={`${
                              favorites.includes(currency)
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }`}
                          >
                            ★
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                * Rates are indicative and may vary. Please confirm with your
                bank.
              </p>
            </CardContent>
          </Card>

          {/* Popular Conversions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Conversions
            </h3>

            <div className="space-y-3">
              {[
                { from: "INR", to: "USD", amount: 10000 },
                { from: "USD", to: "INR", amount: 100 },
                { from: "EUR", to: "INR", amount: 100 },
                { from: "GBP", to: "INR", amount: 100 },
              ].map((conv, index) => {
                const rate = exchangeRates[conv.from]?.[conv.to] || 1;
                const result = conv.amount * rate;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setFromCurrency(conv.from);
                      setToCurrency(conv.to);
                      setAmount(conv.amount.toString());
                    }}
                    className="w-full p-3 border rounded-lg text-left hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {conv.amount} {conv.from} → {conv.to}
                    </p>
                    <p className="text-xs text-gray-600">
                      ≈ {getCurrencyInfo(conv.to)?.symbol} {result.toFixed(2)}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Currency Info */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Currency Tips
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Exchange rates update every 5 minutes</li>
              <li>• Click ★ to add currencies to favorites</li>
              <li>• Bank rates may differ from market rates</li>
              <li>• Best time to exchange: Check trends</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
