import { useState, useEffect } from "react"; // 1. useEffect import kiya
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { Card, CardContent } from "../components/custom-ui/Card";
import { Button } from "../components/custom-ui/Button";
import { Input } from "../components/custom-ui/Input";
import gsap from "gsap";
import { Mail, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".side_panel",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
    );

    gsap.fromTo(
      ".login-content",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    try {
      setLoading(true);
      const res = await api.post("/forgot-password", {
        email: email,
      });
      setMessage(res.data.message || "Password reset email sent.");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      <div className="side_panel hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>

        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="transition-transform rounded-2xl group-hover:scale-110">
              <img src="/clicslogo.png" alt="CLICS" className="w-8 h-8" />
            </div>
            <span className="text-white text-3xl font-bold tracking-tighter">
              CLICS
            </span>
          </Link>

          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Account <br />
            <span className="text-blue-500">Recovery.</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Don't worry, we've got you covered. Enter your email to receive a
            secure link to reset your password and get back to your dashboard.
          </p>

          <div className="flex items-center gap-3 text-blue-400 font-medium">
            <ShieldCheck size={20} />
            <span>Secure 256-bit Encryption</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md">
          {/* Added 'login-content' class for GSAP stagger */}
          <div className="login-content mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">
              Forgot Password
            </h2>
            <p className="text-slate-500 mt-2">
              Enter the email associated with your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="login-content space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </span>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-12 border-slate-200 focus:ring-blue-500 rounded-xl transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {message && (
              <div className="login-content bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl text-sm font-medium">
                {message}
              </div>
            )}

            {errorMsg && (
              <div className="login-content bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <div className="login-content">
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>

          <div className="login-content mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
