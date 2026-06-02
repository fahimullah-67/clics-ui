import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
import { ArrowRightLeft, TrendingUp, RefreshCw, Star } from "lucide-react";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/custom-ui/Select";

export default function CurrencyPage() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("100000");
  const [fromCurrency, setFromCurrency] = useState("PKR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState(null);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [favorites, setFavorites] = useState(["USD", "EUR", "GBP"]);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

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
    currencies.find((currency) => currency.code === code);

  // Fetch exchange rates for the selected base currency
  const fetchRates = useCallback(async () => {
    if (!fromCurrency) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency.toLowerCase()}.json`
      );
      if (!response.ok) throw new Error("Failed to fetch rates");
      const data = await response.json();
      // The API returns an object with date and the base currency key containing rates
      const baseRates = data[fromCurrency.toLowerCase()];
      if (!baseRates) throw new Error("Invalid response structure");
      setRates(baseRates);
      setLastUpdated(new Date(data.date));
    } catch (err) {
      console.error(err);
      setError(t("currency.errorFetching", "Unable to fetch exchange rates. Please try again later."));
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, t]);

  useEffect(() => {
    fetchRates();
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Perform conversion whenever inputs change
  useEffect(() => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0 || Object.keys(rates).length === 0) {
      setResult(null);
      return;
    }

    let rate;
    if (fromCurrency === toCurrency) {
      rate = 1;
    } else if (toCurrency.toLowerCase() === fromCurrency.toLowerCase()) {
      rate = 1;
    } else if (rates[toCurrency.toLowerCase()]) {
      rate = rates[toCurrency.toLowerCase()];
    } else {
      rate = 1;
    }
    const converted = amountNum * rate;
    setResult(converted);
  }, [amount, fromCurrency, toCurrency, rates]);

  const addHistory = (convertedAmount, rate) => {
    setConversionHistory((prev) => [
      {
        id: Date.now(),
        from: fromCurrency,
        to: toCurrency,
        amount: parseFloat(amount),
        result: convertedAmount,
        rate,
        timestamp: new Date().toLocaleString(),
      },
      ...prev.slice(0, 9),
    ]);
  };

  const handleConvert = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) return;
    const rate =
      fromCurrency === toCurrency
        ? 1
        : rates[toCurrency.toLowerCase()] || 1;
    const converted = amountNum * rate;
    setResult(converted);
    addHistory(converted, rate);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const toggleFavorite = (currencyCode) => {
    setFavorites((prev) =>
      prev.includes(currencyCode)
        ? prev.filter((code) => code !== currencyCode)
        : [...prev, currencyCode]
    );
  };

  const quickConvert = (currencyCode) => {
    setToCurrency(currencyCode);
  };

  const clearHistory = () => {
    if (window.confirm(t("currency.clearHistoryConfirm", "Clear all conversion history?"))) {
      setConversionHistory([]);
    }
  };

  const refreshRates = () => {
    fetchRates();
  };

  // Build list of exchange rates for the sidebar
  const exchangeRateList = Object.entries(rates)
    .map(([code, rate]) => ({
      code: code.toUpperCase(),
      rate,
    }))
    .filter((item) => currencies.some((c) => c.code === item.code))
    .slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("currency.title", "Currency Converter")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t(
            "currency.subtitle",
            "Real-time currency conversion with live exchange rates"
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {t("currency.convertHeading", "Convert Currency")}
              </h2>
              <p className="text-gray-600 mt-2">
                {t(
                  "currency.subtitle",
                  "Real-time currency conversion with live exchange rates"
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="amount">
                  {t("currency.amountLabel", "Amount")}
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  min="0"
                  step="any"
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t("currency.amountPlaceholder", "Enter amount")}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="from">{t("currency.fromLabel", "From")}</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="h-12 rounded-lg w-full">
                    <SelectValue
                      placeholder={t(
                        "currency.fromPlaceholder",
                        "Select source currency"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="to">{t("currency.toLabel", "To")}</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="h-12 rounded-lg w-full">
                    <SelectValue
                      placeholder={t(
                        "currency.toPlaceholder",
                        "Select target currency"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={swapCurrencies}
                  className="w-full h-12"
                >
                  <ArrowRightLeft className="mr-2" />
                  Swap
                </Button>
                <Button
                  type="button"
                  onClick={handleConvert}
                  className="w-full h-12"
                  disabled={loading}
                >
                  {loading ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    t("currency.convertButton", "Convert")
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {result !== null && !error && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-blue-50 p-6">
                <p className="text-sm text-gray-600 mb-2">
                  {t("currency.convertedAmountLabel", "Converted Amount")}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {getCurrencyInfo(toCurrency)?.symbol}{" "}
                  {result.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                {rates[toCurrency.toLowerCase()] && (
                  <p className="text-sm text-gray-600">
                    {t("currency.exchangeRateLabel", "Exchange Rate:")} 1{" "}
                    {fromCurrency} ={" "}
                    {rates[toCurrency.toLowerCase()].toFixed(4)} {toCurrency}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  {t("currency.approximateLabel", "≈ {{symbol}} {{amount}}", {
                    symbol: getCurrencyInfo(toCurrency)?.symbol,
                    amount: result.toFixed(2),
                  })}
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("currency.historyHeading", "Conversion History")}
              </h3>
              <Button size="sm" variant="outline" onClick={clearHistory}>
                {t("currency.clearButton", "Clear")}
              </Button>
            </div>

            <div className="space-y-3">
              {conversionHistory.length > 0 ? (
                conversionHistory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.amount.toLocaleString()} {item.from} → {item.to}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.rate.toFixed(4)} • {item.timestamp}
                        </p>
                      </div>
                      <Badge variant="outline">{item.to}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No conversion history yet.
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t("currency.exchangeRatesHeading", "Current Exchange Rates")}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshRates}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && !Object.keys(rates).length ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">Loading rates...</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    {t("currency.oneEquals", "1 {{from}} equals:", { from: fromCurrency })}
                  </p>
                  <div className="space-y-3">
                    {exchangeRateList.map(({ code, rate }) => {
                      const currencyInfo = getCurrencyInfo(code);
                      if (!currencyInfo) return null;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => quickConvert(code)}
                          className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {currencyInfo.label}
                              </p>
                              <p className="text-sm text-gray-600">
                                {typeof rate === "number" ? rate.toFixed(4) : rate}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleFavorite(code);
                              }}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  favorites.includes(code)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-400"
                                }`}
                              />
                            </button>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              {lastUpdated && (
                <p className="text-xs text-gray-400 mt-4">
                  Rates updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("currency.tipsHeading", "Currency Tips")}
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                {t(
                  "currency.tips.updateRate",
                  "• Exchange rates update every 5 minutes"
                )}
              </li>
              <li>
                {t(
                  "currency.tips.addFavorites",
                  "• Click ★ to add currencies to favorites"
                )}
              </li>
              <li>
                {t(
                  "currency.tips.bankRates",
                  "• Bank rates may differ from market rates"
                )}
              </li>
              <li>
                {t(
                  "currency.tips.bestTime",
                  "• Best time to exchange: Check trends"
                )}
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              {t(
                "currency.rateDisclaimer",
                "* Rates are indicative and may vary. Please confirm with your bank."
              )}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}