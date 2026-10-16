import React, { useState, useEffect } from "react";
import { X, User, Globe, DollarSign, Utensils, Moon, Sun, Sparkles, Check, ChevronDown } from "lucide-react";
import { UserPreferences, TravelStyle, BudgetTier } from "../types";
import { ALL_CURRENCIES, POPULAR_CURRENCIES, getCurrencyInfo } from "../data/currencies";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefs: UserPreferences;
  onSavePrefs: (prefs: UserPreferences) => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenOnboarding: () => void;
  onOpenLogin?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  prefs,
  onSavePrefs,
  darkMode,
  setDarkMode,
  onOpenOnboarding,
  onOpenLogin,
}) => {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(prefs);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    setLocalPrefs(prefs);
  }, [prefs, isOpen]);

  if (!isOpen) return null;

  const currentCurrencyInfo = getCurrencyInfo(localPrefs.currency);

  const filteredCurrencies = ALL_CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.country.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleUpdateField = (field: keyof UserPreferences, value: any) => {
    const updated = { ...localPrefs, [field]: value };
    setLocalPrefs(updated);
    onSavePrefs(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-xl bg-[#090a0f]/95 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 sticky top-0 bg-[#090a0f]/90 backdrop-blur-md z-10 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                User Profile & Country Preferences
              </h3>
              <p className="text-xs text-white/50">Manage local currency & traveler profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 text-xs">
          {/* User Name Input */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <label className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">
              Explorer Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localPrefs.name}
                onChange={(e) => handleUpdateField("name", e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
              />
              <span className="px-3.5 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold flex items-center text-xs">
                {localPrefs.travelStyle}
              </span>
            </div>
          </div>

          {/* Currency Selection Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/30 to-white/5 border border-blue-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-extrabold text-white uppercase tracking-widest">
                  Country Currency Preference
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                {currentCurrencyInfo.flag} {currentCurrencyInfo.symbol} {currentCurrencyInfo.code}
              </span>
            </div>

            <p className="text-xs text-white/60">
              Selected Currency: <strong className="text-white">{currentCurrencyInfo.name}</strong> ({currentCurrencyInfo.country})
            </p>

            {/* Quick Currency Select Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Popular World Currencies</span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_CURRENCIES.map((code) => {
                  const info = getCurrencyInfo(code);
                  const isSelected = localPrefs.currency === code;
                  return (
                    <button
                      key={code}
                      onClick={() => handleUpdateField("currency", code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30"
                          : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>{info.flag}</span>
                      <span>{info.code}</span>
                      <span className="text-[10px] opacity-70">({info.symbol})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dropdown for ALL Global Country Currencies */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                All Countries & World Currencies
              </label>
              <div className="relative">
                <select
                  value={localPrefs.currency}
                  onChange={(e) => handleUpdateField("currency", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                >
                  {ALL_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-zinc-900 text-white py-1">
                      {c.flag} {c.code} - {c.name} ({c.symbol}) • {c.country}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-white/50 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Preferences Summary & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Budget Tier</p>
              <select
                value={localPrefs.budgetTier}
                onChange={(e) => handleUpdateField("budgetTier", e.target.value as BudgetTier)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold text-white focus:outline-none"
              >
                <option value="Budget">Smart Budget</option>
                <option value="Balanced">Comfort & Style</option>
                <option value="Premium Luxury">Premium Luxury</option>
                <option value="Ultra High-Net-Worth">Bespoke / Unlimited</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Dietary Preference</p>
              <select
                value={localPrefs.foodPreference}
                onChange={(e) => handleUpdateField("foodPreference", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold text-white focus:outline-none"
              >
                <option value="Local Specialties & Everything">Local Specialties & Everything</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Halal">Halal</option>
                <option value="Kosher">Kosher</option>
                <option value="Jain">Jain</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>
          </div>

          {/* Theme switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <span className="font-bold text-white block">Dark Mode Aesthetics</span>
              <span className="text-[10px] text-white/50">Toggle high-contrast dark theme</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full p-1 transition-all ${
                darkMode ? "bg-blue-600" : "bg-white/20"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* VIP Credentials Access */}
          {onOpenLogin && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-amber-950/20 border border-blue-500/20 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-xs text-white">VIP Explorer Authentication</p>
                <p className="text-[10px] text-white/50">
                  {prefs.isVip || prefs.name?.toLowerCase() === "sarulatha" || prefs.name?.toLowerCase() === "sharu"
                    ? "Authenticated VIP Session • Master Travel Intelligence Active"
                    : "VIP Sovereign Portal • Sign in with your assigned VIP credentials"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
              >
                {prefs.isVip || prefs.name?.toLowerCase() === "sarulatha" || prefs.name?.toLowerCase() === "sharu" ? "VIP Dashboard" : "VIP Sign In"}
              </button>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenOnboarding();
            }}
            className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            Re-run Preferences Onboarding
          </button>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Done / Save
          </button>
        </div>
      </div>
    </div>
  );
};

