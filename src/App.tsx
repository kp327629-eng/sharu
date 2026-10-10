import React, { useState, useEffect } from "react";
import { UserPreferences, TripItinerary, DestinationCardData } from "./types";
import { Navbar } from "./components/Navbar";
import { HeroSearch } from "./components/HeroSearch";
import { ExploreGrid } from "./components/ExploreGrid";
import { ItineraryView } from "./components/ItineraryView";
import { SavedTripsView } from "./components/SavedTripsView";
import { BudgetTrackerView } from "./components/BudgetTrackerView";
import { WeatherPackingView } from "./components/WeatherPackingView";
import { BookingAndDiscoveryView } from "./components/BookingAndDiscoveryView";
import { OnboardingModal } from "./components/OnboardingModal";
import { TripPlannerModal } from "./components/TripPlannerModal";
import { AiConciergeDrawer } from "./components/AiConciergeDrawer";
import { AuthModal } from "./components/AuthModal";
import { SettingsModal } from "./components/SettingsModal";
import { Sparkles, Bot, ArrowRight, Bookmark, Compass, MapPin, Download, Check, X } from "lucide-react";
import { generatePlaceReportPDF, createTripItineraryFromPlace } from "./utils/generatePlaceReportPDF";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("aetheria_dark_mode");
    return saved ? JSON.parse(saved) : true;
  });

  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem("aetheria_user_prefs");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Alex",
          travelStyle: "Explorer",
          budgetTier: "Balanced",
          currency: "USD",
          language: "English",
          country: "USA",
          foodPreference: "Local Specialties & Everything",
          travelFrequency: "Frequent",
          dreamDestinations: ["Kyoto, Japan", "Amalfi Coast, Italy"],
          accessibility: false,
          interests: ["Landmarks", "Food", "Culture"],
          isOnboarded: false,
        };
  });

  const [currentView, setCurrentView] = useState<
    "home" | "explore" | "saved" | "budget" | "weather" | "itinerary" | "booking"
  >("home");

  const [savedTrips, setSavedTrips] = useState<TripItinerary[]>(() => {
    const saved = localStorage.getItem("aetheria_saved_trips");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTrip, setActiveTrip] = useState<TripItinerary | null>(() => {
    const saved = localStorage.getItem("aetheria_active_trip");
    return saved ? JSON.parse(saved) : null;
  });

  // Modal controls
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [plannerDestination, setPlannerDestination] = useState("");
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Download & Save confirmation toast
  const [downloadToast, setDownloadToast] = useState<{
    show: boolean;
    destination: string;
    filename: string;
  } | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("aetheria_dark_mode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Sync user preferences
  const handleSavePreferences = (newPrefs: UserPreferences) => {
    setPrefs(newPrefs);
    localStorage.setItem("aetheria_user_prefs", JSON.stringify(newPrefs));
  };

  // Sync active trip
  const handleTripGenerated = (trip: TripItinerary) => {
    setActiveTrip(trip);
    localStorage.setItem("aetheria_active_trip", JSON.stringify(trip));

    // Also add to saved library
    const updatedSaved = [trip, ...savedTrips.filter((t) => t.id !== trip.id)];
    setSavedTrips(updatedSaved);
    localStorage.setItem("aetheria_saved_trips", JSON.stringify(updatedSaved));

    setCurrentView("itinerary");
  };

  const handleSaveTrip = (trip: TripItinerary) => {
    const updated = [trip, ...savedTrips.filter((t) => t.id !== trip.id)];
    setSavedTrips(updated);
    localStorage.setItem("aetheria_saved_trips", JSON.stringify(updated));
  };

  // Global handler: Automatic Place Report Generation & Download in PDF
  const handleSavePlaceAndDownload = (place: TripItinerary | DestinationCardData | string) => {
    // 1. Generate and automatically trigger download of comprehensive PDF report
    const result = generatePlaceReportPDF(place, prefs.currency || "USD", prefs.name || "Explorer");

    // 2. Persist to saved vault
    if (typeof place === "object" && "days" in place) {
      handleSaveTrip(place as TripItinerary);
    } else {
      const newItinerary = createTripItineraryFromPlace(place);
      const updated = [
        newItinerary,
        ...savedTrips.filter((t) => t.destination.toLowerCase() !== newItinerary.destination.toLowerCase()),
      ];
      setSavedTrips(updated);
      localStorage.setItem("aetheria_saved_trips", JSON.stringify(updated));
    }

    // 3. Show floating confirmation toast
    setDownloadToast({
      show: true,
      destination: result.destination,
      filename: result.filename,
    });
    setTimeout(() => {
      setDownloadToast(null);
    }, 5000);
  };

  const handleDeleteTrip = (tripId: string) => {
    const updated = savedTrips.filter((t) => t.id !== tripId);
    setSavedTrips(updated);
    localStorage.setItem("aetheria_saved_trips", JSON.stringify(updated));

    if (activeTrip?.id === tripId) {
      setActiveTrip(updated[0] || null);
    }
  };

  const handleQuickPlan = (destinationName: string) => {
    setPlannerDestination(destinationName);
    setIsPlannerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans transition-colors duration-300 pb-20 md:pb-8 flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenPlanner={() => {
            setPlannerDestination("");
            setIsPlannerOpen(true);
          }}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          prefs={prefs}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          hasActiveItinerary={Boolean(activeTrip)}
        />

        {/* VIEW 1: HOME */}
        {currentView === "home" && (
          <main className="space-y-10">
            {/* Hero Search Section */}
            <HeroSearch
              onQuickPlan={handleQuickPlan}
              onOpenFullPlanner={() => {
                setPlannerDestination("");
                setIsPlannerOpen(true);
              }}
              prefs={prefs}
              onSavePlace={handleSavePlaceAndDownload}
            />

            {/* Continue Active Trip Banner if available */}
            {activeTrip && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6">
                <div
                  onClick={() => setCurrentView("itinerary")}
                  className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-white/10 text-white shadow-2xl hover:border-white/20 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group backdrop-blur-2xl"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
                      Active Trip Draft
                    </span>
                    <h3 className="text-xl sm:text-3xl font-black">
                      Continue Planning: {activeTrip.destination}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-1">{activeTrip.tagline}</p>
                  </div>

                  <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-bold shrink-0 text-white shadow-lg shadow-blue-600/30 transition-all">
                    <span>View Itinerary</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </section>
            )}

            {/* Featured Destinations Catalog */}
            <ExploreGrid
              onSelectDestination={handleQuickPlan}
              prefs={prefs}
              onSavePlace={handleSavePlaceAndDownload}
            />
          </main>
        )}

        {/* VIEW 2: EXPLORE */}
        {currentView === "explore" && (
          <main>
            <ExploreGrid
              onSelectDestination={handleQuickPlan}
              prefs={prefs}
              onSavePlace={handleSavePlaceAndDownload}
            />
          </main>
        )}

        {/* VIEW 3: ACTIVE ITINERARY */}
        {currentView === "itinerary" && activeTrip && (
          <main>
            <ItineraryView
              trip={activeTrip}
              onOpenAiChat={() => setIsAiChatOpen(true)}
              onSaveTrip={handleSaveTrip}
              darkMode={darkMode}
            />
          </main>
        )}

        {/* VIEW 4: SAVED TRIPS */}
        {currentView === "saved" && (
          <main>
            <SavedTripsView
              savedTrips={savedTrips}
              onSelectTrip={(trip) => {
                setActiveTrip(trip);
                setCurrentView("itinerary");
              }}
              onDeleteTrip={handleDeleteTrip}
              onOpenPlanner={() => {
                setPlannerDestination("");
                setIsPlannerOpen(true);
              }}
            />
          </main>
        )}

        {/* VIEW 5: BUDGET */}
        {currentView === "budget" && (
          <main>
            <BudgetTrackerView prefs={prefs} />
          </main>
        )}

        {/* VIEW 6: WEATHER */}
        {currentView === "weather" && (
          <main>
            <WeatherPackingView />
          </main>
        )}

        {/* VIEW 7: BOOKING & FLIGHTS */}
        {currentView === "booking" && (
          <main>
            <BookingAndDiscoveryView
              prefs={prefs}
              onOpenPlanner={() => {
                setPlannerDestination("");
                setIsPlannerOpen(true);
              }}
            />
          </main>
        )}
      </div>

      {/* Floating AI Concierge Action Trigger */}
      <button
        onClick={() => setIsAiChatOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group"
      >
        <div className="relative">
          <Bot className="w-5 h-5 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-zinc-900" />
        </div>
        <span className="text-xs font-bold hidden sm:inline">AI Concierge</span>
      </button>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-black/5 dark:border-white/5 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <p>Aetheria AI Travel Experience • Inspired by Apple × Airbnb × Google Maps × ChatGPT</p>
      </footer>

      {/* Modals & Drawers */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSavePreferences={handleSavePreferences}
        initialPrefs={prefs}
      />

      <TripPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        onTripGenerated={handleTripGenerated}
        initialDestination={plannerDestination}
        prefs={prefs}
        onSavePlace={handleSavePlaceAndDownload}
      />

      <AiConciergeDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        activeTrip={activeTrip}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(name) => {
          handleSavePreferences({ ...prefs, name });
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        prefs={prefs}
        onSavePrefs={handleSavePreferences}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Floating Toast Notification when Place Report PDF is Generated & Downloaded */}
      {downloadToast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-md p-4 rounded-3xl bg-[#090e17]/95 border border-emerald-500/50 shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-3 text-white animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="font-extrabold text-xs text-white flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Place Report Downloaded (PDF)
              </p>
              <p className="text-[11px] text-emerald-300 font-mono truncate max-w-[210px]">
                {downloadToast.filename}
              </p>
              <p className="text-[10px] text-white/50">
                All itinerary details, dining & tips saved to offline vault.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setCurrentView("saved");
                setDownloadToast(null);
              }}
              className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white shadow-md transition-all active:scale-95"
            >
              Open Vault
            </button>
            <button
              onClick={() => setDownloadToast(null)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
