import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/custom-ui/Card";
import { Button } from "../components/custom-ui/Button";
import { Input } from "../components/custom-ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    try {
      setLoading(true);

      const res = await api.post("/user/forgot-password", {
        email: email,
      });

      setMessage(res.data.message || "Password reset email sent.");

    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>

              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {message && (
              <p className="text-green-600 text-sm">{message}</p>
            )}

            {errorMsg && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

          </form>

          <p className="text-center text-sm text-slate-600 mt-4">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Back to Login
            </Link>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}