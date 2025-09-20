import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup({ onClose }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password))
      return "Password needs 8+ chars, 1 uppercase, 1 number and 1 special char.";
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) return "Phone must be 10 digits.";
    return null;
  };

  async function safeParseResponse(res) {
    const text = await res.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (err) {
      console.warn("safeParseResponse: invalid JSON from server:", text);
      return { _rawText: text };
    }
  }

  const sendOtp = async () => {
    setErrorMsg("");
    if (!form.email) return setErrorMsg("Please enter your email to verify.");
    setOtpLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const j = await safeParseResponse(res);

      console.log("send-otp response status:", res.status, "body:", j);

      if (!res.ok) {
        throw new Error(j.error || j.message || `Server error (${res.status})`);
      }

      setOtpSent(true);
      setResendCooldown(60);
      setSuccessMsg(j.message || "OTP sent — check your email (also spam).");
    } catch (err) {
      console.error("send-otp error:", err);
      setErrorMsg(err.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setErrorMsg("");
    if (!form.email || !otp) return setErrorMsg("Enter OTP sent to email.");
    setOtpLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: otp }),
      });

      const j = await safeParseResponse(res);
      console.log("verify-otp response:", res.status, j);

      if (!res.ok) throw new Error(j.error || j.message || `Invalid OTP (${res.status})`);

      setEmailVerified(true);
      setSuccessMsg(j.message || "Email verified — you can now create your account.");
    } catch (err) {
      console.error("verify-otp error:", err);
      setErrorMsg(err.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!emailVerified) {
      setErrorMsg("Please verify your email first (click Verify next to email).");
      return;
    }

    const v = validateForm();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      if (data?.user?.id) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            user_id: data.user.id,
            first_name: form.firstName,
            last_name: form.lastName,
            age: form.age || null,
            phone_number: form.phone,
            email: form.email,
          },
        ]);
        if (profileError) {
          console.warn("Profile insert warning:", profileError);
        }
      }

      localStorage.removeItem("mann_guest");

      try {
        const { migrateGuestConversations } = await import("../utils/guest");
        await migrateGuestConversations(data.user.id);
      } catch (e) {
        console.warn("Guest migration skipped:", e.message);
      }

      setSuccessMsg("🎉 Account created successfully! Redirecting…");
      setTimeout(() => {
        if (onClose) onClose();
        navigate("/");
      }, 900);
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg(err.message || "Account creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await sendOtp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Create account</h3>
              <button
                onClick={() => onClose && onClose()}
                aria-label="Close"
                className="text-gray-500 hover:text-gray-800 rounded p-1"
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">We will verify your email before creating the account.</p>
          </div>

          <form onSubmit={handleSignup} className="p-6 grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="pl-3 pr-3 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="pl-3 pr-3 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Age (optional)"
                type="number"
                className="pl-3 pr-3 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-400"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone (10 digits)"
                inputMode="numeric"
                className="pl-3 pr-3 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* Email + Send OTP */}
            <div className="flex gap-2">
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                className={`flex-1 pl-3 pr-3 py-2 rounded-lg border ${emailVerified ? "border-green-400" : "border-gray-200"} focus:ring-2 focus:ring-teal-400`}
                required
                disabled={emailVerified}
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={otpLoading || resendCooldown > 0 || !form.email}
                className={`px-3 rounded ${otpLoading ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {otpLoading ? "Sending..." : resendCooldown > 0 ? `Resend (${resendCooldown}s)` : otpSent ? "Resend" : "Send OTP"}
              </button>
            </div>

            {/* OTP input only shown after OTP sent */}
            {otpSent && !emailVerified && (
              <div className="flex gap-2 items-center">
                <input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 pl-3 pr-3 py-2 rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  disabled={otpLoading || !otp}
                  className={`px-3 rounded ${otpLoading ? "bg-gray-300" : "bg-green-600 text-white hover:bg-green-700"}`}
                >
                  {otpLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            )}

            <div className="relative">
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="pl-3 pr-20 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-400"
                required
                aria-describedby="password-hint"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 px-2 py-1 rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div id="password-hint" className="text-xs text-gray-500">
              8+ chars, 1 uppercase, 1 number & 1 special char.
            </div>

            {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}
            {successMsg && <div className="text-sm text-green-600">{successMsg}</div>}

            <button
              aria-live="polite"
              disabled={loading || !emailVerified}
              type="submit"
              className={`w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg text-white ${
                loading ? "bg-teal-400/80" : emailVerified ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-300"
              }`}
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" fill="none" />
                  <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
              {loading ? "Creating account…" : "Create account"}
            </button>

            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-teal-600 hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
