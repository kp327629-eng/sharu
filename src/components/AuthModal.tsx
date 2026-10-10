import React, { useState } from "react";
import { X, Fingerprint, ShieldCheck, Sparkles, Check } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMethod, setAuthMethod] = useState<"options" | "passkey">("options");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePasskey = () => {
    setAuthMethod("passkey");
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess("Alexander Wright");
      onClose();
    }, 2000);
  };

  const handleSimulateGoogle = () => {
    onLoginSuccess("Alex Vance");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md bg-[#090a0f]/90 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 backdrop-blur-2xl relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">
              Aetheria Passkey Auth
            </h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {authMethod === "options" ? (
          <div className="space-y-3">
            <button
              onClick={handleSimulatePasskey}
              className="w-full py-4 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Fingerprint className="w-4 h-4" />
              Sign in with Face ID / Biometrics
            </button>

            <button
              onClick={handleSimulateGoogle}
              className="w-full py-4 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <span className="font-extrabold text-blue-400">G</span>
              Continue with Google Account
            </button>

            <button
              onClick={() => {
                onLoginSuccess("Guest Explorer");
                onClose();
              }}
              className="w-full py-2.5 text-xs text-white/40 hover:text-white font-semibold transition-all"
            >
              Continue in Guest Mode
            </button>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center animate-pulse border border-blue-500/30">
              <Fingerprint className="w-8 h-8" />
            </div>
            <p className="font-bold text-base text-white">
              Scanning Face ID / Touch ID...
            </p>
            <p className="text-xs text-white/50">Verifying secure hardware token</p>
          </div>
        )}
      </div>
    </div>
  );
};
