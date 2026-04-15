import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Phone, Mail, User, MapPin, ArrowRight, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { signInWithGoogle } from "@/lib/firebase-auth";
import { isEmailOtpConfigured, sendEmailOtp, verifyEmailOtp } from "@/lib/email-otp";
import { isFirebaseConfigured } from "@/lib/firebase";

type SignupStep = "identity" | "contact" | "otp" | "password" | "done";

const GOOGLE_SVG = (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function AuthModal() {
  const { authModalOpen, authMode, closeAuth, login, openSignup, openLogin } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(authMode);
  const [signupStep, setSignupStep] = useState<SignupStep>("identity");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [contactMode, setContactMode] = useState<"email" | "phone">("email");
  const [resendTimer, setResendTimer] = useState(0);
  const [authError, setAuthError] = useState("");
  const [otpStatus, setOtpStatus] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({
    name: "", location: "", email: "", phone: "",
    password: "", confirmPassword: "", userType: "household" as "household" | "architect",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { setMode(authMode); setAuthError(""); setOtpStatus(""); }, [authMode]);
  useEffect(() => {
    if (!authModalOpen) {
      setTimeout(() => {
        setSignupStep("identity");
        setOtpValues(["", "", "", "", "", ""]);
        setOtpVerified(false);
        setOtpSent(false);
        setErrors({});
        setAuthError("");
        setOtpStatus("");
        setVerifyingOtp(false);
        setForm({ name: "", location: "", email: "", phone: "", password: "", confirmPassword: "", userType: "household" });
      }, 300);
    }
  }, [authModalOpen]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const delay = (ms: number) =>
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, ms);
    });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const clearError = (k: string) => setErrors(e => { const n = { ...e }; delete n[k]; return n; });

  const sendOtp = async () => {
    setLoading(true);
    setAuthError("");
    setOtpStatus("");

    try {
      if (contactMode === "email" && isEmailOtpConfigured) {
        await sendEmailOtp(form.email);
        setOtpSent(true);
        setResendTimer(30);
        setSignupStep("otp");
        setOtpStatus(`We sent a 6-digit OTP to ${form.email}.`);
        return;
      }

      await delay(1200);
      setOtpSent(true);
      setResendTimer(30);
      setSignupStep("otp");

      if (contactMode === "email") {
        setOtpStatus(
          "Email OTP is in demo mode right now. Add VITE_AUTH_API_BASE_URL to enable real email OTP.",
        );
      } else {
        setOtpStatus("Phone OTP is still in demo mode here.");
      }
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "We could not send the OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otpValues];
    next[i] = v;
    setOtpValues(next);
    setAuthError("");
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every(d => d !== "")) {
      void verifyOtpCode(next.join(""));
    }
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const validateIdentity = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (Object.keys(e).length) { setErrors(e); return false; }
    return true;
  };

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (contactMode === "email" && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (contactMode === "phone" && !form.phone.match(/^\d{10}$/)) e.phone = "Enter a 10-digit phone number";
    if (Object.keys(e).length) { setErrors(e); return false; }
    return true;
  };

  const validatePassword = () => {
    const e: Record<string, string> = {};
    if (form.password.length < 8) e.password = "Minimum 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (Object.keys(e).length) { setErrors(e); return false; }
    return true;
  };

  const verifyOtpCode = async (otp: string) => {
    setAuthError("");

    if (contactMode === "email" && isEmailOtpConfigured) {
      setVerifyingOtp(true);

      try {
        const verifiedUser = await verifyEmailOtp(form.email, otp);
        if (verifiedUser) {
          setForm((current) => ({
            ...current,
            name: verifiedUser.name || current.name,
            email: verifiedUser.email || current.email,
            phone: verifiedUser.phone || current.phone,
            location: verifiedUser.location || current.location,
            userType: verifiedUser.userType || current.userType,
          }));
        }

        setOtpVerified(true);
        setOtpStatus("Email verified successfully.");
        window.setTimeout(() => setSignupStep("password"), 500);
      } catch (error) {
        setAuthError(
          error instanceof Error
            ? error.message
            : "The OTP is invalid or expired.",
        );
        setOtpValues(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } finally {
        setVerifyingOtp(false);
      }

      return;
    }

    window.setTimeout(() => {
      setOtpVerified(true);
      window.setTimeout(() => setSignupStep("password"), 500);
    }, 400);
  };

  const handleSignupNext = () => {
    if (signupStep === "identity") { if (validateIdentity()) setSignupStep("contact"); }
    else if (signupStep === "contact") { if (validateContact()) void sendOtp(); }
    else if (signupStep === "password") {
      if (validatePassword()) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setSignupStep("done");
          setTimeout(() => {
            login({ name: form.name, email: form.email, phone: form.phone, location: form.location, userType: form.userType });
          }, 1000);
        }, 1000);
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password.trim()) errs.password = "Password is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login({ name: form.name || form.email.split("@")[0], email: form.email, location: "India", userType: "household" });
    }, 1000);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setAuthError("");

    try {
      const googleUser = await signInWithGoogle();

      if (googleUser) {
        login(googleUser);
        return;
      }

      setTimeout(() => {
        setLoading(false);
        login({ name: "Google User", email: "user@gmail.com", location: "India", userType: "household" });
      }, 1200);
    } catch (error) {
      setLoading(false);
      setAuthError(
        error instanceof Error
          ? error.message
          : "Google sign-in could not be completed.",
      );
    }
  };

  const stepLabels: SignupStep[] = ["identity", "contact", "otp", "password"];
  const currentStepIndex = stepLabels.indexOf(signupStep);

  if (!authModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) closeAuth(); }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-slate-900 px-8 pt-8 pb-6">
            <button onClick={closeAuth} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1">
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-white font-bold text-lg">CivilCost</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {mode === "login" ? "Welcome back" : signupStep === "done" ? "You're in!" : "Create your account"}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {mode === "login" ? "Sign in to access your free quote analysis" : signupStep === "done" ? "Your first quote analysis is on us." : "Get your first quote analysis free"}
            </p>

            {mode === "signup" && signupStep !== "done" && (
              <div className="flex items-center gap-2 mt-4">
                {stepLabels.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= currentStepIndex ? "bg-emerald-500" : "bg-slate-700"}`} />
                ))}
              </div>
            )}
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            {/* Tab switcher */}
            {signupStep === "identity" && (
              <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setErrors({}); setAuthError(""); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {m === "login" ? "Log In" : "Sign Up"}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* ─── LOGIN ─── */}
              {mode === "login" && (
                <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} onSubmit={handleLogin} className="space-y-4">
                  <button type="button" onClick={handleGoogle}
                    className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    {GOOGLE_SVG}
                    Continue with Google
                  </button>
                  {!isFirebaseConfigured && (
                    <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      Firebase is not configured yet, so Google sign-in stays in demo mode.
                      Add the `VITE_FIREBASE_*` keys from `.env.example` to enable real Google auth.
                    </p>
                  )}
                  {authError && <p className="text-xs text-red-500">{authError}</p>}
                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span>or continue with email</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email address</label>
                    <input type="email" value={form.email} onChange={e => { set("email", e.target.value); clearError("email"); }}
                      className={`w-full border ${errors.email ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                      placeholder="you@example.com" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => { set("password", e.target.value); clearError("password"); }}
                        className={`w-full border ${errors.password ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-12`}
                        placeholder="Your password" />
                      <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
                  </Button>
                  <p className="text-center text-xs text-slate-500">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => { setMode("signup"); setErrors({}); setAuthError(""); }} className="text-emerald-600 font-semibold hover:underline">Sign up free</button>
                  </p>
                </motion.form>
              )}

              {/* ─── SIGNUP: IDENTITY ─── */}
              {mode === "signup" && signupStep === "identity" && (
                <motion.div key="identity" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input value={form.name} onChange={e => { set("name", e.target.value); clearError("name"); }}
                        className={`w-full border ${errors.name ? "border-red-400" : "border-slate-200"} rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                        placeholder="Rajesh Sharma" />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">City / Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input value={form.location} onChange={e => { set("location", e.target.value); clearError("location"); }}
                        className={`w-full border ${errors.location ? "border-red-400" : "border-slate-200"} rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                        placeholder="Bangalore, Mumbai..." />
                    </div>
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">I am a</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "household", label: "Homeowner", icon: "🏠", desc: "Renovating my home" },
                        { value: "architect", label: "Architect / Engineer", icon: "📐", desc: "Professional use" },
                      ].map(opt => (
                        <button key={opt.value} type="button" onClick={() => set("userType", opt.value)}
                          className={`border-2 rounded-xl p-3 text-left transition-all ${form.userType === opt.value ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}>
                          <div className="text-xl mb-1">{opt.icon}</div>
                          <div className="text-xs font-bold text-slate-800">{opt.label}</div>
                          <div className="text-xs text-slate-500">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleSignupNext} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                    Continue <ArrowRight size={16} />
                  </Button>
                  <p className="text-center text-xs text-slate-500">
                    Already have an account?{" "}
                    <button onClick={() => { setMode("login"); setErrors({}); setAuthError(""); }} className="text-emerald-600 font-semibold hover:underline">Log in</button>
                  </p>
                </motion.div>
              )}

              {/* ─── SIGNUP: CONTACT ─── */}
              {mode === "signup" && signupStep === "contact" && (
                <motion.div key="contact" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <p className="text-sm text-slate-600">Hey <span className="font-semibold text-slate-900">{form.name}</span>, how should we reach you?</p>
                  <div className="flex bg-slate-100 rounded-xl p-1">
                    {(["email", "phone"] as const).map(m => (
                      <button key={m} onClick={() => { setContactMode(m); clearError("email"); clearError("phone"); }}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${contactMode === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                        {m === "email" ? <Mail size={14} /> : <Phone size={14} />}
                        {m === "email" ? "Email" : "Phone"}
                      </button>
                    ))}
                  </div>
                  {contactMode === "email" ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email address</label>
                      <input type="email" value={form.email} onChange={e => { set("email", e.target.value); clearError("email"); }}
                        className={`w-full border ${errors.email ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                        placeholder="you@example.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone number</label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-slate-50">+91</div>
                        <input type="tel" value={form.phone} onChange={e => { set("phone", e.target.value.replace(/\D/g, "").slice(0, 10)); clearError("phone"); }}
                          className={`flex-1 border ${errors.phone ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                          placeholder="9876543210" />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  )}
                  <Button onClick={handleSignupNext} disabled={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><span>Send OTP</span> <ArrowRight size={16} /></>}
                  </Button>
                  {contactMode === "email" && !isEmailOtpConfigured && (
                    <p className="text-xs text-slate-500">
                      Real email OTP needs a backend or serverless API. Until `VITE_AUTH_API_BASE_URL` is set, this stays in demo mode.
                    </p>
                  )}
                  <button onClick={() => setSignupStep("identity")} className="w-full text-center text-xs text-slate-500 hover:text-slate-700">← Back</button>
                </motion.div>
              )}

              {/* ─── SIGNUP: OTP ─── */}
              {mode === "signup" && signupStep === "otp" && (
                <motion.div key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 text-center">
                  <div className="flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-full mx-auto">
                    {otpVerified ? <CheckCircle2 size={28} className="text-emerald-600" /> : <Mail size={28} className="text-emerald-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Enter the 6-digit OTP</p>
                    <p className="text-xs text-slate-500 mt-0.5">Sent to {contactMode === "email" ? form.email : `+91 ${form.phone}`}</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {otpValues.map((val, i) => (
                      <input key={i} ref={el => { otpRefs.current[i] = el; }}
                        type="text" inputMode="numeric" maxLength={1} value={val}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all ${otpVerified ? "border-emerald-500 bg-emerald-50 text-emerald-700" : val ? "border-emerald-400" : "border-slate-200"} focus:border-emerald-500`}
                      />
                    ))}
                  </div>
                  {otpVerified && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-600 text-sm font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 size={16} /> Verified!
                    </motion.p>
                  )}
                  {verifyingOtp && (
                    <p className="text-xs text-slate-500">Verifying OTP...</p>
                  )}
                  {otpStatus && (
                    <p className="text-xs text-slate-500">{otpStatus}</p>
                  )}
                  {authError && (
                    <p className="text-xs text-red-500">{authError}</p>
                  )}
                  <div className="text-xs text-slate-500">
                    {resendTimer > 0 ? (
                      <span>Resend in {resendTimer}s</span>
                    ) : (
                      <button onClick={() => { void sendOtp(); }} className="text-emerald-600 font-semibold hover:underline">Resend OTP</button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 bg-slate-50 rounded-lg p-2">
                    {contactMode === "email" && isEmailOtpConfigured
                      ? "Enter the OTP from your email inbox. Check spam if needed."
                      : "Demo mode: enter any 6 digits to auto-verify."}
                  </p>
                  <button onClick={() => { setOtpValues(["", "", "", "", "", ""]); setOtpVerified(false); setAuthError(""); setOtpStatus(""); setSignupStep("contact"); }} className="w-full text-center text-xs text-slate-500 hover:text-slate-700">← Back</button>
                </motion.div>
              )}

              {/* ─── SIGNUP: PASSWORD ─── */}
              {mode === "signup" && signupStep === "password" && (
                <motion.div key="password" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <p className="text-sm text-slate-600">Almost there! Set a secure password.</p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => { set("password", e.target.value); clearError("password"); }}
                        className={`w-full border ${errors.password ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-12`}
                        placeholder="Minimum 8 characters" />
                      <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    <div className="flex gap-1 mt-2">
                      {[4, 6, 8].map(n => (
                        <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${form.password.length >= n ? "bg-emerald-500" : "bg-slate-200"}`} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm password</label>
                    <input type="password" value={form.confirmPassword} onChange={e => { set("confirmPassword", e.target.value); clearError("confirmPassword"); }}
                      className={`w-full border ${errors.confirmPassword ? "border-red-400" : "border-slate-200"} rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                      placeholder="Repeat your password" />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                  <Button onClick={handleSignupNext} disabled={loading} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Create Account"}
                  </Button>
                </motion.div>
              )}

              {/* ─── DONE ─── */}
              {mode === "signup" && signupStep === "done" && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} className="text-emerald-600" />
                  </div>
                  <p className="font-bold text-slate-900 text-lg">Account created!</p>
                  <p className="text-sm text-slate-500">You saved ₹199 — your first quote analysis is completely free.</p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left">
                    <p className="text-xs font-semibold text-emerald-800">Your free benefit</p>
                    <p className="text-sm font-bold text-emerald-700 mt-0.5">1 Free Quote Analysis (worth ₹199)</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
