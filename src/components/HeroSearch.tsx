import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Search, Mic, ArrowRight, Play, Compass, MapPin, Bookmark, Download, Check, X } from "lucide-react";
import { UserPreferences, DestinationCardData } from "../types";
import { FEATURED_DESTINATIONS } from "../data/destinations";
import { generatePlaceReportPDF } from "../utils/generatePlaceReportPDF";
import { formatCurrency } from "../data/currencies";

interface HeroSearchProps {
  onQuickPlan: (destination: string) => void;
  onOpenFullPlanner: () => void;
  prefs: UserPreferences;
  onSavePlace?: (dest: DestinationCardData | string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onQuickPlan,
  onOpenFullPlanner,
  prefs,
  onSavePlace,
}) => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<DestinationCardData | { title: string; country: string; tagline: string; avgCostPerDay: number; bestMonths: string } | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveAndDownload = (place: DestinationCardData | string) => {
    const result = generatePlaceReportPDF(place, prefs.currency || "USD", prefs.name || "Explorer");
    if (onSavePlace) {
      onSavePlace(place);
    }
    const destName = typeof place === "string" ? place : place.title;
    setDownloadSuccessMessage(`Report generated & downloaded for ${destName}!`);
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      const clean = query.trim();
      const matched = FEATURED_DESTINATIONS.find(
        (d) =>
          d.title.toLowerCase().includes(clean.toLowerCase()) ||
          clean.toLowerCase().includes(d.title.toLowerCase())
      );
      if (matched) {
        setSelectedPlaceInfo(matched);
      } else {
        const parts = clean.split(",");
        setSelectedPlaceInfo({
          title: parts[0].trim(),
          country: parts[1] ? parts[1].trim() : "International",
          tagline: `Exclusive architectural & cultural intelligence for ${clean}`,
          avgCostPerDay: 200,
          bestMonths: "Seasonal best periods",
        });
      }
    } else {
      onOpenFullPlanner();
    }
  };

  const handleSelectSuggestion = (dest: DestinationCardData) => {
    setQuery(dest.title);
    setShowSuggestions(false);
    setSelectedPlaceInfo(dest);
  };

  const promptChips = [
    { label: "🌸 Kyoto 3-Day Zen", dest: "Kyoto, Japan" },
    { label: "🍋 Amalfi Coast Sunset", dest: "Amalfi Coast, Italy" },
    { label: "⛷️ Swiss Alps Ski", dest: "Zermatt, Switzerland" },
    { label: "🌴 Bali Jungle Villas", dest: "Bali, Indonesia" },
    { label: "🌮 Oaxaca Foodie", dest: "Oaxaca, Mexico" },
    { label: "🗼 Paris Haute Cuisine", dest: "Paris, France" },
  ];

  const handleSelectChip = (chipDest: string) => {
    const matched = FEATURED_DESTINATIONS.find(
      (d) =>
        chipDest.toLowerCase().includes(d.title.toLowerCase()) ||
        d.title.toLowerCase().includes(chipDest.toLowerCase())
    );
    if (matched) {
      setSelectedPlaceInfo(matched);
    } else {
      const parts = chipDest.split(",");
      setSelectedPlaceInfo({
        title: parts[0].trim(),
        country: parts[1] ? parts[1].trim() : "International",
        tagline: `Exclusive curated exploration intelligence for ${chipDest}`,
        avgCostPerDay: 220,
        bestMonths: "Year-Round",
      });
    }
    setQuery(chipDest);
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setQuery("Kyoto, Japan");
      const matched = FEATURED_DESTINATIONS.find((d) => d.title.toLowerCase().includes("kyoto"));
      if (matched) setSelectedPlaceInfo(matched);
      setIsListening(false);
    }, 1800);
  };

  const filteredSuggestions = query.trim()
    ? FEATURED_DESTINATIONS.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.country.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : FEATURED_DESTINATIONS.slice(0, 5);

  return (
    <section className="relative overflow-hidden pt-4 pb-8 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Search Bar Container */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-blue-500" />
              {getTimeGreeting()}, {prefs.name || "Explorer"}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Explore your next soul destination...
            </h1>
          </div>

          {/* Immersive Search Input Bar with Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="relative w-full md:w-auto min-w-[340px] lg:min-w-[440px]">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-xl shadow-inner focus-within:border-blue-500/50 transition-all">
                <Search className="w-4 h-4 text-white/40 mr-3 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search Kyoto, Amalfi, Paris, Tokyo, Bali..."
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSelectedPlaceInfo(null);
                    }}
                    className="p-1 rounded-full text-white/40 hover:text-white mr-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`p-1.5 rounded-full mr-2 transition-all ${
                    isListening ? "text-red-400 animate-pulse" : "text-white/40 hover:text-white"
                  }`}
                  title="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shrink-0 text-white shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
                  title="Search Place"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0d1017]/95 border border-white/15 rounded-3xl p-3 shadow-2xl backdrop-blur-2xl space-y-2 animate-fadeIn max-h-80 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  <span>Suggested Places</span>
                  <span>Click Save for Instant PDF Report</span>
                </div>

                {filteredSuggestions.map((dest) => (
                  <div
                    key={dest.id}
                    className="p-2.5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div
                      onClick={() => handleSelectSuggestion(dest)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <img
                        src={dest.image}
                        alt={dest.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors">
                            {dest.title}
                          </span>
                          <span className="text-[10px] text-white/40">• {dest.country}</span>
                        </div>
                        <p className="text-[10px] text-white/50 truncate">{dest.tagline}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveAndDownload(dest);
                        }}
                        className="px-3 py-1.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-sm active:scale-95"
                        title="Save & Download PDF Report"
                      >
                        <Bookmark className="w-3 h-3" />
                        <span>Save & PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickPlan(`${dest.title}, ${dest.country}`);
                          setShowSuggestions(false);
                        }}
                        className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-all flex items-center gap-1 shadow-sm active:scale-95"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Plan</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Success Alert Banner when PDF downloaded */}
        {downloadSuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-fadeIn backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">{downloadSuccessMessage}</p>
                <p className="text-[11px] text-emerald-300/80">
                  All itinerary details, dining spots, costs, and practical tips saved to your device.
                </p>
              </div>
            </div>
            <button
              onClick={() => setDownloadSuccessMessage(null)}
              className="p-1.5 rounded-full hover:bg-white/10 text-emerald-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Selected Place Intelligence & Instant Save Card */}
        {selectedPlaceInfo && (
          <div className="p-5 sm:p-6 rounded-[28px] bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-purple-950/60 border border-blue-500/30 text-white shadow-2xl backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                  Selected Destination
                </span>
                <span className="text-xs text-white/60">
                  {selectedPlaceInfo.country} • {selectedPlaceInfo.bestMonths}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {selectedPlaceInfo.title}
              </h3>
              <p className="text-xs text-white/70 line-clamp-2">
                {selectedPlaceInfo.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleSaveAndDownload(selectedPlaceInfo as any)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 active:scale-95"
                title="Save Place & Automatically Download PDF Report"
              >
                <Bookmark className="w-3.5 h-3.5 fill-white" />
                <Download className="w-3.5 h-3.5" />
                <span>Save & Download PDF Report</span>
              </button>

              <button
                type="button"
                onClick={() => onQuickPlan(`${selectedPlaceInfo.title}, ${selectedPlaceInfo.country}`)}
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan Trip with AI</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlaceInfo(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Prompt Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 shrink-0 mr-1">
            Trending Prompts:
          </span>
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectChip(chip.dest)}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-all whitespace-nowrap"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Big Hero Card */}
      <div className="relative h-[380px] sm:h-[440px] rounded-[40px] overflow-hidden group shadow-2xl border border-white/10">
        <img
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80"
          alt="Kyoto"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

        <div className="absolute bottom-8 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 text-white">
                  Curated Selection
                </span>
                <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                  Luxury
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white leading-none">
                Kyoto, Japan
              </h1>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-2">
                Seven days of spiritual awakening, zen gardens, and private tea ceremonies in the heart of Gion.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleSaveAndDownload("Kyoto, Japan")}
                className="px-5 py-3 rounded-full bg-white/15 hover:bg-emerald-600/80 backdrop-blur-md border border-white/25 hover:border-emerald-400 text-white font-bold text-xs shadow-xl transition-all flex items-center gap-2 active:scale-95"
                title="Save Kyoto & Auto-Download PDF Report"
              >
                <Bookmark className="w-4 h-4 fill-white" />
                <Download className="w-3.5 h-3.5" />
                <span>Save & PDF Report</span>
              </button>

              <button
                type="button"
                onClick={() => onQuickPlan("Kyoto, Japan")}
                className="h-14 w-14 sm:h-16 sm:w-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform shrink-0"
                title="Generate Kyoto Itinerary"
              >
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-black ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex flex-col justify-between h-32 hover:border-white/20 transition-all">
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Best Time</span>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-white">March — May</span>
              <p className="text-emerald-400 text-xs font-medium mt-0.5">Cherry Blossom Season</p>
            </div>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex flex-col justify-between h-32 hover:border-white/20 transition-all">
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Avg Budget</span>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-white">$4,200</span>
              <p className="text-white/40 text-xs mt-0.5">Estimated / per person</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">
              Balanced
            </span>
          </div>
        </div>

        <div className="bg-blue-600 rounded-3xl p-5 flex flex-col justify-between h-32 relative overflow-hidden shadow-lg shadow-blue-600/30">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Smart AI Suggestion</span>
          <span className="text-base sm:text-lg leading-tight font-semibold text-white">
            Book Shinkansen bullet train tickets 14 days ahead for 20% discount.
          </span>
        </div>
      </div>
    </section>
  );
};
