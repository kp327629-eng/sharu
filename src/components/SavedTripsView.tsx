import React, { useState } from "react";
import { TripItinerary } from "../types";
import { Bookmark, MapPin, Calendar, Trash2, ArrowRight, Download, WifiOff, Sparkles } from "lucide-react";
import { generatePlaceReportPDF } from "../utils/generatePlaceReportPDF";

interface SavedTripsViewProps {
  savedTrips: TripItinerary[];
  onSelectTrip: (trip: TripItinerary) => void;
  onDeleteTrip: (tripId: string) => void;
  onOpenPlanner: () => void;
}

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
  onOpenPlanner,
}) => {
  const [offlineCached, setOfflineCached] = useState<Record<string, boolean>>({});

  const toggleOfflineCache = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOfflineCached((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Bookmark className="w-4 h-4 text-blue-500 fill-blue-500" />
            Your Private Travel Vault
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Saved Trips & Offline Guides
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Access your AI master itineraries anytime, even in remote offline zones.
          </p>
        </div>

        <button
          onClick={onOpenPlanner}
          className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          Create New Itinerary
        </button>
      </div>

      {savedTrips.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl shadow-2xl space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">
            No saved itineraries yet
          </h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Use VoyageAI to generate day-by-day travel plans for any destination worldwide.
          </p>
          <button
            onClick={onOpenPlanner}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            Generate First Itinerary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className="group cursor-pointer rounded-[32px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Cover Banner */}
              <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={
                    trip.coverImage ||
                    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={trip.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => toggleOfflineCache(trip.id, e)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border transition-all flex items-center gap-1 ${
                      offlineCached[trip.id]
                        ? "bg-emerald-500 text-white border-emerald-400"
                        : "bg-black/50 text-white border-white/20 hover:bg-black/70"
                    }`}
                  >
                    <WifiOff className="w-3 h-3" />
                    {offlineCached[trip.id] ? "Offline Saved" : "Save Offline"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generatePlaceReportPDF(trip, "USD", "Explorer");
                    }}
                    className="p-1.5 rounded-full bg-black/50 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 transition-all"
                    title="Download Place Report in PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTrip(trip.id);
                    }}
                    className="p-1.5 rounded-full bg-black/50 text-white hover:bg-red-500 backdrop-blur-md border border-white/20 transition-all"
                    title="Delete Trip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-5 right-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">{trip.country}</span>
                  <h3 className="text-2xl font-black text-white">{trip.destination}</h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                  {trip.overview}
                </p>

                <div className="flex items-center justify-between text-xs text-white/50 pt-4 border-t border-white/10">
                  <span>📅 {trip.days.length} Days</span>
                  <span className="font-extrabold text-white">
                    ${trip.estimatedBudget?.totalUSD} Est.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generatePlaceReportPDF(trip, "USD", "Explorer");
                    }}
                    className="py-2.5 px-3 rounded-full bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                    title="Generate and download complete PDF report"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="py-2.5 px-3 rounded-full bg-white/10 hover:bg-blue-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Open Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
