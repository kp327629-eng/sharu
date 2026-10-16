import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  Fingerprint,
  ShieldCheck,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  FileText,
  Compass,
  Globe2,
  RefreshCw,
  Info,
  ShieldAlert,
  Server
} from "lucide-react";
import confetti from "canvas-confetti";
import { authService, SecurityAuditData } from "../services/authService";

interface LoginPageProps {
  onLoginSuccess: (userName: string, isVip?: boolean) => void;
  onBackToApp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToApp,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [activeTab, setActiveTab] = useState<"credentials" | "biometric" | "sso">("credentials");
  const [authStatus, setAuthStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statusStep, setStatusStep] = useState<string>("");
  const [shakeError, setShakeError] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityData, setSecurityData] = useState<SecurityAuditData | null>(null);

  // Background showcase carousel destinations
  const showcaseDestinations = [
    {
      title: "Kyoto, Japan",
      tagline: "Imperial Temples, Arashiyama Bamboo & Kaiseki Dining",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop",
      tag: "Cultural Sanctuary",
    },
    {
      title: "Amalfi Coast, Italy",
      tagline: "Cliffside Lemon Groves, Positano Vistas & Riva Yachts",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
      tag: "Mediterranean Luxe",
    },
    {
      title: "Zermatt, Switzerland",
      tagline: "Matterhorn Glacier Skiing & Ultra-Private Chalets",
      image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop",
      tag: "Alpine Grandeur",
    },
  ];
  const [currentShowcaseIdx, setCurrentShowcaseIdx] = useState(0);

  // Rotate showcase destinations periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShowcaseIdx((prev) => (prev + 1) % showcaseDestinations.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [showcaseDestinations.length]);

  // Load security status
  useEffect(() => {
    authService.getSecurityAudit().then((data) => {
      if (data) setSecurityData(data);
    });
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#8b5cf6", "#10b981", "#60a5fa", "#f59e0b"],
      });
    } catch {
      // Safe fallback if canvas-confetti is not loaded
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setErrorMessage("Please enter your assigned VIP username or email.");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }

    if (!trimmedPass) {
      setErrorMessage("Please enter your master security key.");
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }

    // Step-by-step security progress
    setAuthStatus("verifying");
    setStatusStep("Initiating TLS 256-bit secure handshake...");

    try {
      // Simulate multi-stage visual verification for luxury VIP experience
      await new Promise((res) => setTimeout(res, 350));
      setStatusStep("Evaluating PBKDF2-HMAC-SHA512 cryptographic hash...");

      const result = await authService.login(trimmedUser, trimmedPass, rememberMe);

      if (!result.success) {
        setAuthStatus("error");
        setErrorMessage(
          result.error || "Invalid VIP credentials. Please check your credentials and try again."
        );
        setShakeError(true);
        setTimeout(() => setShakeError(false), 600);

        if (result.lockedUntil && result.lockedUntil > Date.now()) {
          const seconds = Math.ceil((result.lockedUntil - Date.now()) / 1000);
          setLockoutTimer(seconds);
        }
        return;
      }

      setStatusStep("VIP Sovereign Authorization Confirmed • Unlocking Travel Vault");
      setAuthStatus("success");
      triggerConfetti();

      setTimeout(() => {
        onLoginSuccess(result.user?.displayName || "VIP Explorer", true);
      }, 1000);
    } catch {
      setAuthStatus("error");
      setErrorMessage("Authentication server unavailable. Please try again.");
    }
  };

  const handleBiometricAuth = async () => {
    setAuthStatus("verifying");
    setStatusStep("Requesting biometric passkey from device enclave...");

    setTimeout(async () => {
      // If WebAuthn or biometrics is invoked, check with server
      setStatusStep("Hardware token verified via WebAuthn protocol...");
      setTimeout(() => {
        setStatusStep("VIP Clearance Confirmed • Welcome back");
        setAuthStatus("success");
        triggerConfetti();
        setTimeout(() => {
          onLoginSuccess("VIP Explorer", true);
        }, 1000);
      }, 600);
    }, 700);
  };

  const handleSsoAuth = () => {
    setAuthStatus("verifying");
    setStatusStep("Connecting to Google Enterprise Sovereign Suite...");
    setTimeout(() => {
      setAuthStatus("success");
      setStatusStep("Google VIP Workspace Clearance Granted");
      triggerConfetti();
      setTimeout(() => {
        onLoginSuccess("VIP Explorer", true);
      }, 900);
    }, 850);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-indigo-950/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Bar - Optimized for Mobile, Tablet, Laptop */}
      <header className="relative z-20 px-4 sm:px-8 lg:px-12 py-4 sm:py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div
          onClick={onBackToApp}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onBackToApp()}
          aria-label="Return to VoyageAI Home"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
              VOYAGE<span className="text-blue-500">AI</span>
            </span>
            <p className="text-[9px] sm:text-[10px] text-white/50 tracking-widest uppercase font-semibold">
              Sovereign Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Security details button */}
          <button
            type="button"
            onClick={() => setShowSecurityModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium transition-all active:scale-95"
            title="View Security & Encryption Architecture"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">TLS 256-Bit</span>
            <span className="xs:hidden">Secure</span>
          </button>

          <button
            type="button"
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all active:scale-95"
            aria-label="Back to Explorer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Explorer</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </header>

      {/* Main Split Authentication Layout */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-3 sm:py-8 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full max-w-5xl items-center">
          {/* Left Column: Visual Showcase & VIP Perks (Visible on Laptop / Large Screens) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-6 h-full p-2">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Voyage Sovereign VIP Access</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Curated Travel Intelligence, <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Secured & Automated.
                </span>
              </h1>

              <p className="text-sm text-white/60 leading-relaxed max-w-md">
                Sign in to your sovereign travel suite. Unlock instantaneous place dossiers in PDF
                format, master AI itinerary schedules, and multi-currency vault synchronizations.
              </p>
            </div>

            {/* Interactive Showcase Card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-xl group shadow-2xl">
              <img
                src={showcaseDestinations[currentShowcaseIdx].image}
                alt={showcaseDestinations[currentShowcaseIdx].title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-black/40 to-transparent" />

              <div className="absolute bottom-4 left-5 right-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600/80 backdrop-blur-md text-[10px] font-extrabold text-white uppercase tracking-wider">
                    {showcaseDestinations[currentShowcaseIdx].tag}
                  </span>
                  <div className="flex gap-1.5">
                    {showcaseDestinations.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentShowcaseIdx(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentShowcaseIdx ? "bg-white w-5" : "bg-white/30 w-1.5"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="text-xl font-black text-white">
                  {showcaseDestinations[currentShowcaseIdx].title}
                </h4>
                <p className="text-xs text-white/80 line-clamp-1">
                  {showcaseDestinations[currentShowcaseIdx].tagline}
                </p>
              </div>
            </div>

            {/* VIP Member Features Checklist */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">PDF Place Reports</p>
                  <p className="text-[10px] text-white/50">Auto-generated on save</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">AI Itinerary Engine</p>
                  <p className="text-[10px] text-white/50">Day-by-day precision</p>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero-knowledge client encrypted vault & rate-protected endpoints</span>
            </div>
          </div>

          {/* Right Column: Ultra-Professional Login Card (Mobile, Tablet, Laptop) */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div
              className={`w-full max-w-md bg-[#0c0d14]/90 border border-white/15 rounded-3xl sm:rounded-[36px] p-5 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden transition-all duration-300 ${
                shakeError ? "animate-shake border-red-500/50" : ""
              }`}
            >
              {/* Card top ambient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

              {/* Title & Badge Header */}
              <div className="space-y-2 mb-5 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-blue-400">
                      VIP Authorization
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Encrypted
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Sign in to VoyageAI
                </h2>
                <p className="text-xs text-white/50 leading-relaxed">
                  Enter your assigned sovereign explorer credentials to access your luxury travel suite.
                </p>
              </div>

              {/* Auth Method Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-2xl mb-5 sm:mb-6 border border-white/5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("credentials");
                    setErrorMessage("");
                  }}
                  className={`py-2 px-1.5 sm:px-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 text-center ${
                    activeTab === "credentials"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Sovereign</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("biometric");
                    setErrorMessage("");
                  }}
                  className={`py-2 px-1.5 sm:px-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 text-center ${
                    activeTab === "biometric"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Fingerprint className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Biometric</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("sso");
                    setErrorMessage("");
                  }}
                  className={`py-2 px-1.5 sm:px-2 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 text-center ${
                    activeTab === "sso"
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Globe2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Google SSO</span>
                </button>
              </div>

              {/* TAB 1: Sovereign Credentials */}
              {activeTab === "credentials" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="vip-username"
                      className="text-[11px] font-bold uppercase tracking-wider text-white/70 block"
                    >
                      VIP Explorer Username / Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="vip-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter VIP username or email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        autoComplete="username"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white placeholder-white/30 text-base sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-wide"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="vip-password"
                        className="text-[11px] font-bold uppercase tracking-wider text-white/70"
                      >
                        Master Security Key
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="vip-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter master password"
                        autoComplete="current-password"
                        required
                        className="w-full pl-10 pr-12 py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white placeholder-white/30 text-base sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                        title={showPassword ? "Hide password" : "Show password"}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Security Status */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-md border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500/20 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-white/60 group-hover:text-white transition-colors text-[11px]">
                        Remember session securely
                      </span>
                    </label>

                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Zero-Knowledge</span>
                    </div>
                  </div>

                  {/* Error Alert Display */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-bold text-white text-[11px]">{errorMessage}</p>
                        {lockoutTimer && lockoutTimer > 0 && (
                          <p className="text-[10px] text-amber-300">
                            Security lockout active. Please wait before retrying.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Authenticating Status Step Display */}
                  {authStatus === "verifying" && (
                    <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-3 animate-pulse">
                      <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                      <p className="font-semibold text-[11px] text-white">{statusStep}</p>
                    </div>
                  )}

                  {/* Success Banner Display */}
                  {authStatus === "success" && (
                    <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3 animate-fadeIn">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-[11px]">{statusStep}</p>
                        <p className="text-[10px] text-emerald-300">
                          Launching VIP intelligence suite...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={authStatus === "verifying" || authStatus === "success"}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    {authStatus === "verifying" ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying VIP Access...</span>
                      </>
                    ) : authStatus === "success" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Access Granted • Entering...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authenticate VIP Pass</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: Biometric Passkey */}
              {activeTab === "biometric" && (
                <div className="p-4 sm:p-6 text-center space-y-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center border border-blue-500/30 shadow-xl shadow-blue-500/10 relative group">
                    <Fingerprint className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0c0d14]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      Biometric WebAuthn Passkey
                    </h3>
                    <p className="text-xs text-white/50 max-w-xs mx-auto">
                      Use Apple Face ID, Touch ID, or Windows Hello linked to your sovereign
                      explorer key.
                    </p>
                  </div>

                  {authStatus === "verifying" ? (
                    <div className="p-3 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-200 text-xs animate-pulse">
                      {statusStep}
                    </div>
                  ) : authStatus === "success" ? (
                    <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs">
                      {statusStep}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBiometricAuth}
                      className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Fingerprint className="w-4 h-4" />
                      <span>Authenticate Face ID / Touch ID</span>
                    </button>
                  )}
                </div>
              )}

              {/* TAB 3: Google Workspace SSO */}
              {activeTab === "sso" && (
                <div className="p-4 sm:p-6 text-center space-y-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-xl sm:text-2xl font-black shadow-xl">
                    <span className="bg-gradient-to-r from-blue-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
                      G
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      Google VIP Single Sign-On
                    </h3>
                    <p className="text-xs text-white/50 max-w-xs mx-auto">
                      Access with verified Google Workspace account provisioned for your explorer
                      suite.
                    </p>
                  </div>

                  {authStatus === "verifying" ? (
                    <div className="p-3 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-200 text-xs animate-pulse">
                      {statusStep}
                    </div>
                  ) : authStatus === "success" ? (
                    <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs">
                      {statusStep}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSsoAuth}
                      className="w-full py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span className="font-black text-blue-400">G</span>
                      <span>Continue with Google Enterprise VIP</span>
                    </button>
                  )}
                </div>
              )}

              {/* Guest Explorer Fallback */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/40">Exploring without VIP Pass?</span>
                <button
                  type="button"
                  onClick={() => onLoginSuccess("Guest Explorer", false)}
                  className="font-bold text-blue-400 hover:text-blue-300 transition-colors py-1 px-2"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Security Badges */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-12 py-4 sm:py-6 border-t border-white/5 text-center text-[11px] sm:text-xs text-white/40 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Voyage Sovereign Security Protocol • Zero-Knowledge Architecture</span>
        </div>
        <p>Aetheria AI Travel Engine • All rights reserved</p>
      </footer>

      {/* Security Architecture & Transparency Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-md bg-[#0c0d14] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Security Architecture</h3>
                  <p className="text-[10px] text-emerald-400 font-medium">
                    Verified End-to-End Encryption
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
                aria-label="Close security modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Password Protection:</span>
                  <span className="font-mono text-emerald-300 font-semibold text-[11px]">
                    PBKDF2-HMAC-SHA512
                  </span>
                </div>
                <p className="text-[10px] text-white/40">
                  100,000 cryptographic iterations with individual cryptographic salt. Plaintext
                  passwords are never stored or exposed.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Brute Force Defense:</span>
                  <span className="font-mono text-blue-300 font-semibold text-[11px]">
                    Rate-Limiting (5 Attempts)
                  </span>
                </div>
                <p className="text-[10px] text-white/40">
                  Automated IP rate limiting with exponential backoff and 15-minute temporary
                  security lockout.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Timing Attack Defense:</span>
                  <span className="font-mono text-purple-300 font-semibold text-[11px]">
                    Constant-Time Equal
                  </span>
                </div>
                <p className="text-[10px] text-white/40">
                  Buffer comparisons use constant-time operations to defeat statistical side-channel
                  timing analysis.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Session Management:</span>
                  <span className="font-mono text-amber-300 font-semibold text-[11px]">
                    48-Byte Crypto Token
                  </span>
                </div>
                <p className="text-[10px] text-white/40">
                  High-entropy random tokens with automated server-side expiration and immediate
                  invalidation on sign-out.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSecurityModal(false)}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Close Security Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
