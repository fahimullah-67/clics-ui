import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/custom-ui/Card";
import { Button } from "../components/custom-ui/Button";
import { Input } from "../components/custom-ui/Input";
import { Eye, EyeOff, LogIn, ShieldCheck, ArrowRight } from "lucide-react";
import gsap from "gsap";
import api from "../utils/axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const { user, loading, login } = useAuth();

  useEffect(() => {
    // GSAP Animation logic preserved
    gsap.fromTo(
      ".login-content",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1 },
    );
    gsap.fromTo(
      ".side-panel",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
    );
  }, []);

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await api.post("/user/login", {
        email: formData.email,
        password: formData.password,
      });
      login(res.data.data);
      navigate("/compare");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* LEFT SIDE: Visual Panel (Hidden on Mobile) */}
      <div className="side-panel hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>

        <div className="relative z-10 max-w-lg text-center lg:text-left">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="transition-transform rounded-2xl group-hover:scale-110">
              <img src="/clicslogo.png" alt="CLICS" className="w-8 h-8" />
            </div>
            <span className="text-white text-3xl font-bold tracking-tighter">
              CLICS
            </span>
          </Link>

          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Banking comparison <br />
            <span className="text-blue-500">made smarter.</span>
          </h1>

          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Join CLICS to explore, compare, and apply for the best financial
            schemes in Pakistan with data-driven insights.
          </p>

          <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px]"
                >
                  U{i}
                </div>
              ))}
            </div>
            <span>Trusted by 5,000+ users</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="login-content w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="name@example.com"
                required
                className="h-12 border-slate-200 focus:ring-blue-500 focus:border-blue-500 rounded-xl transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  title="Reset Password"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  required
                  className="h-12 border-slate-200 focus:ring-blue-500 focus:border-blue-500 rounded-xl pr-12 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errorMsg && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-medium mt-2 bg-red-50 p-2 rounded-lg border border-red-100">
                  <ShieldCheck size={14} /> {errorMsg}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-bold"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
