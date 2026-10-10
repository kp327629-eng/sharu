import React from "react";
import { Sparkles, Compass, Map, Bookmark, Wallet, CloudSun, User, Moon, Sun, ShieldCheck, Plane } from "lucide-react";
import { UserPreferences } from "../types";

interface NavbarProps {
  currentView: "home" | "explore" | "saved" | "budget" | "weather" | "itinerary" | "booking";
  setCurrentView: (view: "home" | "explore" | "saved" | "budget" | "weather" | "itinerary" | "booking") => void;
  onOpenPlanner: () => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  prefs: UserPreferences;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  hasActiveItinerary: boolean;
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
}) => {
  return (
    <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
      <div className="backdrop-blur-xl bg-[#0a0a0c]/80 border border-white/10 rounded-full shadow-2xl px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView("home")}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">
                VOYAGE<span className="text-blue-500 underline underline-offset-4 decoration-2">AI</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/70">
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
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick AI Plan Button */}
          <button
            onClick={onOpenPlanner}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Itinerary</span>
            <span className="sm:hidden">Plan</span>
          </button>

          {/* User Profile / Preferences Trigger */}
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full border-2 border-blue-500/30 p-0.5 hover:border-blue-500 transition-colors flex items-center justify-center bg-white/5"
            title="User Profile & Settings"
          >
            <div className="w-full h-full rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center">
              {prefs.name ? prefs.name.charAt(0).toUpperCase() : "A"}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 backdrop-blur-2xl bg-[#09090b]/90 border border-white/10 rounded-full p-2 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setCurrentView("home")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "home" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Compass className="w-4 h-4" />
          Home
        </button>

        <button
          onClick={() => setCurrentView("explore")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "explore" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Map className="w-4 h-4" />
          Explore
        </button>

        <button
          onClick={() => setCurrentView("booking")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "booking" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Plane className="w-4 h-4" />
          Book
        </button>

        {hasActiveItinerary && (
          <button
            onClick={() => setCurrentView("itinerary")}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
              currentView === "itinerary" ? "text-blue-400 font-bold" : "text-white/50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Trip
          </button>
        )}

        <button
          onClick={() => setCurrentView("saved")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "saved" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Vault
        </button>

        <button
          onClick={() => setCurrentView("budget")}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
            currentView === "budget" ? "text-blue-400 font-bold" : "text-white/50"
          }`}
        >
          <Wallet className="w-4 h-4" />
          Budget
        </button>
      </nav>
    </header>
  );
};
