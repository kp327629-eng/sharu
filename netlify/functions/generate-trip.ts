import { GoogleGenAI } from "@google/genai";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const DEST_INFO: Record<string, { lat: number; lng: number; country: string; tag: string; cover: string }> = {
  kyoto: {
    lat: 35.0116,
    lng: 135.7681,
    country: "Japan",
    tag: "Zen gardens, geisha districts & meditative bamboo groves",
    cover: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  },
  tokyo: {
    lat: 35.6762,
    lng: 139.6503,
    country: "Japan",
    tag: "Electric cyberpunk metropolis meets centuries of ancient craftsmanship",
    cover: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
  },
  paris: {
    lat: 48.8566,
    lng: 2.3522,
    country: "France",
    tag: "Haute gastronomy, timeless boulevards & Louvre masterpieces",
    cover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  rome: {
    lat: 41.9028,
    lng: 12.4964,
    country: "Italy",
    tag: "Colosseum grandeur, Vatican treasures & authentic trattorias",
    cover: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
  },
};

function generateFallbackTrip(params: any) {
  const dest = params.destination || "Kyoto, Japan";
  const days = Math.min(Math.max(params.durationDays || 3, 1), 7);
  const isBudget = params.budgetTier === "Budget";
  const dailyCost = isBudget ? 90 : params.budgetTier === "Premium Luxury" ? 650 : 220;

  const keyLower = Object.keys(DEST_INFO).find((k) => dest.toLowerCase().includes(k)) || "kyoto";
  const baseCoord = DEST_INFO[keyLower] || {
    lat: 35.0116,
    lng: 135.7681,
    country: "International",
    tag: "A breathtaking escape crafted for memorable discovery",
    cover: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
  };

  const generatedDays = [];
  for (let i = 1; i <= days; i++) {
    const dayLat = baseCoord.lat + (Math.random() - 0.5) * 0.04;
    const dayLng = baseCoord.lng + (Math.random() - 0.5) * 0.04;

    generatedDays.push({
      dayNumber: i,
      title: i === 1 ? "Arrival & Architectural Exploration" : i === 2 ? "Cultural Immersion & Gourmet Discoveries" : "Scenic Vistas & Hidden Local Spots",
      summary: `Day ${i} blends handpicked attractions with ample time for unhurried exploration and local gastronomy.`,
      schedule: [
        {
          time: "09:00 AM",
          title: `${dest} Morning Landmark Walk`,
          description: `Kickstart the day at the iconic historical district before afternoon crowds arrive.`,
          category: "Landmark",
          duration: "2 hours",
          costUSD: Math.round(15 + Math.random() * 20),
          lat: dayLat + 0.005,
          lng: dayLng + 0.005,
          address: `${dest} Center Plaza`,
          proTip: "Arrive right at opening time to capture flawless photos without tourists in the background.",
        },
        {
          time: "12:30 PM",
          title: "Artisanal Local Lunch Experience",
          description: "Savor authentic regional dishes at a highly rated family-owned bistro recommended by culinary experts.",
          category: "Food",
          duration: "1.5 hours",
          costUSD: Math.round(25 + Math.random() * 30),
          lat: dayLat - 0.003,
          lng: dayLng + 0.002,
          address: `Culinary Promenade, ${dest}`,
          proTip: "Ask for the seasonal chef's special or house tasting pairing.",
        },
        {
          time: "03:00 PM",
          title: "Boutique Artisan District & Secret Gardens",
          description: "Explore hidden alleyways, local craft shops, and peaceful scenic viewpoints.",
          category: "Culture",
          duration: "2.5 hours",
          costUSD: Math.round(10 + Math.random() * 15),
          lat: dayLat + 0.002,
          lng: dayLng - 0.004,
          address: `Artisan Quarter, ${dest}`,
          proTip: "Pick up hand-crafted souvenirs directly from local artisans.",
        },
        {
          time: "07:30 PM",
          title: "Sunset Dining & Skyline Cocktails",
          description: "End the evening with a memorable dinner overlooking panoramic city lights or tranquil waterfront views.",
          category: "Relaxation",
          duration: "2 hours",
          costUSD: Math.round(45 + Math.random() * 50),
          lat: dayLat - 0.004,
          lng: dayLng - 0.003,
          address: `Rooftop Terrace, ${dest}`,
          proTip: "Reserve a window or edge table in advance for optimal sunset views.",
        },
      ],
    });
  }

  return {
    destination: dest,
    country: baseCoord.country,
    tagline: baseCoord.tag,
    coverImage: baseCoord.cover,
    overview: `Experience the finest curated journey through ${dest}. Tailored with precision for unforgettable travel moments and cultural wonder.`,
    weatherForecast: {
      avgTemp: "21°C / 70°F",
      condition: "Pleasant & clear skies",
      packingAdvice: "Comfortable footwear, layered clothing, light windbreaker, camera, and sunscreen.",
    },
    estimatedBudget: {
      totalUSD: dailyCost * days,
      perDayUSD: dailyCost,
      breakdown: [
        { category: "Accommodation", amountUSD: Math.round(dailyCost * days * 0.45) },
        { category: "Dining & Drinks", amountUSD: Math.round(dailyCost * days * 0.3) },
        { category: "Activities & Entry", amountUSD: Math.round(dailyCost * days * 0.15) },
        { category: "Local Transport", amountUSD: Math.round(dailyCost * days * 0.1) },
      ],
    },
    days: generatedDays,
    instagramSpots: [
      { name: `${dest} Main Overlook`, bestTime: "Golden Hour (6:15 PM)", tip: "Frame the shot with natural archways or foliage for depth." },
      { name: "Old Quarter Alleyways", bestTime: "Early Morning (7:30 AM)", tip: "Capture quiet morning light and soft shadow reflections." },
    ],
    hiddenGems: [
      { name: "Secret Courtyard Tea House", description: "A quiet tucked-away garden sanctuary away from main tourist streets." },
      { name: "Local Artisan Market", description: "Where local chefs and artists gather every morning." },
    ],
    packingChecklist: [
      { item: "Universal Power Adapter with USB-C Fast Charge", category: "Tech", essential: true },
      { item: "Ergonomic Walking Sneakers", category: "Clothing", essential: true },
      { item: "Compact RFID Travel Wallet", category: "Documents", essential: true },
      { item: "Reusable Stainless Steel Water Bottle", category: "Essentials", essential: false },
      { item: "Portable Power Bank (10,000mAh)", category: "Tech", essential: true },
    ],
    essentialInfo: {
      visa: "Check entry visa requirements for your nationality prior to departure.",
      currency: "Local currency / Card payments widely accepted.",
      language: "English widely spoken in tourist and dining areas.",
      safetyTips: [
        "Keep digital copies of passport and insurance in secure cloud storage.",
        "Use official ride-hailing apps or metered taxis at major stations.",
      ],
      emergencyNumbers: "Emergency Services: 112 / Local Police: 110",
    },
  };
}

export const handler = async (event: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    let body: any = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    const {
      destination = "Kyoto, Japan",
      departureCity = "San Francisco",
      durationDays = 3,
      travelers = { adults: 2, children: 0 },
      budgetTier = "Balanced",
      travelStyle = "Explorer",
      transport = "Public & Walking",
      hotelClass = "4-Star Boutique",
      foodPreference = "Local Specialties",
      interests = ["Landmarks", "Food", "Culture"],
    } = body;

    const ai = getGeminiClient();

    if (ai) {
      const promptText = `
You are the world's top luxury AI travel concierge and master itinerary architect.
Create an exceptionally detailed, hyper-curated, realistic travel plan for:
- Destination: ${destination}
- Departure: ${departureCity || "User's location"}
- Duration: ${durationDays} days
- Travelers: ${travelers.adults} Adults, ${travelers.children} Children
- Budget Style: ${budgetTier}
- Travel Style: ${travelStyle}
- Preferred Transport: ${transport}
- Accommodation Standard: ${hotelClass}
- Food Preferences: ${foodPreference}
- Key Interests: ${interests.join(", ")}

Respond strictly in valid JSON matching this structure:
{
  "destination": "${destination}",
  "country": "Country Name",
  "tagline": "A catchy luxury tagline for this trip",
  "overview": "Rich 2-3 sentence overview of the journey experience",
  "weatherForecast": {
    "avgTemp": "22°C / 72°F",
    "condition": "Sunny with light ocean breeze",
    "packingAdvice": "Light breathable layers, comfortable walking sneakers, sunglasses, thin jacket for evening"
  },
  "estimatedBudget": {
    "totalUSD": 1450,
    "perDayUSD": 350,
    "breakdown": [
      { "category": "Accommodation", "amountUSD": 600 },
      { "category": "Dining & Drinks", "amountUSD": 450 },
      { "category": "Activities & Entry", "amountUSD": 250 },
      { "category": "Local Transport", "amountUSD": 150 }
    ]
  },
  "days": [
    {
      "dayNumber": 1,
      "title": "Day Title, e.g. Historic Heart & Sunset Views",
      "summary": "Brief summary of the day",
      "schedule": [
        {
          "time": "09:00 AM",
          "title": "Activity Name",
          "description": "Engaging description with insider tip",
          "category": "Food",
          "duration": "2 hours",
          "costUSD": 25,
          "lat": 35.0116,
          "lng": 135.7681,
          "address": "Specific address or landmark area",
          "proTip": "Insider trick"
        }
      ]
    }
  ],
  "instagramSpots": [
    { "name": "Spot Name", "bestTime": "Golden Hour (6:30 PM)", "tip": "Angle instruction for stunning photo" }
  ],
  "hiddenGems": [
    { "name": "Hidden Place", "description": "Why locals love it and how to find it" }
  ],
  "packingChecklist": [
    { "item": "Universal Power Adapter", "category": "Tech", "essential": true }
  ],
  "essentialInfo": {
    "visa": "Visa details",
    "currency": "Currency name",
    "language": "Primary language",
    "safetyTips": ["Tip 1"],
    "emergencyNumbers": "Emergency numbers"
  }
}
Provide ${durationDays} days of plans, each day having 3-4 detailed schedule items.
`;

      const modelsToTry = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: promptText,
            config: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          });

          const rawText = response.text || "";
          const cleanedText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
          const tripData = JSON.parse(cleanedText);
          const keyLower = Object.keys(DEST_INFO).find((k) => destination.toLowerCase().includes(k)) || "kyoto";
          if (!tripData.coverImage) {
            tripData.coverImage = DEST_INFO[keyLower]?.cover || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80";
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, trip: tripData, source: `netlify-${model}` }),
          };
        } catch (err: any) {
          console.warn(`Netlify Function Gemini ${model} failed:`, err?.message);
        }
      }
    }

    const fallback = generateFallbackTrip({
      destination,
      departureCity,
      durationDays,
      budgetTier,
      travelStyle,
      interests,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, trip: fallback, source: "netlify_fallback" }),
    };
  } catch (error: any) {
    console.error("Netlify function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
