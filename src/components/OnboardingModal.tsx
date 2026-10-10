import React, { useState } from "react";
import { Sparkles, Check, ArrowRight, ArrowLeft, Heart, X, Compass, Globe, ChevronDown } from "lucide-react";
import { UserPreferences, TravelStyle, BudgetTier } from "../types";
import { ALL_CURRENCIES, POPULAR_CURRENCIES, getCurrencyInfo } from "../data/currencies";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (prefs: UserPreferences) => void;
  initialPrefs: UserPreferences;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSavePreferences,
  initialPrefs,
}) => {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<UserPreferences>(initialPrefs);

  if (!isOpen) return null;

  const travelStyles: { id: TravelStyle; label: string; desc: string; icon: string }[] = [
    { id: "Solo", label: "Solo Explorer", desc: "Freedom, self-discovery & authentic local spots", icon: "🧭" },
    { id: "Luxury", label: "Luxury & Heritage", desc: "5-Star hotels, private tours & fine dining", icon: "✨" },
    { id: "Family", label: "Family Holiday", desc: "Kid-friendly activities, comfortable pace & safety", icon: "👨‍👩‍👧‍👦" },
    { id: "Backpacker", label: "Backpacker / Budget", desc: "Hostels, scenic hikes & maximum value", icon: "🎒" },
    { id: "Digital Nomad", label: "Digital Nomad", desc: "Fast Wi-Fi, quiet cafes & long-stay hubs", icon: "💻" },
    { id: "Couples", label: "Romantic Getaway", desc: "Sunsets, boutique stays & candlelight dining", icon: "🥂" },
    { id: "Adventure", label: "Extreme Adventure", desc: "Hiking, rafting, diving & off-grid thrill", icon: "🧗" },
    { id: "Road Trip", label: "Scenic Road Trip", desc: "Coastal drives, mountain passes & freedom", icon: "🚗" },
  ];

  const budgetTiers: { id: BudgetTier; label: string; range: string }[] = [
    { id: "Budget", label: "Smart Budget", range: "$50 – $100 / day" },
    { id: "Balanced", label: "Comfort & Style", range: "$150 – $300 / day" },
    { id: "Premium Luxury", label: "Premium Luxury", range: "$400 – $800 / day" },
    { id: "Ultra High-Net-Worth", label: "Bespoke / Unlimited", range: "$1000+ / day" },
  ];

  const foodPrefs = [
    "Local Specialties & Everything",
    "Vegetarian",
    "Vegan",
    "Halal",
    "Kosher",
    "Jain",
    "Gluten-Free",
    "Seafood Lover",
    "Street Food Adventurer",
  ];

  const dreamSpots = [
    "Kyoto & Tokyo",
    "Amalfi Coast & Rome",
    "Swiss Alps & Zermatt",
    "Bali & Komodo Islands",
    "Paris & French Riviera",
    "Santorini & Mykonos",
    "Oaxaca & Mexico City",
    "Reykjavík & Blue Lagoon",
    "Cape Town & Kruger Safari",
  ];

  const toggleDreamSpot = (spot: string) => {
    const exists = prefs.dreamDestinations.includes(spot);
    if (exists) {
      setPrefs({ ...prefs, dreamDestinations: prefs.dreamDestinations.filter((s) => s !== spot) });
    } else {
      setPrefs({ ...prefs, dreamDestinations: [...prefs.dreamDestinations, spot] });
    }
  };

  const handleFinish = () => {
    const finalPrefs = { ...prefs, isOnboarded: true };
    onSavePreferences(finalPrefs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#090a0f]/90 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-2xl relative">
        {/* Header step progress */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Personalize Your AI Engine
              </h3>
              <p className="text-xs text-white/50">Step {step} of 4</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h4 className="text-lg font-bold text-white">What is your primary Travel Style?</h4>
                <p className="text-xs text-white/50">
                  VoyageAI customizes itinerary pacing, accommodation class, and activity highlights to your exact vibe.
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">Your Name</label>
                <input
                  type="text"
                  value={prefs.name}
                  onChange={(e) => setPrefs({ ...prefs, name: e.target.value })}
                  placeholder="e.g. Arjun"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {travelStyles.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setPrefs({ ...prefs, travelStyle: style.id })}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      prefs.travelStyle === style.id
                        ? "border-blue-500 bg-blue-600/20 ring-1 ring-blue-500"
                        : "border-white/5 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="text-2xl">{style.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-xs text-white">{style.label}</p>
                      <p className="text-[11px] text-white/50 mt-0.5">{style.desc}</p>
                    </div>
                    {prefs.travelStyle === style.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-lg font-bold text-white">Budget Tier & Preferred Currency</h4>
                <p className="text-xs text-white/50">
                  Select your comfortable spending bracket for accommodation, dining, and activities.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">Target Daily Budget</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {budgetTiers.map((tier) => (
                    <div
                      key={tier.id}
                      onClick={() => setPrefs({ ...prefs, budgetTier: tier.id })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        prefs.budgetTier === tier.id
                          ? "border-blue-500 bg-blue-600/20 ring-1 ring-blue-500"
                          : "border-white/5 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <p className="font-bold text-xs text-white">{tier.label}</p>
                      <p className="text-xs font-semibold text-blue-400 mt-1">{tier.range}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-widest">Preferred Country Currency</label>
                  <span className="text-xs font-bold text-emerald-400">
                    Selected: {getCurrencyInfo(prefs.currency).flag} {getCurrencyInfo(prefs.currency).code} ({getCurrencyInfo(prefs.currency).symbol})
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CURRENCIES.map((code) => {
                    const c = getCurrencyInfo(code);
                    const isSelected = prefs.currency === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setPrefs({ ...prefs, currency: code })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30"
                            : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">
                    Select Any Country / World Currency
                  </label>
                  <div className="relative">
                    <select
                      value={prefs.currency}
                      onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                    >
                      {ALL_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                          {c.flag} {c.code} - {c.name} ({c.symbol}) • {c.country}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-white/50 absolute right-4 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-lg font-bold text-white">Culinary & Dietary Preferences</h4>
                <p className="text-xs text-white/50">
                  The AI concierge filters restaurant recommendations to match your exact dietary requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {foodPrefs.map((item) => (
                  <button
                    key={item}
                    onClick={() => setPrefs({ ...prefs, foodPreference: item })}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      prefs.foodPreference === item
                        ? "border-blue-500 bg-blue-600/20 text-white font-semibold"
                        : "border-white/5 bg-white/5 text-white/70 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xs">{item}</span>
                    {prefs.foodPreference === item && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h4 className="text-lg font-bold text-white">Dream Bucket List Destinations</h4>
                <p className="text-xs text-white/50">
                  Select places on your bucket list to populate tailored recommendations.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {dreamSpots.map((spot) => {
                  const isSelected = prefs.dreamDestinations.includes(spot);
                  return (
                    <button
                      key={spot}
                      onClick={() => toggleDreamSpot(spot)}
                      className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-blue-500/30"
                          : "bg-white/5 border-white/10 text-white/70 hover:border-white/20"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSelected ? "fill-white text-white" : "text-white/40"}`} />
                      {spot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-6 pt-4 border-t border-white/10 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-extrabold shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Launch VoyageAI Engine
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

