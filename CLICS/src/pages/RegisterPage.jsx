"use client";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "../components/custom-ui/Card";
import { Button } from "../components/custom-ui/Button";
import { Input } from "../components/custom-ui/Input";
import {
  Eye,
  EyeOff,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Mail,
  User,
} from "lucide-react";
import gsap from "gsap";
import api from "../utils/axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // GSAP Staggered Animation for a premium feel
    gsap.fromTo(
      ".register-content",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1 },
    );
    gsap.fromTo(
      ".side-panel-reg",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post("/user/register", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log("Registration response:", res.data);
      navigate("/login");
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message,
      );
      setError(
        error.response?.data?.message || "Registration failed. Try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* LEFT SIDE: Visual Panel (Matching Login Theme) */}
      <div className="side-panel-reg hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Abstract Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-15"></div>

        <div className="relative z-10 max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className=" transition-transform rounded-2xl group-hover:scale-110">
              {" "}
              <img src="/clicslogo.png" alt="CLICS" className="w-8 h-8" />
            </div>
            <span className="text-white text-3xl font-bold group-hover:rotate-1 transition-transform tracking-tighter italic">
              CLICS
            </span>
          </Link>

          <div className="space-y-8">
            <h2 className="text-5xl font-extrabold text-white leading-tight">
              Join the <br />
              <span className="text-blue-500">Revolution.</span>
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed">
              Create an account to access personalized bank comparisons and
              real-time interest updates.
            </p>

            <div className="space-y-4 pt-4">
              {[
                "Instant Loan Approvals",
                "Verified Bank Data",
                "Secure Transactions",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="text-blue-500 w-5 h-5" />
                  <span className="font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Registration Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="register-content w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 mt-2">
              Start your journey with CLICS today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                <User size={14} className="text-blue-600" /> Full Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Fahim Ullah"
                required
                className="h-11 border-slate-200 focus:ring-blue-500 rounded-xl"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                <Mail size={14} className="text-blue-600" /> Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="name@example.com"
                required
                className="h-11 border-slate-200 focus:ring-blue-500 rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  className="h-11 border-slate-200 focus:ring-blue-500 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Confirm Password
              </label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                required
                className="h-11 border-slate-200 focus:ring-blue-500 rounded-xl"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-medium p-3 rounded-lg flex items-center gap-2 animate-shake">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus size={18} /> Get Started Free
            </Button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-bold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
