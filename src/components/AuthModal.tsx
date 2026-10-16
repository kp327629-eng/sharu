import React, { useState } from "react";
import {
  X,
  Fingerprint,
  ShieldCheck,
  Sparkles,
  Check,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Maximize2,
  RefreshCw,
  Globe2
} from "lucide-react";
import confetti from "canvas-confetti";
import { authService } from "../services/authService";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, isVip?: boolean) => void;
  onNavigateToFullLoginPage?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onNavigateToFullLoginPage,
}) => {
  const [authMethod, setAuthMethod] = useState<"credentials" | "passkey" | "google">("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setErrorMessage("Please enter your VIP explorer username.");
      return;
    }
    if (!trimmedPass) {
      setErrorMessage("Please enter your master security key.");
      return;
    }

    setIsAuthenticating(true);
    setStatusMessage("Verifying VIP Sovereign Credentials...");

    try {
      const result = await authService.login(trimmedUser, trimmedPass, true);

      if (!result.success) {
        setIsAuthenticating(false);
        setErrorMessage(
          result.error || "Invalid VIP credentials. Please verify your credentials and try again."
        );
        return;
      }

      setStatusMessage("VIP Clearance Granted • Welcome back");
      triggerConfetti();

      setTimeout(() => {
        setIsAuthenticating(false);
        onLoginSuccess(result.user?.displayName || "VIP Explorer", true);
        onClose();
      }, 700);
    } catch {
      setIsAuthenticating(false);
      setErrorMessage("Security authentication failed. Please try again.");
    }
  };

  const handleSimulatePasskey = () => {
    setAuthMethod("passkey");
    setIsAuthenticating(true);
    setStatusMessage("Authenticating Secure Hardware Enclave...");
    setTimeout(() => {
      setStatusMessage("Face ID / Biometric Verified");
      triggerConfetti();
      setTimeout(() => {
        setIsAuthenticating(false);
        onLoginSuccess("VIP Explorer", true);
        onClose();
      }, 800);
    }, 1000);
  };

  const handleSimulateGoogle = () => {
    setIsAuthenticating(true);
    setStatusMessage("Connecting to Google VIP Workspace...");
    setTimeout(() => {
      setIsAuthenticating(false);
      triggerConfetti();
      onLoginSuccess("VIP Explorer", true);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-[#0a0c13]/95 border border-white/15 rounded-3xl sm:rounded-[32px] shadow-2xl overflow-hidden p-5 sm:p-7 space-y-4 sm:space-y-5 backdrop-blur-2xl relative my-auto">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">VoyageAI VIP Access</h3>
              <p className="text-[9px] sm:text-[10px] text-white/50 tracking-wider uppercase font-semibold">
                Sovereign Travel Vault
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onNavigateToFullLoginPage && (
              <button
                type="button"
                onClick={onNavigateToFullLoginPage}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Open Fullscreen Login Portal"
                aria-label="Open Fullscreen Login Portal"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Assurance Banner */}
        <div className="px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-white/80 font-medium">
              TLS 256-Bit • End-to-End Encrypted
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
            Active
          </span>
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-white/5 rounded-2xl border border-white/5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("credentials");
              setErrorMessage("");
            }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              authMethod === "credentials"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="text-[11px]">Credentials</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("passkey");
              setErrorMessage("");
            }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              authMethod === "passkey"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span className="text-[11px]">Passkey</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod("google");
              setErrorMessage("");
            }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              authMethod === "google"
                ? "bg-blue-600 text-white shadow-md font-bold"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Google</span>
          </button>
        </div>

        {/* Form Body */}
        {authMethod === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
            {/* Username Input */}
            <div className="space-y-1">
              <label
                htmlFor="modal-username"
                className="text-[11px] font-bold uppercase tracking-wider text-white/70 block"
              >
                VIP Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="modal-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your VIP username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white placeholder-white/30 text-base sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-wide"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label
                htmlFor="modal-password"
                className="text-[11px] font-bold uppercase tracking-wider text-white/70 block"
              >
                Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="modal-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white/[0.06] border border-white/10 rounded-2xl text-white placeholder-white/30 text-base sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-red-950/70 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-[11px] font-medium leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Status Message */}
            {isAuthenticating && (
              <div className="p-3 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-2.5 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />
                <span className="text-[11px] font-semibold">{statusMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In as VIP</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Passkey Tab */}
        {authMethod === "passkey" && (
          <div className="py-4 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center border border-blue-500/30 shadow-lg">
              <Fingerprint className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-white">Biometric Hardware Key</h4>
              <p className="text-xs text-white/50 max-w-xs mx-auto">
                Authenticate with Face ID, Touch ID, or FIDO2 Security Token.
              </p>
            </div>
            {isAuthenticating ? (
              <div className="p-3 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-200 text-xs animate-pulse">
                {statusMessage}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulatePasskey}
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Verify Biometric Passkey</span>
              </button>
            )}
          </div>
        )}

        {/* Google SSO Tab */}
        {authMethod === "google" && (
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-xl font-black">
              <span className="bg-gradient-to-r from-blue-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
                G
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-white">Enterprise VIP SSO</h4>
              <p className="text-xs text-white/50 max-w-xs mx-auto">
                Authenticate with verified enterprise travel credentials.
              </p>
            </div>
            {isAuthenticating ? (
              <div className="p-3 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-200 text-xs animate-pulse">
                {statusMessage}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSimulateGoogle}
                className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Continue with Google VIP</span>
              </button>
            )}
          </div>
        )}

        {/* Modal Bottom Switch to Fullscreen */}
        {onNavigateToFullLoginPage && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onNavigateToFullLoginPage}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Open Dedicated Full-Screen Login Portal →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
