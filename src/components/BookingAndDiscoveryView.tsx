import React, { useState } from "react";
import {
  Plane,
  Building2,
  Utensils,
  Navigation,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  DollarSign,
  Star,
  MapPin,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Luggage,
  Coffee,
  Check,
  Zap,
  ChevronRight,
  X,
  Compass,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_FLIGHTS, SAMPLE_HOTELS, SAMPLE_RESTAURANTS, SAMPLE_TRANSPORTS } from "../data/bookingData";
import { FlightOffer, HotelOffer, RestaurantSpot, TransportOption, UserPreferences } from "../types";

interface BookingAndDiscoveryViewProps {
  prefs: UserPreferences;
  onOpenPlanner: () => void;
}

export const BookingAndDiscoveryView: React.FC<BookingAndDiscoveryViewProps> = ({
  prefs,
  onOpenPlanner,
}) => {
  const [activeTab, setActiveTab] = useState<"flights" | "hotels" | "restaurants" | "transport">("flights");

  // Flight states
  const [flightOrigin, setFlightOrigin] = useState("SFO");
  const [flightDest, setFlightDest] = useState("Tokyo (NRT)");
  const [cabinFilter, setCabinFilter] = useState("All");
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);

  // Hotel states
  const [hotelQuery, setHotelQuery] = useState("");
  const [selectedHotelCategory, setSelectedHotelCategory] = useState("All");
  const [selectedHotel, setSelectedHotel] = useState<HotelOffer | null>(null);

  // Restaurant states
  const [dietaryFilter, setDietaryFilter] = useState("All");
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantSpot | null>(null);

  // Booking Confirmation Modal
  const [bookingSuccessModal, setBookingSuccessModal] = useState<{
    title: string;
    details: string;
    price: string;
  } | null>(null);

  const filteredFlights = SAMPLE_FLIGHTS.filter((f) => {
    if (cabinFilter !== "All" && f.cabinClass !== cabinFilter) return false;
    return true;
  });

  const filteredHotels = SAMPLE_HOTELS.filter((h) => {
    if (selectedHotelCategory !== "All" && h.category !== selectedHotelCategory) return false;
    if (hotelQuery && !h.name.toLowerCase().includes(hotelQuery.toLowerCase()) && !h.location.toLowerCase().includes(hotelQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredRestaurants = SAMPLE_RESTAURANTS.filter((r) => {
    if (dietaryFilter !== "All") {
      if (dietaryFilter === "Vegetarian" && !r.dietaryTags.some((t) => t.includes("Vegetarian"))) return false;
      if (dietaryFilter === "Vegan" && !r.dietaryTags.some((t) => t.includes("Vegan"))) return false;
      if (dietaryFilter === "Halal" && !r.dietaryTags.some((t) => t.includes("Halal"))) return false;
      if (dietaryFilter === "Jain" && !r.dietaryTags.some((t) => t.includes("Jain"))) return false;
    }
    return true;
  });

  const handleBookFlight = (flight: FlightOffer) => {
    setBookingSuccessModal({
      title: `Flight Confirmed: ${flight.airline} (${flight.flightNumber})`,
      details: `${flight.origin} ➔ ${flight.destination} • ${flight.departureTime} • ${flight.cabinClass}`,
      price: `$${flight.priceUSD}`,
    });
  };

  const handleReserveHotel = (hotel: HotelOffer) => {
    setBookingSuccessModal({
      title: `Reservation Confirmed: ${hotel.name}`,
      details: `${hotel.location} • ${hotel.category} • Free cancellation included`,
      price: `$${hotel.pricePerNightUSD}/night`,
    });
  };

  const handleBookTable = (restaurant: RestaurantSpot) => {
    setBookingSuccessModal({
      title: `Table Reserved: ${restaurant.name}`,
      details: `Table for 2 • ${restaurant.location} • ${restaurant.mustTryDish}`,
      price: `Avg $${restaurant.avgCostUSD}/person`,
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Zap className="w-4 h-4 text-blue-500" />
            Live Global Booking Engine & Smart Routes
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Flights, Hotels & Dining
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            AI-monitored price drops, instant confirmations, and real-time transit routing.
          </p>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex items-center p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab("flights")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "flights"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Flights</span>
          </button>

          <button
            onClick={() => setActiveTab("hotels")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "hotels"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hotels</span>
          </button>

          <button
            onClick={() => setActiveTab("restaurants")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "restaurants"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Dining</span>
          </button>

          <button
            onClick={() => setActiveTab("transport")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === "transport"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Routes</span>
          </button>
        </div>
      </div>

      {/* ======================= FLIGHTS TAB ======================= */}
      {activeTab === "flights" && (
        <div className="space-y-6 animate-fadeIn">
          {/* AI Price Prediction Card */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30 backdrop-blur-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase">
                    AI Price Alert: Optimal Window
                  </span>
                  <span className="text-xs text-white/50">• Confidence: 96%</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Flight prices for Tokyo are expected to rise +18% over the next 4 days
                </h4>
                <p className="text-xs text-white/70">
                  Current average: $890. AI recommends booking before Thursday for max savings.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPlanner}
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all shrink-0 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Build Trip Around Flight
            </button>
          </div>

          {/* Cabin Class Filters */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {["All", "Economy", "Premium Economy", "Business"].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setCabinFilter(cls)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    cabinFilter === cls
                      ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30"
                      : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
            <span className="text-xs text-white/40">Showing {filteredFlights.length} real-time fares</span>
          </div>

          {/* Flight Offer List */}
          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <div
                key={flight.id}
                className="p-5 sm:p-6 rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Airline & Route */}
                <div className="flex items-center gap-4">
                  <img
                    src={flight.logo}
                    alt={flight.airline}
                    className="w-12 h-12 rounded-2xl object-cover bg-zinc-800 border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-base">{flight.airline}</h4>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono font-bold text-white/70">
                        {flight.flightNumber}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">
                      {flight.cabinClass} • {flight.duration} ({flight.stops === 0 ? "Nonstop" : `${flight.stops} stop`})
                    </p>
                  </div>
                </div>

                {/* Timing Bar */}
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-lg font-black text-white">{flight.departureTime}</p>
                    <p className="text-xs font-bold text-blue-400">{flight.origin}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-white/40 font-mono">{flight.duration}</span>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 relative my-1">
                      <Plane className="w-3.5 h-3.5 text-blue-400 absolute -top-1.5 left-1/2 -translate-x-1/2 rotate-90" />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {flight.stops === 0 ? "Direct Flight" : "Via " + flight.stopLocation}
                    </span>
                  </div>

                  <div>
                    <p className="text-lg font-black text-white">{flight.arrivalTime}</p>
                    <p className="text-xs font-bold text-blue-400">{flight.destination}</p>
                  </div>
                </div>

                {/* Pricing & Booking */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold justify-start md:justify-end">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{flight.aiScore}% Match</span>
                    </div>
                    <p className="text-2xl font-black text-white">${flight.priceUSD}</p>
                    <p className="text-[10px] text-white/40">Includes taxes & fees</p>
                  </div>

                  <button
                    onClick={() => handleBookFlight(flight)}
                    className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all shrink-0 active:scale-95"
                  >
                    Select Fare
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= HOTELS TAB ======================= */}
      {activeTab === "hotels" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {["All", "5-Star Resort", "Luxury Hotel", "Ryokan", "Boutique", "Private Villa"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedHotelCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                    selectedHotelCategory === cat
                      ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30"
                      : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
              <input
                type="text"
                value={hotelQuery}
                onChange={(e) => setHotelQuery(e.target.value)}
                placeholder="Search resort, Kyoto..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Hotel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group rounded-[32px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-64 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                  {hotel.featuredTag && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-600/40">
                      {hotel.featuredTag}
                    </div>
                  )}

                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.rating}</span>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 space-y-1">
                    <p className="text-xs text-blue-400 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {hotel.location}
                    </p>
                    <h3 className="text-xl font-black text-white">{hotel.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <p className="text-xs text-white/50">{hotel.distanceToCenter}</p>

                    {/* Amenities pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {hotel.amenities.map((am, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-semibold text-white/70"
                        >
                          ✓ {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-400">{hotel.aiMatchScore}% AI Preference Match</p>
                      <p className="text-2xl font-black text-white">
                        ${hotel.pricePerNightUSD} <span className="text-xs font-normal text-white/40">/ night</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleReserveHotel(hotel)}
                      className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                    >
                      Reserve Stay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= RESTAURANTS TAB ======================= */}
      {activeTab === "restaurants" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Dietary Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest shrink-0 mr-1">
              Dietary Preference:
            </span>
            {["All", "Vegetarian", "Vegan", "Halal", "Jain"].map((dt) => (
              <button
                key={dt}
                onClick={() => setDietaryFilter(dt)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  dietaryFilter === dt
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {dt}
              </button>
            ))}
          </div>

          {/* Restaurant List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRestaurants.map((rst) => (
              <div
                key={rst.id}
                className="rounded-[32px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                  <img src={rst.image} alt={rst.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                  {rst.michelinStars && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider shadow-lg">
                      ⭐ {rst.michelinStars}-Star Michelin
                    </div>
                  )}

                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                    ★ {rst.rating}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">{rst.cuisine}</span>
                      <span className="text-xs font-bold text-white/50">{rst.priceRange}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white">{rst.name}</h3>
                    <p className="text-xs text-white/60">{rst.location}</p>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/80">
                      <span className="text-blue-400 font-bold">Must-Try: </span>
                      {rst.mustTryDish}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-bold">Live Status</p>
                      <p
                        className={`text-xs font-bold ${
                          rst.busyStatus === "Quiet"
                            ? "text-emerald-400"
                            : rst.busyStatus === "Moderate"
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        ● {rst.busyStatus} now
                      </p>
                    </div>

                    <button
                      onClick={() => handleBookTable(rst)}
                      className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                    >
                      Book Table
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================= TRANSPORT TAB ======================= */}
      {activeTab === "transport" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white">Smart Multimodal Route Optimizer</h3>
                <p className="text-xs text-white/50">AI balances travel speed, cost, and carbon footprint</p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                🌱 Eco-Route Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_TRANSPORTS.map((tr) => (
                <div
                  key={tr.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{tr.type}</span>
                    <span className="text-xs font-bold text-emerald-400">-{tr.co2SavingsKg}kg CO₂</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-white">{tr.provider}</h4>
                    <p className="text-xs text-white/60 mt-1">{tr.details}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase">Est. Time</p>
                      <p className="font-bold text-white">{tr.estTimeMinutes} min</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-white/40 uppercase">Fare</p>
                      <p className="font-extrabold text-white">${tr.costUSD}</p>
                    </div>

                    <button
                      onClick={() =>
                        setBookingSuccessModal({
                          title: `Pass Activated: ${tr.provider}`,
                          details: `${tr.type} • Ready for digital wallet tap`,
                          price: `$${tr.costUSD}`,
                        })
                      }
                      className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-md shadow-blue-500/30"
                    >
                      Activate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-md bg-[#090a0f]/90 border border-white/10 rounded-[32px] p-6 space-y-6 text-center backdrop-blur-2xl relative shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30 animate-pulse">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-white">{bookingSuccessModal.title}</h3>
              <p className="text-xs text-white/70">{bookingSuccessModal.details}</p>
              <p className="text-xl font-black text-blue-400 pt-2">{bookingSuccessModal.price}</p>
            </div>

            <button
              onClick={() => setBookingSuccessModal(null)}
              className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
            >
              Done & Save to Passbook
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
