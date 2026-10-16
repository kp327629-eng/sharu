import React, { useState } from "react";
import {
  Sparkles,
  Compass,
  Map,
  Bookmark,
  Wallet,
  CloudSun,
  User,
  Moon,
  Sun,
  ShieldCheck,
  Plane,
  KeyRound,
  Crown,
  LogOut,
  ChevronDown
} from "lucide-react";
import { UserPreferences } from "../types";

export type ViewType =
  | "home"
  | "explore"
  | "saved"
  | "budget"
  | "weather"
  | "itinerary"
  | "booking"
  | "login";

interface NavbarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  onOpenPlanner: () => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  prefs: UserPreferences;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  hasActiveItinerary: boolean;
  isVipAuthenticated?: boolean;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenPlanner,
  onOpenAuth,
  onOpenSettings,
  prefs,
  darkMode,
  setDarkMode,
  hasActiveItinerary,
  isVipAuthenticated = false,
  onSignOut,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const isUserVip = Boolean(isVipAuthenticated || prefs.name?.toLowerCase() === "sharu" || prefs.isVip);

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
      <div className="backdrop-blur-xl bg-[#0a0a0c]/85 border border-white/10 rounded-full shadow-2xl px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView("home")}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                VOYAGE<span className="text-blue-500 underline underline-offset-4 decoration-2">AI</span>
              </span>
              {isUserVip && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 text-[9px] font-black tracking-wider uppercase">
                  <Crown className="w-3 h-3 text-amber-400" />
                  VIP
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-white/70">
          <button
            onClick={() => setCurrentView("home")}
            className={`transition-colors ${
              currentView === "home" ? "text-white font-bold" : "hover:text-white"
            }`}
          >
            Planner
          </button>

          <button
            onClick={() => setCurrentView("explore")}
            className={`transition-colors ${
              currentView === "explore" ? "text-white font-bold" : "hover:text-white"
            }`}
          >
            Explore
          </button>

          <button
            onClick={() => setCurrentView("booking")}
            className={`transition-colors ${
              currentView === "booking" ? "text-white font-bold" : "hover:text-white"
            }`}
          >
            Bookings
          </button>

          {hasActiveItinerary && (
            <button
              onClick={() => setCurrentView("itinerary")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                currentView === "itinerary"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Active Trip
            </button>
          )}

          <button
            onClick={() => setCurrentView("saved")}
            className={`transition-colors ${
              currentView === "saved" ? "text-white font-bold" : "hover:text-white"
            }`}
          >
            Vault
          </button>

          <button
            onClick={() => setCurrentView("budget")}
            className={`transition-colors ${
              currentView === "budget" ? "text-white font-bold" : "hover:text-white"
            }`}
          >
            Budget
          </button>

          <button
            onClick={() => setCurrentView("weather")}
            className={`transition-colors ${
              currentView === "weather" ? "text-white font-bold" : "hover:text-white"
            }`}
          >
            Weather
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* VIP Login / Auth State Button */}
          {isUserVip ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 hover:border-amber-400/50 text-white transition-all shadow-sm group"
                title="VIP Member Controls"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black font-black text-xs flex items-center justify-center shadow-sm">
                  {prefs.name ? prefs.name.charAt(0).toUpperCase() : "V"}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1 leading-none">
                    <span className="text-xs font-bold text-white tracking-wide truncate max-w-[80px]">
                      {prefs.name || "VIP Member"}
                    </span>
                    <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                  </div>
                  <span className="text-[9px] text-amber-300/80 font-mono">VIP Active</span>
                </div>
                <ChevronDown className="w-3 h-3 text-white/50 group-hover:text-white transition-transform" />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0d1017]/95 border border-white/15 rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs font-bold text-white">{prefs.name || "VIP Member"}</p>
                    <p className="text-[10px] text-amber-400 font-mono">Session: Authenticated VIP</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      Encrypted Sovereign Vault
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Traveler Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setCurrentView("saved");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved Place Vault & PDFs</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setCurrentView("login");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>VIP Sovereign Portal</span>
                  </button>

                  {onSignOut && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-white/10 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setCurrentView("login")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold transition-all shadow-md active:scale-95 ${
                currentView === "login"
                  ? "bg-blue-600 text-white border-blue-400 shadow-blue-500/30"
                  : "bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 border-blue-500/40 text-white"
              }`}
              title="Sign in with your assigned VIP credentials"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>VIP Sign In</span>
            </button>
          )}

          {/* Quick AI Plan Button */}
          <button
            onClick={onOpenPlanner}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Itinerary</span>
            <span className="sm:hidden">Plan</span>
          </button>

          {/* Preferences Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 hover:border-blue-500 p-0.5 transition-colors flex items-center justify-center bg-white/5"
            title="User Profile & Settings"
          >
            <div className="w-full h-full rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center">
              {prefs.name ? prefs.name.charAt(0).toUpperCase() : "S"}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 backdrop-blur-2xl bg-[#09090b]/95 border border-white/10 rounded-full p-2 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setCurrentView("home")}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "home" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Compass className="w-4 h-4" />
          Home
        </button>

        <button
          onClick={() => setCurrentView("explore")}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "explore" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Map className="w-4 h-4" />
          Explore
        </button>

        <button
          onClick={() => setCurrentView("booking")}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "booking" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Plane className="w-4 h-4" />
          Book
        </button>

        <button
          onClick={() => setCurrentView("saved")}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "saved" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Vault
        </button>

        <button
          onClick={() => setCurrentView("budget")}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "budget" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Wallet className="w-4 h-4" />
          Budget
        </button>

        <button
          onClick={() => setCurrentView("login")}
          className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "login"
              ? "text-blue-400 font-bold"
              : isUserVip
              ? "text-amber-400"
              : "text-white/50"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          {isUserVip ? "VIP" : "Login"}
        </button>
      </nav>
    </header>
  );
};
