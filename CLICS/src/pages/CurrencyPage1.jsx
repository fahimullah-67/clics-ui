import { useState, useEffect } from "react";
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
import { ArrowRightLeft, TrendingUp } from "lucide-react";
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

  const exchangeRates = {
    PKR: {
      INR: 0.3423,
      USD: 0.0036,
      EUR: 0.0031,
      GBP: 0.0027,
      AED: 0.0131,
      SAR: 0.0134,
      JPY: 0.5647,
      CNY: 0.0249,
      SGD: 0.0046,
    },
    INR: {
      PKR: 3.0756,
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
      PKR: 280.65,
      INR: 93.25,
      EUR: 0.92,
      GBP: 0.79,
      AED: 3.67,
      SAR: 3.75,
      JPY: 149.5,
      CNY: 7.24,
      SGD: 1.34,
    },
    EUR: {
      PKR: 326.4478,
      INR: 106.15,
      USD: 1.16,
      GBP: 0.86,
      AED: 4.0,
      SAR: 4.38,
      JPY: 162.8,
      CNY: 7.89,
      SGD: 1.46,
    },
    GBP: {
      PKR: 376.25,
      INR: 122.3,
      USD: 1.34,
      EUR: 1.16,
      AED: 4.65,
      SAR: 5.076,
      JPY: 189.2,
      CNY: 9.17,
      SGD: 1.7,
    },
    AED: {
      PKR: 76.26,
      INR: 24.65,
      USD: 0.27,
      EUR: 0.25,
      GBP: 0.21,
      SAR: 1.02,
      JPY: 40.8,
      CNY: 1.97,
      SGD: 0.36,
    },
    SAR: {
      PKR: 74.7,
      INR: 24.2,
      USD: 0.27,
      EUR: 0.24,
      GBP: 0.21,
      AED: 0.98,
      JPY: 39.9,
      CNY: 1.93,
      SGD: 0.36,
    },
    JPY: {
      PKR: 1.7709,
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
      PKR: 40.2195,
      INR: 13.5,
      USD: 0.14,
      EUR: 0.13,
      GBP: 0.11,
      AED: 0.51,
      SAR: 0.52,
      JPY: 20.6,
      SGD: 0.19,
    },
    SGD: {
      PKR: 217.795,
      INR: 70.9,
      USD: 0.775,
      EUR: 0.668,
      GBP: 0.59,
      AED: 2.74,
      SAR: 2.8,
      JPY: 111.6,
      CNY: 5.4,
    },
  };

  const currencies = [
    { code: "PKR", label: "₨ Pakistani Rupee (PKR)", symbol: "₨" },
    { code: "INR", label: "₹ Indian Rupee (INR)", symbol: "₹" },
    { code: "USD", label: "$ US Dollar (USD)", symbol: "$" },
    { code: "EUR", label: "€ Euro (EUR)", symbol: "€" },
    { code: "GBP", label: "£ British Pound (GBP)", symbol: "£" },
    { code: "AED", label: "د.إ UAE Dirham (AED)", symbol: "د.إ" },
    { code: "SAR", label: "﷼ Saudi Riyal (SAR)", symbol: "﷼" },
  ];

  const getCurrencyInfo = (code) =>
    currencies.find((currency) => currency.code === code);

  useEffect(() => {
    const amountNum = Number(amount);
    if (Number.isNaN(amountNum) || amountNum < 0) {
      setResult(null);
      return;
    }

    const rate =
      fromCurrency === toCurrency
        ? 1
        : exchangeRates[fromCurrency]?.[toCurrency] || 1;
    const converted = amountNum * rate;
    setResult(converted);
  }, [amount, fromCurrency, toCurrency]);

  const addHistory = (convertedAmount, rate) => {
    setConversionHistory((prev) => [
      {
        id: Date.now(),
        from: fromCurrency,
        to: toCurrency,
        amount: Number(amount),
        result: convertedAmount,
        rate,
        timestamp: new Date().toLocaleString(),
      },
      ...prev.slice(0, 9),
    ]);
  };

  const handleConvert = () => {
    const amountNum = Number(amount);
    if (Number.isNaN(amountNum) || amountNum < 0) return;

    const rate =
      fromCurrency === toCurrency
        ? 1
        : exchangeRates[fromCurrency]?.[toCurrency] || 1;
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
        : [...prev, currencyCode],
    );
  };

  const quickConvert = (currencyCode) => {
    setToCurrency(currencyCode);
  };

  const clearHistory = () => {
    if (
      window.confirm(
        t("currency.clearHistoryConfirm", "Clear all conversion history?"),
      )
    ) {
      setConversionHistory([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("currency.title", "Currency Converter")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t(
            "currency.subtitle",
            "Real-time currency conversion with live exchange rates",
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
                  "Real-time currency conversion with live exchange rates",
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
                        "Select source currency",
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
                        "Select target currency",
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
                >
                  {t("currency.convertButton", "Convert")}
                </Button>
              </div>
            </div>

            {result !== null && (
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
                <p className="text-sm text-gray-600">
                  {t("currency.exchangeRateLabel", "Exchange Rate:")} 1{" "}
                  {fromCurrency} ={" "}
                  {exchangeRates[fromCurrency]?.[toCurrency]?.toFixed(4) ?? 1}{" "}
                  {toCurrency}
                </p>
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
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <TrendingUp className="h-5 w-5" />
                {t("currency.exchangeRatesHeading", "Current Exchange Rates")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {t("currency.oneEquals", "1 {{from}} equals:", {
                  from: fromCurrency,
                })}
              </p>
              <div className="space-y-3">
                {Object.entries(exchangeRates[fromCurrency] || {}).map(
                  ([currency, rate]) => {
                    const currencyInfo = getCurrencyInfo(currency);
                    return (
                      <button
                        key={currency}
                        type="button"
                        onClick={() => quickConvert(currency)}
                        className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left hover:border-blue-300 hover:bg-blue-50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {currencyInfo?.label}
                            </p>
                            <p className="text-sm text-gray-600">
                              {rate.toFixed(4)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleFavorite(currency);
                            }}
                            className={
                              favorites.includes(currency)
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }
                          >
                            ★
                          </button>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
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
                  "• Exchange rates update every 5 minutes",
                )}
              </li>
              <li>
                {t(
                  "currency.tips.addFavorites",
                  "• Click ★ to add currencies to favorites",
                )}
              </li>
              <li>
                {t(
                  "currency.tips.bankRates",
                  "• Bank rates may differ from market rates",
                )}
              </li>
              <li>
                {t(
                  "currency.tips.bestTime",
                  "• Best time to exchange: Check trends",
                )}
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              {t(
                "currency.rateDisclaimer",
                "* Rates are indicative and may vary. Please confirm with your bank.",
              )}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
