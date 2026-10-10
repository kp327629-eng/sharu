import React, { useState } from "react";
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Sun,
  Share2,
  Download,
  CheckCircle2,
  AlertCircle,
  Camera,
  Compass,
  Map as MapIcon,
  PieChart,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Edit3,
  MessageSquare,
  Utensils,
  Landmark,
  Luggage,
} from "lucide-react";
import { TripItinerary, DayPlan, ScheduleItem } from "../types";
import { InteractiveMap } from "./InteractiveMap";
import { generatePlaceReportPDF } from "../utils/generatePlaceReportPDF";

interface ItineraryViewProps {
  trip: TripItinerary;
  onOpenAiChat: (initialMsg?: string) => void;
  onSaveTrip: (trip: TripItinerary) => void;
  darkMode?: boolean;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onOpenAiChat,
  onSaveTrip,
  darkMode = true,
}) => {
  const [activeTab, setActiveTab] = useState<
    "timeline" | "map" | "budget" | "packing" | "intelligence" | "gems"
  >("timeline");
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<ScheduleItem | null>(null);
  const [packingItems, setPackingItems] = useState(trip.packingChecklist || []);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true });
  const [copied, setCopied] = useState(false);

  const activeDay = trip.days.find((d) => d.dayNumber === selectedDayNumber) || trip.days[0];

  const toggleDayExpanded = (dayNum: number) => {
    setExpandedDays({ ...expandedDays, [dayNum]: !expandedDays[dayNum] });
  };

  const toggleCheckItem = (index: number) => {
    const updated = [...packingItems];
    updated[index].checked = !updated[index].checked;
    setPackingItems(updated);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    let md = `# ${trip.destination}, ${trip.country} - Master Itinerary\n\n`;
    md += `*${trip.tagline}*\n\n`;
    md += `**Overview:** ${trip.overview}\n\n`;
    md += `**Estimated Budget:** $${trip.estimatedBudget?.totalUSD} total ($${trip.estimatedBudget?.perDayUSD}/day)\n\n`;

    trip.days.forEach((day) => {
      md += `\n### Day ${day.dayNumber}: ${day.title}\n`;
      md += `${day.summary}\n\n`;
      day.schedule.forEach((item) => {
        md += `- **${item.time}** | **${item.title}** ($${item.costUSD})\n  *${item.description}*\n  💡 *Pro Tip:* ${item.proTip}\n\n`;
      });
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${trip.destination.toLowerCase().replace(/\s+/g, "-")}-itinerary.md`;
    link.click();
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Food":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Landmark":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Culture":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Nature":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Hero Banner Header */}
      <div className="relative rounded-[36px] overflow-hidden bg-zinc-900 text-white shadow-2xl border border-white/10">
        {/* Background photo gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url('${
              trip.coverImage ||
              "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80"
            }')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 space-y-6">
          {/* Top badges & share bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                Verified AI Masterpiece
              </span>
              <span className="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-md">
                {trip.days.length} Days Experience
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copied ? "Copied!" : "Share"}
              </button>

              <button
                onClick={() => generatePlaceReportPDF(trip, "USD", "Explorer")}
                className="px-4 py-2 rounded-full bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-200 hover:text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                title="Automatically generate and download complete PDF report"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report (PDF)</span>
              </button>

              <button
                onClick={handleExportMarkdown}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-white/60" />
                <span>Markdown</span>
              </button>

              <button
                onClick={() => {
                  onSaveTrip(trip);
                  generatePlaceReportPDF(trip, "USD", "Explorer");
                }}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95"
                title="Save trip to library and auto-download report PDF"
              >
                <Bookmark className="w-3.5 h-3.5 fill-white" />
                <span>Save & Download PDF</span>
              </button>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{trip.country}</span>
            </div>
            <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-white">
              {trip.destination}
            </h1>
            <p className="text-sm sm:text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
              {trip.tagline || trip.overview}
            </p>
          </div>

          {/* Summary Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Estimated Budget</p>
              <p className="text-xl font-black text-white mt-0.5">
                ${trip.estimatedBudget?.totalUSD || 1200}
              </p>
              <p className="text-[10px] text-blue-400 font-semibold mt-0.5">
                ~${trip.estimatedBudget?.perDayUSD || 300}/day
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Weather Forecast</p>
              <p className="text-xl font-black text-white mt-0.5">
                {trip.weatherForecast?.avgTemp || "22°C"}
              </p>
              <p className="text-[10px] text-amber-400 font-semibold truncate mt-0.5">
                {trip.weatherForecast?.condition || "Sunny"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Instagram Spots</p>
              <p className="text-xl font-black text-white mt-0.5">
                {trip.instagramSpots?.length || 4} Locations
              </p>
              <p className="text-[10px] text-purple-400 font-semibold mt-0.5">Golden hour timed</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Hidden Gems</p>
              <p className="text-xl font-black text-white mt-0.5">
                {trip.hiddenGems?.length || 3} Uncovered
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Curated by AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/10">
        <button
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === "timeline"
              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30"
              : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10"
          }`}
        >
          <Clock className="w-4 h-4" />
          Day-by-Day Timeline
        </button>

        <button
          onClick={() => setActiveTab("map")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === "map"
              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30"
              : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10"
          }`}
        >
          <MapIcon className="w-4 h-4" />
          Interactive Map
        </button>

        <button
          onClick={() => setActiveTab("budget")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === "budget"
              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30"
              : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10"
          }`}
        >
          <PieChart className="w-4 h-4" />
          Budget & Breakdown
        </button>

        <button
          onClick={() => setActiveTab("packing")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === "packing"
              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30"
              : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10"
          }`}
        >
          <Luggage className="w-4 h-4" />
          Packing List
        </button>

        <button
          onClick={() => setActiveTab("intelligence")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === "intelligence"
              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30"
              : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Visa & Safety Guide
        </button>

        <button
          onClick={() => setActiveTab("gems")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
            activeTab === "gems"
              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30"
              : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border-white/10"
          }`}
        >
          <Camera className="w-4 h-4" />
          Photo Spots & Secrets
        </button>
      </div>

      {/* TAB 1: Day-by-Day Timeline */}
      {activeTab === "timeline" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline Schedule Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Detailed Itinerary Schedule
              </h2>
              <button
                onClick={() =>
                  onOpenAiChat(`How can I adjust my ${trip.destination} itinerary to fit more local food?`)
                }
                className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Ask AI Concierge to Customize
              </button>
            </div>

            {trip.days.map((day) => {
              const isExpanded = expandedDays[day.dayNumber] !== false;
              return (
                <div
                  key={day.dayNumber}
                  className="bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden transition-all"
                >
                  {/* Day Accordion Header */}
                  <div
                    onClick={() => toggleDayExpanded(day.dayNumber)}
                    className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-blue-600/30">
                        D{day.dayNumber}
                      </span>
                      <div>
                        <h3 className="font-bold text-base text-white">
                          {day.title}
                        </h3>
                        <p className="text-xs text-white/50 line-clamp-1">
                          {day.summary}
                        </p>
                      </div>
                    </div>
                    <button className="text-white/40 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Day Schedule Items */}
                  {isExpanded && (
                    <div className="p-6 space-y-4">
                      {day.schedule.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedDayNumber(day.dayNumber);
                            setSelectedScheduleItem(item);
                          }}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                            selectedScheduleItem?.title === item.title
                              ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20"
                              : "bg-white/5 border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {item.time}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                                  item.category
                                )}`}
                              >
                                {item.category}
                              </span>
                            </div>

                            <span className="text-xs font-bold text-white/80">
                              ~${item.costUSD}
                            </span>
                          </div>

                          <h4 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-white/70 mt-1 leading-relaxed">
                            {item.description}
                          </p>

                          {item.proTip && (
                            <div className="mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                              <span>
                                <strong>Insider Tip:</strong> {item.proTip}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Map Widget Preview */}
          <div className="space-y-6">
            <div className="sticky top-24 bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-blue-400" />
                  Day {selectedDayNumber} Route Map
                </h3>

                <div className="flex gap-1">
                  {trip.days.map((d) => (
                    <button
                      key={d.dayNumber}
                      onClick={() => setSelectedDayNumber(d.dayNumber)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        selectedDayNumber === d.dayNumber
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-white/5 text-white/60 hover:text-white"
                      }`}
                    >
                      D{d.dayNumber}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaflet Map Frame */}
              <div className="h-80 w-full rounded-2xl overflow-hidden border border-white/10">
                <InteractiveMap
                  scheduleItems={activeDay.schedule}
                  selectedItem={selectedScheduleItem}
                  onSelectItem={(item) => setSelectedScheduleItem(item)}
                  darkMode={true}
                />
              </div>

              {selectedScheduleItem ? (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
                  <p className="font-bold text-white">
                    {selectedScheduleItem.title}
                  </p>
                  <p className="text-white/50">
                    📍 {selectedScheduleItem.address}
                  </p>
                  <p className="text-blue-400 font-semibold">
                    ⏱️ {selectedScheduleItem.duration} • ${selectedScheduleItem.costUSD}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-white/40 text-center">
                  Click any marker or schedule item to inspect location details.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Full Map View */}
      {activeTab === "map" && (
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Full Destination Route Overview
              </h2>
              <p className="text-xs text-white/50">
                Displaying all stops across all {trip.days.length} days of your trip.
              </p>
            </div>

            <div className="flex gap-2">
              {trip.days.map((d) => (
                <button
                  key={d.dayNumber}
                  onClick={() => setSelectedDayNumber(d.dayNumber)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedDayNumber === d.dayNumber
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-white/5 text-white/60 hover:text-white"
                  }`}
                >
                  Day {d.dayNumber}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[550px] w-full rounded-2xl overflow-hidden border border-white/10">
            <InteractiveMap
              scheduleItems={activeDay.schedule}
              selectedItem={selectedScheduleItem}
              onSelectItem={(item) => setSelectedScheduleItem(item)}
              darkMode={true}
            />
          </div>
        </div>
      )}

      {/* TAB 3: Budget Breakdown */}
      {activeTab === "budget" && (
        <div className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Financial Architecture & Allocation
              </h2>
              <p className="text-xs text-white/50">
                Comprehensive cost analysis generated by VoyageAI.
              </p>
            </div>
            <div className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm border border-blue-500/30">
              Total Estimated: ${trip.estimatedBudget?.totalUSD}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white">
                Category Breakdown
              </h3>
              {trip.estimatedBudget?.breakdown?.map((item, idx) => {
                const percentage = Math.round(
                  (item.amountUSD / (trip.estimatedBudget?.totalUSD || 1)) * 100
                );
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-white">
                      <span>{item.category}</span>
                      <span>
                        ${item.amountUSD} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 rounded-[28px] bg-white/5 border border-white/10 space-y-4">
              <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Smart Budgeting Tips
              </h3>
              <ul className="space-y-3 text-xs text-white/70">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Transit Hack:</strong> Buying a multi-day subway pass saves up to 35% on
                    local transit costs compared to single tickets.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dining Efficiency:</strong> High-end restaurants often offer lunch tasting
                    menus at 50% less than evening dinner rates.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fee Prevention:</strong> Use zero-foreign-transaction-fee credit cards for
                    all contactless payments.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Packing Checklist */}
      {activeTab === "packing" && (
        <div className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Destination Smart Packing Station
              </h2>
              <p className="text-xs text-white/50">
                Optimized for {trip.destination}'s climate: {trip.weatherForecast?.avgTemp},{" "}
                {trip.weatherForecast?.condition}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packingItems.map((p, idx) => (
              <div
                key={idx}
                onClick={() => toggleCheckItem(idx)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  p.checked
                    ? "bg-emerald-500/10 border-emerald-500/40 line-through opacity-70"
                    : "bg-white/5 border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      p.checked
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-white/20"
                    }`}
                  >
                    {p.checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">{p.item}</p>
                    <span className="text-[10px] text-white/50">{p.category}</span>
                  </div>
                </div>

                {p.essential && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    Essential
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Intelligence & Visa */}
      {activeTab === "intelligence" && (
        <div className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-white/10 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold text-white">
            Destination Travel Intelligence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-bold text-sm text-blue-400">
                🛂 Visa & Entry Protocol
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {trip.essentialInfo?.visa || "Standard tourist passport entry allowed up to 90 days."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-bold text-sm text-blue-400">
                💶 Local Currency & Payments
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {trip.essentialInfo?.currency || "Card payments widely accepted everywhere."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-bold text-sm text-blue-400">
                🗣️ Language & Cultural Etiquette
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                {trip.essentialInfo?.language || "English is widely spoken."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-bold text-sm text-red-400">
                🚨 Emergency Contacts
              </h3>
              <p className="text-xs font-mono text-white/80">
                {trip.essentialInfo?.emergencyNumbers || "Police: 110, Ambulance: 119"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Instagram Spots & Hidden Gems */}
      {activeTab === "gems" && (
        <div className="space-y-8">
          {/* Instagram Spots */}
          <div className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-white/10 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-400" />
              Golden Hour Instagram Spots
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trip.instagramSpots?.map((spot, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white">
                      {spot.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {spot.bestTime}
                    </span>
                  </div>
                  <p className="text-xs text-white/70">
                    📸 <strong>Photography Angle:</strong> {spot.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Gems */}
          <div className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-white/10 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Curated Local Hidden Gems
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trip.hiddenGems?.map((gem, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2"
                >
                  <h3 className="font-bold text-sm text-white">{gem.name}</h3>
                  <p className="text-xs text-white/70">{gem.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
