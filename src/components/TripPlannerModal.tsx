import React, { useState } from "react";
import { Sparkles, X, Calendar, Users, DollarSign, Compass, Utensils, Hotel, Car, Check, Loader2, Zap, Bookmark, Download } from "lucide-react";
import { UserPreferences, TravelStyle, BudgetTier, TripItinerary } from "../types";
import { generatePlaceReportPDF } from "../utils/generatePlaceReportPDF";

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripGenerated: (trip: TripItinerary) => void;
  initialDestination?: string;
  prefs: UserPreferences;
  onSavePlace?: (dest: any) => void;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  isOpen,
  onClose,
  onTripGenerated,
  initialDestination = "",
  prefs,
  onSavePlace,
}) => {
  const [destination, setDestination] = useState(initialDestination || "Kyoto, Japan");
  const [departureCity, setDepartureCity] = useState("San Francisco");
  const [durationDays, setDurationDays] = useState(3);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(prefs.budgetTier || "Balanced");
  const [travelStyle, setTravelStyle] = useState<TravelStyle>(prefs.travelStyle || "Explorer");
  const [transport, setTransport] = useState("Public Transport & Walking");
  const [hotelClass, setHotelClass] = useState("4-Star Boutique");
  const [foodPreference, setFoodPreference] = useState(prefs.foodPreference || "Local Specialties");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Landmarks",
    "Local Food",
    "Culture & History",
    "Instagram Spots",
  ]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAndDownloadPlace = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    generatePlaceReportPDF(destination.trim(), prefs.currency || "USD", prefs.name || "Explorer");
    if (onSavePlace) {
      onSavePlace(destination.trim());
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  if (!isOpen) return null;

  const quickTemplates = [
    { label: "🌸 5-Day Japan Cultural", dest: "Kyoto & Tokyo, Japan", days: 5, style: "Explorer", budget: "Balanced" },
    { label: "🏝️ Luxury Maldives Honeymoon", dest: "Maldives Atolls", days: 6, style: "Luxury", budget: "Premium Luxury" },
    { label: "🎒 Backpacking Europe", dest: "Prague & Vienna", days: 7, style: "Backpacker", budget: "Budget" },
    { label: "👨‍👩‍👧‍👦 Family Disney & Parks", dest: "Orlando, Florida", days: 4, style: "Family", budget: "Balanced" },
    { label: "🍋 Amalfi Coast Roadtrip", dest: "Positano, Italy", days: 5, style: "Roadtrip", budget: "Premium Luxury" },
  ];

  const loadingSteps = [
    "Connecting to Gemini 3.6 Flash Neural Engine...",
    `Scanning top-rated locations in ${destination}...`,
    "Curating authentic local gastronomy & secret spots...",
    "Optimizing day-wise route clusters & travel times...",
    "Drafting essential visa, safety & weather advice...",
    "Finalizing your VoyageAI-crafted itinerary...",
  ];

  const availableInterests = [
    "Landmarks",
    "Local Food",
    "Culture & History",
    "Instagram Spots",
    "Hidden Gems",
    "Museums & Art",
    "Nature & Parks",
    "Nightlife & Bars",
    "Shopping & Markets",
    "Kids Activities",
    "Photography",
    "Relaxation & Spa",
  ];

  const applyTemplate = (tpl: any) => {
    setDestination(tpl.dest);
    setDurationDays(tpl.days);
    setTravelStyle(tpl.style as TravelStyle);
    setBudgetTier(tpl.budget as BudgetTier);
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsLoading(true);
    setLoadingStepIndex(0);

    const stepInterval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          departureCity,
          durationDays,
          travelers: { adults, children },
          budgetTier,
          travelStyle,
          transport,
          hotelClass,
          foodPreference,
          interests: selectedInterests,
        }),
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (data.success && data.trip) {
        const fullTrip: TripItinerary = {
          ...data.trip,
          id: `trip-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isSaved: true,
        };
        onTripGenerated(fullTrip);
        onClose();
      } else {
        alert("Failed to generate itinerary. Please try again.");
      }
    } catch (err) {
      clearInterval(stepInterval);
      console.error(err);
      alert("An error occurred while generating the itinerary.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#090a0f]/90 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                AI Master Trip Architect
              </h3>
              <p className="text-xs text-white/50">
                Tailored with neural precision for {prefs.name || "Explorer"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body or Loading Animation */}
        {isLoading ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-6 my-auto">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
              <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h4 className="font-bold text-lg text-white">
                Designing {destination}...
              </h4>
              <p className="text-xs font-semibold text-blue-400 animate-pulse">
                {loadingSteps[loadingStepIndex]}
              </p>
            </div>

            <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((loadingStepIndex + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            {/* Quick Templates */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-widest">
                <Zap className="w-3.5 h-3.5" />
                <span>Instant Inspiration Templates</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {quickTemplates.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white whitespace-nowrap transition-all"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination & Departure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                  Destination City / Region
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kyoto, Japan or Amalfi Coast"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                  Departure City (Optional)
                </label>
                <input
                  type="text"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  placeholder="e.g. San Francisco or London"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Trip Duration & Travelers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                    Duration: <span className="text-blue-400 font-extrabold">{durationDays} Days</span>
                  </label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                  Adults
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white w-6 text-center">
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                  Children
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-white w-6 text-center">
                    {children}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Budget & Hotel Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                  Budget Style
                </label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value as BudgetTier)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Budget" className="bg-zinc-900 text-white">Smart Budget ($50 - $100/day)</option>
                  <option value="Balanced" className="bg-zinc-900 text-white">Comfort & Style ($150 - $300/day)</option>
                  <option value="Premium Luxury" className="bg-zinc-900 text-white">Premium Luxury ($400 - $800/day)</option>
                  <option value="Ultra High-Net-Worth" className="bg-zinc-900 text-white">Bespoke Ultra Luxury ($1000+/day)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                  Accommodation Standard
                </label>
                <select
                  value={hotelClass}
                  onChange={(e) => setHotelClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Boutique Stay" className="bg-zinc-900 text-white">Boutique Hotel</option>
                  <option value="4-Star Boutique" className="bg-zinc-900 text-white">4-Star Luxury Hotel</option>
                  <option value="5-Star Resort" className="bg-zinc-900 text-white">5-Star Luxury Resort</option>
                  <option value="Traditional Ryokan/Chalet" className="bg-zinc-900 text-white">Traditional Ryokan / Chalet</option>
                  <option value="Unique Villa" className="bg-zinc-900 text-white">Private Villa</option>
                </select>
              </div>
            </div>

            {/* Interests & Activity Priorities */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                Activity Priorities
              </label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        active
                          ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30"
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer submit */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSaveAndDownloadPlace}
                disabled={!destination.trim() || isLoading}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-full border text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md ${
                  saveSuccess
                    ? "bg-emerald-600/30 border-emerald-500/60 text-emerald-300"
                    : "bg-white/10 hover:bg-emerald-600/80 border-white/20 hover:border-emerald-400 text-white"
                }`}
                title="Save this place & automatically download full PDF report"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Report Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                    <Download className="w-3.5 h-3.5" />
                    <span>Save & Download PDF Report</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-extrabold shadow-lg shadow-blue-500/30 hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Master Itinerary
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

