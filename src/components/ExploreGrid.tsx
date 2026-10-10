import React, { useState } from "react";
import { FEATURED_DESTINATIONS } from "../data/destinations";
import { DestinationCardData, UserPreferences } from "../types";
import { Sparkles, Star, MapPin, Search, Calendar, DollarSign, Compass, ArrowUpRight, Bookmark, Download, Check } from "lucide-react";
import { formatCurrency } from "../data/currencies";
import { generatePlaceReportPDF } from "../utils/generatePlaceReportPDF";

interface ExploreGridProps {
  onSelectDestination: (destName: string) => void;
  prefs?: UserPreferences;
  onSavePlace?: (dest: DestinationCardData) => void;
}

export const ExploreGrid: React.FC<ExploreGridProps> = ({ onSelectDestination, prefs, onSavePlace }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedDestinationIds, setSavedDestinationIds] = useState<Record<string, boolean>>({});

  const regions = ["All", "Trending", "Asia", "Europe", "Americas", "Africa & ME"];

  const handleSaveAndDownload = (dest: DestinationCardData) => {
    generatePlaceReportPDF(dest, prefs?.currency || "USD", prefs?.name || "Explorer");
    if (onSavePlace) {
      onSavePlace(dest);
    }
    setSavedDestinationIds((prev) => ({ ...prev, [dest.id]: true }));
  };

  const filtered = FEATURED_DESTINATIONS.filter((item) => {
    const matchesRegion =
      selectedRegion === "All"
        ? true
        : selectedRegion === "Trending"
        ? item.isTrending
        : item.region === selectedRegion;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRegion && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Title & Search controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Compass className="w-4 h-4 text-blue-500" />
            Curated Global Catalog
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Handcrafted AI Destinations
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Selected by luxury curators & algorithmic travel pattern analytics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Tokyo, Amalfi, Zen..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 backdrop-blur-md transition-all"
          />
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/10">
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              selectedRegion === reg
                ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10"
            }`}
          >
            {reg === "Trending" ? "🔥 Trending" : reg}
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dest) => (
          <div
            key={dest.id}
            className="group relative rounded-[32px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col"
          >
            {/* Image Box */}
            <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
              <img
                src={dest.image}
                alt={dest.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />

              {/* Rating badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{dest.rating}</span>
                <span className="text-white/40 font-normal">({(dest.reviewsCount / 1000).toFixed(1)}k)</span>
              </div>

              {/* Save & Download PDF Quick Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveAndDownload(dest);
                }}
                className={`absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-lg active:scale-95 ${
                  savedDestinationIds[dest.id]
                    ? "bg-emerald-600 text-white border-emerald-400"
                    : "bg-black/60 hover:bg-black/80 text-white border-white/20 hover:border-white/40"
                }`}
                title="Save Place & Auto-Download PDF Report"
              >
                {savedDestinationIds[dest.id] ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span className="text-[10px] font-bold">Saved & PDF</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-white/90" />
                    <span className="text-[10px] font-bold">Save</span>
                  </>
                )}
              </button>

              {/* Location title overlay */}
              <div className="absolute bottom-4 left-5 right-5 space-y-0.5">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold tracking-wide">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{dest.country}</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">{dest.title}</h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <p className="text-xs text-white/70 leading-relaxed line-clamp-2">
                {dest.tagline}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {dest.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-semibold text-white/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Pricing & Season */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Avg Cost / Day</p>
                  <p className="font-extrabold text-white text-sm">
                    {formatCurrency(dest.avgCostPerDay, prefs?.currency || "USD")}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Best Season</p>
                  <p className="font-bold text-blue-400">{dest.bestMonths}</p>
                </div>
              </div>

              {/* Action Buttons: Save & PDF Report + Plan with AI */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleSaveAndDownload(dest)}
                  className={`py-2.5 px-3 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 border ${
                    savedDestinationIds[dest.id]
                      ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
                      : "bg-white/10 hover:bg-white/20 border-white/10 text-white"
                  }`}
                  title="Save place & auto-download report in PDF format"
                >
                  {savedDestinationIds[dest.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">Saved & PDF</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">Save & PDF</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectDestination(`${dest.title}, ${dest.country}`)}
                  className="py-2.5 px-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95 truncate"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Plan with AI</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
