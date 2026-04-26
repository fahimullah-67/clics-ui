"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/custom-ui/Card";
import { Button } from "../components/custom-ui/Button";
import { TrendingDown, TrendingUp, Trash2 } from "lucide-react";
import gsap from "gsap";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [reFresh, setReFresh] = useState(0);

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      // Simulate fetching watchlist data from an API
      try {
        const res = await api.get("watchlist/getWatchlist");
        console.log("Watchlist Data:", res.data);

        const formatted = res.data.data.map((item) => ({
          id: item._id,
          schemeName: item.loanSchemeId.schemeName,
          bank: item.loanSchemeId.bankId?.name || "Unknown Bank",
          interestRate: item.loanSchemeId.interestRate,
          change: (Math.random() * 2 - 1).toFixed(2),
          lastChecked: timeAgo(item.createdAt),
          alertsEnabled: item.NotificationOnChange,
        }));
        setWatchlist(formatted);
      } catch (error) {
        console.error("Error fetching watchlist in UI :", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        console.log("Fetch watchlist completed");
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [navigate]);

  useEffect(() => {
    gsap.fromTo(
      ".watchlist-card",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReFresh((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  });

  const handleToggleAlerts = (id) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, alertsEnabled: !item.alertsEnabled } : item,
      ),
    );
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this item from your watchlist?",
    );
    if (confirmDelete) {
      api
        .delete(`watchlist/removeWatchlist/${id}`)
        .then((res) => {
          console.log("Delete response:", res);
          alert("Item removed from watchlist!");
          setWatchlist((prev) => prev.filter((item) => item.id !== id));
        })
        .catch((err) => {
          console.error("Error deleting watchlist item:", err);
          alert("Failed to delete item. Please try again.");
        });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading your watchlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            My Watchlist
          </h1>
          <p className="text-lg text-slate-600">
            Track your favorite loan schemes
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {watchlist.map((item) => (
            <Card key={item.id} className="watchlist-card shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {item.schemeName}
                    </h3>
                    <p className="text-slate-600 mb-3">{item.bank}</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Current Rate</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {item.interestRate}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.change < 0 ? (
                          <>
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-semibold">
                              {Math.abs(item.change)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 text-red-600" />
                            <span className="text-red-600 font-semibold">
                              +{item.change}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Alerts</span>
                      <button
                        onClick={() => handleToggleAlerts(item.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.alertsEnabled ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.alertsEnabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-3">
                  Last checked: {item.lastChecked}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
