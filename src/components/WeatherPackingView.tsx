import React, { useState } from "react";
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  CheckCircle2,
  Luggage,
  Plus,
  Compass,
  QrCode,
  Lock,
  ShieldAlert,
  Languages,
  DollarSign,
  Camera,
  FileText,
  Smartphone,
  PhoneCall,
  MapPin,
  Sparkles,
  Zap,
  ArrowRightLeft,
  Check,
  AlertTriangle,
  UploadCloud,
  Eye,
  Trash2,
  HeartPulse,
  Share2,
  Download,
  WifiOff,
  SunMedium,
  Umbrella,
} from "lucide-react";

interface PackingItem {
  id: string;
  name: string;
  category: "Documents" | "Apparel" | "Electronics" | "Toiletries" | "Medical";
  checked: boolean;
  qty: number;
}

interface StoredDocument {
  id: string;
  type: "Passport" | "Visa" | "Boarding Pass" | "Hotel Voucher" | "Insurance";
  title: string;
  documentNumber: string;
  expiryOrDate: string;
  status: "Valid" | "Scan Confirmed" | "Verified";
  holderName: string;
}

export const WeatherPackingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "weather" | "packing" | "wallet" | "translator" | "safety"
  >("weather");

  // ================= WEATHER STATES =================
  const [selectedCity, setSelectedCity] = useState("Kyoto, Japan");

  const weatherData: Record<string, any> = {
    "Kyoto, Japan": {
      temp: "22°C / 72°F",
      condition: "Partly Cloudy & Gentle Breeze",
      humidity: "58%",
      wind: "12 km/h",
      uvIndex: "5 (Moderate)",
      airQuality: "24 (Good)",
      visibility: "10 km",
      rainProb: "15%",
      sunrise: "05:12 AM",
      sunset: "07:05 PM",
      sightseeingScore: 96,
      forecast: [
        { day: "Thu", temp: "22°C", cond: "☀️ Sunny", high: "23°C", low: "14°C" },
        { day: "Fri", temp: "21°C", cond: "🌤️ Mild", high: "22°C", low: "13°C" },
        { day: "Sat", temp: "19°C", cond: "🌧️ Shower", high: "20°C", low: "12°C" },
        { day: "Sun", temp: "23°C", cond: "☀️ Clear", high: "24°C", low: "15°C" },
        { day: "Mon", temp: "25°C", cond: "☀️ Warm", high: "26°C", low: "16°C" },
        { day: "Tue", temp: "20°C", cond: "⛅ Overcast", high: "21°C", low: "13°C" },
      ],
      hourly: [
        { time: "09 AM", temp: "18°C", icon: "☀️" },
        { time: "12 PM", temp: "22°C", icon: "☀️" },
        { time: "03 PM", temp: "23°C", icon: "🌤️" },
        { time: "06 PM", temp: "20°C", icon: "🌅" },
        { time: "09 PM", temp: "16°C", icon: "🌙" },
      ],
      attire: "Breathable cotton layers, light jacket for evening walk, comfortable walking sneakers.",
      aiTip: "Golden hour at Fushimi Inari is at 06:15 PM today. Perfect lighting & 12% lower crowds.",
    },
    "Amalfi Coast, Italy": {
      temp: "27°C / 80°F",
      condition: "Sunny Coastal Heat",
      humidity: "62%",
      wind: "18 km/h",
      uvIndex: "8 (Very High)",
      airQuality: "18 (Good)",
      visibility: "12 km",
      rainProb: "5%",
      sunrise: "05:45 AM",
      sunset: "08:15 PM",
      sightseeingScore: 98,
      forecast: [
        { day: "Thu", temp: "27°C", cond: "☀️ Clear", high: "28°C", low: "20°C" },
        { day: "Fri", temp: "28°C", cond: "☀️ Sunny", high: "29°C", low: "21°C" },
        { day: "Sat", temp: "26°C", cond: "🌤️ Ocean breeze", high: "27°C", low: "19°C" },
        { day: "Sun", temp: "27°C", cond: "☀️ Clear", high: "28°C", low: "20°C" },
        { day: "Mon", temp: "29°C", cond: "☀️ Hot", high: "30°C", low: "22°C" },
        { day: "Tue", temp: "28°C", cond: "☀️ Sunny", high: "29°C", low: "21°C" },
      ],
      hourly: [
        { time: "09 AM", temp: "23°C", icon: "☀️" },
        { time: "12 PM", temp: "27°C", icon: "☀️" },
        { time: "03 PM", temp: "28°C", icon: "☀️" },
        { time: "06 PM", temp: "25°C", icon: "🌅" },
        { time: "09 PM", temp: "22°C", icon: "🌙" },
      ],
      attire: "Linen shirts, swim attire, sunglasses, wide-brim hat, coral-safe sunscreen.",
      aiTip: "UV peaks between 11:30 AM - 3:00 PM. High recommended window for boat cruises or shade dining.",
    },
    "Zermatt, Switzerland": {
      temp: "4°C / 39°F",
      condition: "Alpine Snow & Crisp Air",
      humidity: "75%",
      wind: "24 km/h",
      uvIndex: "4 (Moderate)",
      airQuality: "10 (Pristine)",
      visibility: "8 km",
      rainProb: "80%",
      sunrise: "06:05 AM",
      sunset: "08:40 PM",
      sightseeingScore: 89,
      forecast: [
        { day: "Thu", temp: "4°C", cond: "❄️ Snow", high: "5°C", low: "-2°C" },
        { day: "Fri", temp: "2°C", cond: "🌨️ Light Flurry", high: "3°C", low: "-4°C" },
        { day: "Sat", temp: "5°C", cond: "🌤️ Alpine Sun", high: "6°C", low: "-1°C" },
        { day: "Sun", temp: "3°C", cond: "❄️ Cold", high: "4°C", low: "-3°C" },
        { day: "Mon", temp: "6°C", cond: "☀️ Clear", high: "7°C", low: "0°C" },
        { day: "Tue", temp: "4°C", cond: "🌤️ Flurry", high: "5°C", low: "-2°C" },
      ],
      hourly: [
        { time: "09 AM", temp: "1°C", icon: "❄️" },
        { time: "12 PM", temp: "4°C", icon: "🌤️" },
        { time: "03 PM", temp: "28°C", icon: "🌨️" },
        { time: "06 PM", temp: "1°C", icon: "🏔️" },
        { time: "09 PM", temp: "-2°C", icon: "🌙" },
      ],
      attire: "Thermal base layers, waterproof down parka, insulated snow boots, UV ski goggles.",
      aiTip: "Matterhorn visibility predicted highest between 10:00 AM - 1:00 PM tomorrow.",
    },
  };

  const current = weatherData[selectedCity] || weatherData["Kyoto, Japan"];

  // ================= PACKING STATES =================
  const [packingList, setPackingList] = useState<PackingItem[]>([
    { id: "1", name: "Passport & Universal Visa", category: "Documents", checked: true, qty: 1 },
    { id: "2", name: "International Drivers License", category: "Documents", checked: true, qty: 1 },
    { id: "3", name: "Breathable Cotton Shirts", category: "Apparel", checked: true, qty: 4 },
    { id: "4", name: "Lightweight Evening Jacket", category: "Apparel", checked: false, qty: 1 },
    { id: "5", name: "Universal Travel Plug Adapter", category: "Electronics", checked: true, qty: 1 },
    { id: "6", name: "Noise-Canceling Headphones", category: "Electronics", checked: true, qty: 1 },
    { id: "7", name: "Sunscreen SPF 50+", category: "Toiletries", checked: false, qty: 1 },
    { id: "8", name: "Personal Prescription Meds", category: "Medical", checked: true, qty: 1 },
    { id: "9", name: "First Aid & Bandages", category: "Medical", checked: false, qty: 1 },
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<PackingItem["category"]>("Apparel");

  const togglePacking = (id: string) => {
    setPackingList(
      packingList.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const addPackingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setPackingList([
      ...packingList,
      {
        id: Date.now().toString(),
        name: newItemName.trim(),
        category: newItemCategory,
        checked: false,
        qty: 1,
      },
    ]);
    setNewItemName("");
  };

  const packedCount = packingList.filter((i) => i.checked).length;
  const packedPercent = Math.round((packedCount / packingList.length) * 100) || 0;
  const estimatedWeightKg = (packedCount * 0.85).toFixed(1);

  // ================= DIGITAL WALLET & OCR STATES =================
  const [isScanning, setIsScanning] = useState(false);
  const [documents, setDocuments] = useState<StoredDocument[]>([
    {
      id: "doc-1",
      type: "Passport",
      title: "United States Passport",
      documentNumber: "A98214012",
      expiryOrDate: "Expires: 14 NOV 2031",
      status: "Valid",
      holderName: "Arjun Sharma",
    },
    {
      id: "doc-2",
      type: "Visa",
      title: "Japan e-Visa (Multiple Entry)",
      documentNumber: "JP-2026-8819A",
      expiryOrDate: "Valid thru: 30 OCT 2026",
      status: "Verified",
      holderName: "Arjun Sharma",
    },
    {
      id: "doc-3",
      type: "Boarding Pass",
      title: "Japan Airlines JL 001 (SFO ➔ NRT)",
      documentNumber: "Seat 03A • Gate 82",
      expiryOrDate: "Departure: 11:30 AM",
      status: "Scan Confirmed",
      holderName: "Arjun Sharma",
    },
  ]);

  const handleSimulateOCRScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setDocuments((prev) => [
        {
          id: `doc-${Date.now()}`,
          type: "Hotel Voucher",
          title: "Aman Kyoto Zen Luxury Reservation",
          documentNumber: "CONF-AMN-9981",
          expiryOrDate: "Check-in: 15 AUG 2026",
          status: "Verified",
          holderName: "Arjun Sharma",
        },
        ...prev,
      ]);
      setIsScanning(false);
    }, 1800);
  };

  // ================= TRANSLATOR & CURRENCY STATES =================
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Japanese");
  const [inputText, setInputText] = useState("Where is the best traditional tea house nearby?");
  const [translatedText, setTranslatedText] = useState("近くで一番おすすめの伝統的な茶室はどこですか？");
  const [isTranslating, setIsTranslating] = useState(false);

  const [usdAmount, setUsdAmount] = useState<number>(100);
  const exchangeRates: Record<string, number> = {
    JPY: 154.2,
    EUR: 0.92,
    GBP: 0.78,
    INR: 83.5,
    AUD: 1.52,
  };
  const [targetCurr, setTargetCurr] = useState("JPY");

  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      if (targetLang === "Japanese") {
        setTranslatedText("近くで一番おすすめの伝統的な茶室はどこですか？ (Chikaku de ichiban osusume no dentōtekina chashitsu wa dokodesu ka?)");
      } else if (targetLang === "Italian") {
        setTranslatedText("Dove si trova la migliore casa del tè tradizionale nelle vicinanze?");
      } else if (targetLang === "French") {
        setTranslatedText("Où se trouve le meilleur salon de thé traditionnel à proximité ?");
      } else {
        setTranslatedText(`[Translated to ${targetLang}]: ${inputText}`);
      }
      setIsTranslating(false);
    }, 600);
  };

  // ================= SAFETY & SOS STATES =================
  const [sosActive, setSosActive] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Universal Travel Intelligence & Safety Suite
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Weather, Wallet & Safety Hub
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Real-time meteorological insights, OCR document vault, AI translation & emergency SOS.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("weather")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "weather"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            <span>Weather</span>
          </button>

          <button
            onClick={() => setActiveTab("packing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "packing"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Luggage className="w-3.5 h-3.5" />
            <span>Packing List</span>
          </button>

          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "wallet"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Travel Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab("translator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "translator"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>AI Translate</span>
          </button>

          <button
            onClick={() => setActiveTab("safety")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "safety"
                ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                : "text-white/60 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Safety & SOS</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: WEATHER CENTER ================= */}
      {activeTab === "weather" && (
        <div className="space-y-6 animate-fadeIn">
          {/* City Selection Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {Object.keys(weatherData).map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    selectedCity === city
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30"
                      : "bg-white/5 hover:bg-white/10 text-white/60 border-white/10"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              <SunMedium className="w-3.5 h-3.5" />
              <span>Sightseeing Rating: {current.sightseeingScore}/100</span>
            </div>
          </div>

          {/* Hero Weather Card */}
          <div className="bg-gradient-to-br from-blue-900/40 via-[#0a1020]/80 to-purple-950/40 border border-white/10 text-white p-6 sm:p-8 rounded-[36px] shadow-2xl space-y-6 backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Live Atmospheric Radar • {selectedCity}
                </span>
                <h3 className="text-5xl sm:text-7xl font-black mt-2 tracking-tighter text-white">
                  {current.temp}
                </h3>
                <p className="text-base font-semibold text-white/80 mt-1">{current.condition}</p>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-xs">
                <div>
                  <p className="text-white/40 uppercase font-bold tracking-widest text-[9px]">Humidity</p>
                  <p className="font-extrabold text-sm text-white mt-0.5">{current.humidity}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase font-bold tracking-widest text-[9px]">Wind</p>
                  <p className="font-extrabold text-sm text-white mt-0.5">{current.wind}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase font-bold tracking-widest text-[9px]">UV Index</p>
                  <p className="font-extrabold text-sm text-amber-400 mt-0.5">{current.uvIndex}</p>
                </div>
                <div>
                  <p className="text-white/40 uppercase font-bold tracking-widest text-[9px]">Air Quality</p>
                  <p className="font-extrabold text-sm text-emerald-400 mt-0.5">{current.airQuality}</p>
                </div>
              </div>
            </div>

            {/* Hourly Forecast Strip */}
            <div className="space-y-2 pt-2 relative z-10">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Today's Hourly Pulse</p>
              <div className="grid grid-cols-5 gap-3">
                {current.hourly.map((h: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1"
                  >
                    <p className="text-[10px] text-white/50 font-bold">{h.time}</p>
                    <p className="text-lg">{h.icon}</p>
                    <p className="text-xs font-extrabold text-white">{h.temp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6-Day Extended Forecast */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2 relative z-10">
              {current.forecast.map((f: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center space-y-1 hover:border-white/20 transition-all"
                >
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{f.day}</p>
                  <p className="text-base font-extrabold text-white">{f.temp}</p>
                  <p className="text-[11px] text-white/70">{f.cond}</p>
                  <p className="text-[9px] text-white/40 font-mono mt-1">
                    {f.high} / {f.low}
                  </p>
                </div>
              ))}
            </div>

            {/* AI Wardrobe & Local Pro-Tip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                <p className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                  <Luggage className="w-4 h-4" />
                  AI Wardrobe Advisory
                </p>
                <p className="text-white/80 leading-relaxed">{current.attire}</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-xs space-y-1">
                <p className="font-bold text-blue-400 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-4 h-4" />
                  Optimal Photography Window
                </p>
                <p className="text-white/80 leading-relaxed">{current.aiTip}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PACKING LIST ================= */}
      {activeTab === "packing" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Progress Header */}
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                <Luggage className="w-4 h-4" />
                AI Smart Luggage Assistant
              </div>
              <h3 className="text-2xl font-black text-white">
                {packedCount} of {packingList.length} Items Packed ({packedPercent}%)
              </h3>
              <p className="text-xs text-white/50">
                Estimated Bag Weight: <span className="text-emerald-400 font-bold">{estimatedWeightKg} kg</span> • Fits standard 22" cabin roller
              </p>
            </div>

            {/* Circular or Bar Progress */}
            <div className="w-full sm:w-64 space-y-2">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${packedPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase">
                <span>0% Empty</span>
                <span>{packedPercent}% Ready</span>
              </div>
            </div>
          </div>

          {/* Add Item Form */}
          <form
            onSubmit={addPackingItem}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add item (e.g. Waterproof Camera Pouch)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500 w-full"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500 w-full sm:w-auto"
            >
              <option value="Documents">Documents</option>
              <option value="Apparel">Apparel</option>
              <option value="Electronics">Electronics</option>
              <option value="Toiletries">Toiletries</option>
              <option value="Medical">Medical</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 shrink-0 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </form>

          {/* Item Checklist by Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Documents", "Apparel", "Electronics", "Toiletries", "Medical"].map((cat) => {
              const catItems = packingList.filter((i) => i.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div
                  key={cat}
                  className="p-5 rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-3"
                >
                  <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-widest border-b border-white/10 pb-2">
                    {cat}
                  </h4>
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => togglePacking(item.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          item.checked
                            ? "bg-emerald-500/10 border-emerald-500/30 text-white/60 line-through"
                            : "bg-white/5 border-white/5 text-white hover:border-white/20"
                        }`}
                      >
                        <span className="text-xs font-semibold">{item.name}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            item.checked
                              ? "bg-emerald-500 border-emerald-500 text-black"
                              : "border-white/30"
                          }`}
                        >
                          {item.checked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: TRAVEL WALLET & OCR ================= */}
      {activeTab === "wallet" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Scan Action Header */}
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                <Lock className="w-4 h-4 text-emerald-400" />
                Encrypted Offline Document Vault
              </div>
              <h3 className="text-xl font-extrabold text-white">Passports, Visas & Boarding Passes</h3>
              <p className="text-xs text-white/50">
                Local AES-256 encrypted storage. Quick biometrics unlocked.
              </p>
            </div>

            <button
              onClick={handleSimulateOCRScan}
              disabled={isScanning}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 shrink-0 active:scale-95"
            >
              {isScanning ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-blue-300" />
                  <span>AI OCR Extracting...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Scan New Ticket / Passport</span>
                </>
              )}
            </button>
          </div>

          {/* Document Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-6 rounded-[32px] bg-gradient-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-2xl space-y-4 hover:border-white/30 transition-all shadow-xl relative overflow-hidden group"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                    {doc.type}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {doc.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-base leading-snug">{doc.title}</h4>
                  <p className="text-xs font-mono text-white/70">{doc.documentNumber}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-white/50">
                  <span>{doc.holderName}</span>
                  <span className="font-mono">{doc.expiryOrDate}</span>
                </div>

                {/* QR Code / View action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-blue-400 cursor-pointer hover:underline">
                    <QrCode className="w-4 h-4" />
                    <span>Show Digital QR</span>
                  </div>

                  <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: TRANSLATOR & CURRENCY ================= */}
      {activeTab === "translator" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {/* AI Real-time Translator */}
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Languages className="w-5 h-5 text-blue-400" />
                  AI Voice & Text Translator
                </h3>
                <p className="text-xs text-white/50">100+ languages supported with offline neural voice</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                ● Live AI
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-white px-3">{sourceLang}</span>
              <button
                onClick={() => {
                  setSourceLang(targetLang);
                  setTargetLang(sourceLang);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-zinc-900 border border-white/10 text-xs font-bold text-white px-3 py-1.5 rounded-xl focus:outline-none"
              >
                <option value="Japanese">Japanese</option>
                <option value="Italian">Italian</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            {/* Input Text Box */}
            <div className="space-y-2">
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or speak phrase to translate..."
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex justify-between items-center">
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isTranslating ? "Translating..." : "Translate Phrase"}
                </button>
              </div>
            </div>

            {/* Output Box */}
            <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-1">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                {targetLang} Translation
              </p>
              <p className="text-sm font-semibold text-white leading-relaxed">{translatedText}</p>
            </div>
          </div>

          {/* Live Currency Converter */}
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-5">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Live Currency Converter
              </h3>
              <p className="text-xs text-white/50">Auto-refreshed bank rates & spending advice</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                  Amount in USD ($)
                </label>
                <input
                  type="number"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-base font-extrabold text-white focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                    Target Currency
                  </label>
                  <select
                    value={targetCurr}
                    onChange={(e) => setTargetCurr(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-bold text-white focus:outline-none mt-1"
                  >
                    <option value="JPY">JPY (Japanese Yen)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="GBP">GBP (British Pound)</option>
                    <option value="INR">INR (Indian Rupee)</option>
                    <option value="AUD">AUD (Australian Dollar)</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase">Converted Value</p>
                  <p className="text-xl font-black text-white mt-0.5">
                    {(usdAmount * (exchangeRates[targetCurr] || 1)).toLocaleString()} {targetCurr}
                  </p>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/70 space-y-1">
                <span className="font-bold text-amber-400">💡 Local Cash vs Card Advice:</span>
                <p>
                  Japan is 80% card friendly, but carrying ¥10,000 (~$65 USD) cash is recommended for temple entries & traditional ramen stalls.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: SAFETY & SOS ================= */}
      {activeTab === "safety" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Emergency SOS Banner */}
          <div
            className={`p-6 sm:p-8 rounded-[36px] border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 ${
              sosActive
                ? "bg-red-950/90 border-red-500 shadow-2xl shadow-red-500/40 animate-pulse"
                : "bg-gradient-to-r from-red-950/40 via-[#10080a] to-zinc-950 border-red-500/30"
            }`}
          >
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest border border-red-500/30">
                <AlertTriangle className="w-4 h-4" />
                Global Emergency SOS Protocol
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {sosActive ? "🚨 SOS Broadcast Active!" : "One-Tap Local Emergency Dispatch"}
              </h3>
              <p className="text-xs sm:text-sm text-white/70">
                Instantly dials local police/ambulance & broadcasts encrypted GPS coordinates to emergency contacts.
              </p>
            </div>

            <button
              onClick={() => setSosActive(!sosActive)}
              className={`px-8 py-4 rounded-full font-black text-sm transition-all shadow-xl active:scale-95 shrink-0 ${
                sosActive
                  ? "bg-white text-red-600 hover:bg-zinc-200"
                  : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/50"
              }`}
            >
              {sosActive ? "DEACTIVATE SOS" : "TRIGGER SOS BROADCAST"}
            </button>
          </div>

          {/* Local Emergency Numbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase">Japan Emergency Services</p>
                <h4 className="text-xl font-extrabold text-white mt-1">Police: 110 • Ambulance: 119</h4>
                <p className="text-xs text-white/60 mt-1">English translator line automatically available</p>
              </div>
            </div>

            <div className="p-6 rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase">Medical ID Vault</p>
                <h4 className="text-xl font-extrabold text-white mt-1">Blood Group: O+ Positive</h4>
                <p className="text-xs text-white/60 mt-1">Allergies: Penicillin • Emergency Contact: +1 (555) 019-2831</p>
              </div>
            </div>

            <div className="p-6 rounded-[28px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase">Nearest US Embassy</p>
                <h4 className="text-lg font-extrabold text-white mt-1">Tokyo Embassy (Minato City)</h4>
                <p className="text-xs text-white/60 mt-1">Phone: +81 3-3224-5000 • 12.4 km from location</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
