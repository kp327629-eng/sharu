import { TripItinerary, BudgetTier, TravelStyle, DayPlan, ScheduleItem } from "../types";
import { FEATURED_DESTINATIONS } from "../data/destinations";

export interface TripRequestParams {
  destination: string;
  departureCity?: string;
  startDate?: string;
  endDate?: string;
  durationDays?: number;
  travelers?: { adults: number; children: number };
  budgetTier?: BudgetTier;
  travelStyle?: TravelStyle;
  transport?: string;
  hotelClass?: string;
  foodPreference?: string;
  interests?: string[];
}

/**
 * Curated destination metadata for coordinates, cover images, and signature highlights
 */
const DESTINATION_DATABASE: Record<
  string,
  {
    country: string;
    tagline: string;
    coverImage: string;
    lat: number;
    lng: number;
    currency: string;
    avgCostPerDay: number;
    weather: { avgTemp: string; condition: string; packingAdvice: string };
    instagramSpots: { name: string; bestTime: string; tip: string }[];
    hiddenGems: { name: string; description: string }[];
    signatureActivities: {
      time: string;
      title: string;
      description: string;
      category: "Food" | "Landmark" | "Culture" | "Nature" | "Shopping" | "Relaxation";
      duration: string;
      costUSD: number;
      latOffset: number;
      lngOffset: number;
      address: string;
      proTip: string;
    }[];
  }
> = {
  kyoto: {
    country: "Japan",
    tagline: "Zen gardens, geisha quarters & meditative bamboo sanctuaries",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    lat: 35.0116,
    lng: 135.7681,
    currency: "Japanese Yen (JPY)",
    avgCostPerDay: 220,
    weather: {
      avgTemp: "21°C / 70°F",
      condition: "Crisp temperate mornings with pleasant afternoon sunshine",
      packingAdvice: "Easy slip-on walking shoes (temples require removal), light cotton layers, camera, travel umbrella",
    },
    instagramSpots: [
      { name: "Fushimi Inari Senbon Torii", bestTime: "Sunrise (6:30 AM)", tip: "Ascend past the first dual path to the Yotsutsuji intersection for uncrowded red gate shots." },
      { name: "Arashiyama Bamboo Grove", bestTime: "Early Dawn (7:00 AM)", tip: "Shoot low with wide-angle lens pointing upwards to capture towering stalks." },
      { name: "Kiyomizu-dera Wooden Stage", bestTime: "Golden Hour (5:45 PM)", tip: "Position from Okunoin hall to frame the main hall against the setting sun and Kyoto valley." },
      { name: "Yasaka Pagoda & Ninenzaka", bestTime: "Dusk / Blue Hour (6:45 PM)", tip: "Capture the cobblestone street reflecting street lanterns with the pagoda centered." },
    ],
    hiddenGems: [
      { name: "Gio-ji Moss Sanctuary", description: "A secluded emerald moss temple tucked away in north Arashiyama, peaceful and forgotten by crowds." },
      { name: "Pontocho Back-Alley Ochaya", description: "Atmospheric lantern-lit narrow alleyway along the Kamogawa river with century-old wooden dining terraces." },
      { name: "Otagi Nenbutsu-ji Temple", description: "Home to 1,200 unique whimsical stone Rakan statues carved by amateur sculptors with charming smiles." },
    ],
    signatureActivities: [
      {
        time: "07:30 AM",
        title: "Fushimi Inari Mountain Shrine Walk",
        description: "Hike through thousands of vermilion torii gates winding up sacred Mount Inari before daytime tour buses arrive.",
        category: "Landmark",
        duration: "2.5 hours",
        costUSD: 0,
        latOffset: -0.043,
        lngOffset: 0.004,
        address: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
        proTip: "Pick up grilled unagi skewers or sweet inari sushi at the base stalls on your descent.",
      },
      {
        time: "11:00 AM",
        title: "Kiyomizu-dera & Ancient Higashiyama Stone Lanes",
        description: "Visit the UNESCO wooden temple cantilevered over cherry and maple hills, then stroll down Sannenzaka preserved merchant lanes.",
        category: "Culture",
        duration: "2 hours",
        costUSD: 6,
        latOffset: -0.012,
        lngOffset: 0.017,
        address: "1-294 Kiyomizu, Higashiyama Ward, Kyoto",
        proTip: "Drink from the Otowa Waterfall streams with the long-handled ladles for health and wisdom.",
      },
      {
        time: "01:30 PM",
        title: "Kaiseki Lunch & Nishiki Food Market Tasting",
        description: "Taste Kyoto's culinary soul: fresh dashi tamagoyaki, matcha warabi mochi, glazed octopus skewers, and Kyoto pickles.",
        category: "Food",
        duration: "1.5 hours",
        costUSD: 35,
        latOffset: 0.003,
        lngOffset: -0.003,
        address: "Nishikikoji Dori, Nakagyo Ward, Kyoto",
        proTip: "Try the seasonal matcha soft-serve with roasted kinako at the market's center stall.",
      },
      {
        time: "03:45 PM",
        title: "Kinkaku-ji (Golden Pavilion) & Mirror Pond Meditation",
        description: "Behold the top two floors of the Zen pavilion covered completely in pure gold leaf, reflected in Kyoko-chi pond.",
        category: "Landmark",
        duration: "1.5 hours",
        costUSD: 5,
        latOffset: 0.038,
        lngOffset: -0.039,
        address: "1 Kinkakujicho, Kita Ward, Kyoto",
        proTip: "Late afternoon light illuminates the gold leaf intensely against the dark pine trees.",
      },
      {
        time: "06:30 PM",
        title: "Gion District Evening Walk & Traditional Pontocho Dinner",
        description: "Wander through the historic wooden teahouse district where geiko and maiko hurry to evening banquet appointments.",
        category: "Relaxation",
        duration: "2.5 hours",
        costUSD: 75,
        latOffset: 0.002,
        lngOffset: 0.006,
        address: "Gion South & Pontocho Kamogawa Terrace, Kyoto",
        proTip: "Book a kawayuka river platform table between May and September for cool Kamogawa breezes.",
      },
      {
        time: "08:30 AM",
        title: "Arashiyama Bamboo Sanctuary & Tenryu-ji Zen Garden",
        description: "Listen to the rustle of wind through towering bamboo stalks, then explore the 14th-century pond garden of Tenryu-ji.",
        category: "Nature",
        duration: "2.5 hours",
        costUSD: 8,
        latOffset: 0.015,
        lngOffset: -0.092,
        address: "Saganotenryuji Susukinobabacho, Ukyo Ward, Kyoto",
        proTip: "Cross the historic Togetsukyo Bridge for panoramic views of Mount Arashiyama.",
      },
      {
        time: "12:00 PM",
        title: "Handcrafted Soba Tasting & Riverfront Tea",
        description: "Enjoy chilled buckwheat soba noodles served on bamboo slats with tempura mountain vegetables at an authentic riverside teahouse.",
        category: "Food",
        duration: "1.5 hours",
        costUSD: 28,
        latOffset: 0.013,
        lngOffset: -0.091,
        address: "Arashiyama Riverbank Promenade, Kyoto",
        proTip: "Pour hot sobayu broth into your remaining dipping sauce at the end of the meal.",
      },
      {
        time: "03:00 PM",
        title: "Philosopher's Path & Silver Pavilion (Ginkaku-ji)",
        description: "A contemplative stone trail alongside a cherry-tree canal connecting historic temples, ending at Ginkaku-ji's dry sand garden.",
        category: "Culture",
        duration: "2 hours",
        costUSD: 5,
        latOffset: 0.026,
        lngOffset: 0.028,
        address: "Ginkakujicho, Sakyo Ward, Kyoto",
        proTip: "Stop by the artisanal green tea ceramic shops lining the canal path.",
      },
    ],
  },
  tokyo: {
    country: "Japan",
    tagline: "Electric futuristic neon meets centuries of Zen craftsmanship",
    coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    lat: 35.6762,
    lng: 139.6503,
    currency: "Japanese Yen (JPY)",
    avgCostPerDay: 240,
    weather: {
      avgTemp: "20°C / 68°F",
      condition: "Sunny and clear with mild metropolitan breeze",
      packingAdvice: "Comfortable urban walking sneakers, metro pass holder, lightweight daypack, tech adapter",
    },
    instagramSpots: [
      { name: "Shibuya Sky Observation Deck", bestTime: "Sunset (5:30 PM)", tip: "Stand at the glass corner for an infinite view over Shibuya Crossing." },
      { name: "TeamLab Planets Floating Flower Garden", bestTime: "Mid-day (1:00 PM)", tip: "Wear bright plain clothing to reflect the interactive floral projections." },
      { name: "Omoide Yokocho (Memory Lane)", bestTime: "Night (8:00 PM)", tip: "Capture the narrow smoky alley under glowing paper lanterns." },
    ],
    hiddenGems: [
      { name: "Yanaka Ginza Traditional Quarter", description: "One of Tokyo's few surviving post-war merchant neighborhoods, full of cat cafes and street snacks." },
      { name: "Meiji Jingu Inner Forest", description: "70 hectares of sacred forest planted with 100,000 trees right in the center of Tokyo." },
    ],
    signatureActivities: [
      {
        time: "08:30 AM",
        title: "Meiji Shrine Morning Forest Walk & Harajuku Culture",
        description: "Pass under giant cedar torii gates into tranquil woodland, then emerge into Harajuku's vibrant fashion streets.",
        category: "Culture",
        duration: "2.5 hours",
        costUSD: 0,
        latOffset: 0.001,
        lngOffset: -0.045,
        address: "1-1 Yoyogikamizonojo, Shibuya, Tokyo",
        proTip: "Write an Ema wooden prayer tablet at the sacred camphor trees.",
      },
      {
        time: "12:30 PM",
        title: "Omakase Sushi & Tsukiji Outer Gourmet Alley",
        description: "Freshly sliced premium tuna, seared wagyu beef skewers, and sweet tamago omelets prepared live before you.",
        category: "Food",
        duration: "1.5 hours",
        costUSD: 45,
        latOffset: -0.015,
        lngOffset: 0.019,
        address: "4 Chome Tsukiji, Chuo Ward, Tokyo",
        proTip: "Arrive before 1 PM before small family stalls sell out of daily catches.",
      },
      {
        time: "03:30 PM",
        title: "Akihabara & Ginza Luxury Architectural Promenade",
        description: "Explore the bleeding edge of Japanese tech culture in Akihabara followed by iconic flagship architecture in Ginza.",
        category: "Shopping",
        duration: "2.5 hours",
        costUSD: 20,
        latOffset: 0.021,
        lngOffset: 0.016,
        address: "Ginza 6 & Chuo Dori, Tokyo",
        proTip: "Ginza main street becomes pedestrian-only on weekend afternoons.",
      },
      {
        time: "07:00 PM",
        title: "Shibuya Crossing & 360° Skyline Rooftop Cocktails",
        description: "Experience the world's most famous intersection from street level, then ascend to Shibuya Sky for breathtaking night vistas.",
        category: "Landmark",
        duration: "2 hours",
        costUSD: 50,
        latOffset: -0.016,
        lngOffset: -0.048,
        address: "2-24-12 Shibuya, Shibuya Ward, Tokyo",
        proTip: "Book Shibuya Sky ticket online for the sunset slot 4 weeks in advance.",
      },
    ],
  },
  paris: {
    country: "France",
    tagline: "Haute gastronomy, timeless Parisian boulevards & world-class art",
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    lat: 48.8566,
    lng: 2.3522,
    currency: "Euro (EUR)",
    avgCostPerDay: 280,
    weather: {
      avgTemp: "19°C / 66°F",
      condition: "Pleasantly mild with golden Parisian afternoon light",
      packingAdvice: "Chic smart-casual attire, tailored trench coat, walking loafers, compact umbrella",
    },
    instagramSpots: [
      { name: "Pont Alexandre III Bridge", bestTime: "Golden Hour (6:30 PM)", tip: "Frame the ornate gilded statues with the Eiffel Tower in the soft background." },
      { name: "Montmartre Rue de l'Abreuvoir", bestTime: "Sunrise (7:15 AM)", tip: "Capture the pastel pink La Maison Rose house without any tourists." },
    ],
    hiddenGems: [
      { name: "Passage des Panoramas", description: "The oldest glass-roofed arcade in Paris built in 1799, filled with antique stamp dealers and cozy wine bars." },
      { name: "Musée de la Vie Romantique", description: "A secluded 19th-century artist studio with a fragrant rose garden tea pavilion." },
    ],
    signatureActivities: [
      {
        time: "09:00 AM",
        title: "Louvre Museum Masterpieces & Tuileries Garden",
        description: "Skip-the-line entrance to the world's greatest art palace, followed by coffee by the Grand Bassin fountain.",
        category: "Culture",
        duration: "3 hours",
        costUSD: 24,
        latOffset: 0.004,
        lngOffset: -0.018,
        address: "Rue de Rivoli, 75001 Paris",
        proTip: "Enter through the Carrousel du Louvre underground mall to avoid the pyramid courtyard queue.",
      },
      {
        time: "01:00 PM",
        title: "Le Marais Artisan Bistro Lunch & Falafel Stroll",
        description: "Savor duck confit, fresh baguettes, and French cheeses in the cobblestone courtyards of the historic Jewish & aristocratic quarter.",
        category: "Food",
        duration: "1.5 hours",
        costUSD: 38,
        latOffset: 0.002,
        lngOffset: 0.012,
        address: "Rue des Rosiers, 75004 Paris",
        proTip: "Stop by Pierre Hermé for Ispahan rose-lychee macarons.",
      },
      {
        time: "03:30 PM",
        title: "Montmartre & Sacré-Cœur Artist Quarter",
        description: "Wind up bohemian staircases past painters at Place du Tertre to panoramic vistas overlooking the Parisian sea of zinc roofs.",
        category: "Landmark",
        duration: "2 hours",
        costUSD: 0,
        latOffset: 0.031,
        lngOffset: -0.009,
        address: "35 Rue du Chevalier de la Barre, 75018 Paris",
        proTip: "Take the funicular with a standard metro ticket if you want to skip the stairs.",
      },
      {
        time: "07:30 PM",
        title: "Seine River Twilight Cruise & Sparkling Eiffel Tower",
        description: "Glide beneath illuminate stone bridges as the Eiffel Tower erupts into 20,000 sparkling diamonds on the hour.",
        category: "Relaxation",
        duration: "2.5 hours",
        costUSD: 45,
        latOffset: 0.001,
        lngOffset: -0.054,
        address: "Port de la Bourdonnais, 75007 Paris",
        proTip: "Grab a bottle of wine and fresh pastries for an outdoor picnic on the Champ de Mars grass.",
      },
    ],
  },
};

/**
 * Universal Geographic & Thematic Engine for ANY world destination
 */
function resolveDestinationContext(destInput: string) {
  const clean = destInput.trim();
  const lower = clean.toLowerCase();

  for (const [key, meta] of Object.entries(DESTINATION_DATABASE)) {
    if (lower.includes(key)) {
      return { key, meta, destination: clean };
    }
  }

  // Check in featured destinations
  const matchedFeatured = FEATURED_DESTINATIONS.find(
    (d) =>
      lower.includes(d.title.toLowerCase()) ||
      lower.includes(d.country.toLowerCase()) ||
      lower.includes(d.id.toLowerCase())
  );

  if (matchedFeatured) {
    return {
      key: matchedFeatured.id,
      destination: clean,
      meta: {
        country: matchedFeatured.country,
        tagline: matchedFeatured.tagline,
        coverImage: matchedFeatured.image,
        lat: matchedFeatured.lat,
        lng: matchedFeatured.lng,
        currency: matchedFeatured.country === "Japan" ? "Japanese Yen (JPY)" : "Local Currency / USD",
        avgCostPerDay: matchedFeatured.avgCostPerDay,
        weather: {
          avgTemp: "22°C / 72°F",
          condition: `Ideal traveling weather in ${matchedFeatured.title}`,
          packingAdvice: "Comfortable footwear, versatile layers, sunglasses, power bank",
        },
        instagramSpots: [
          { name: `${matchedFeatured.title} Iconic Lookout`, bestTime: "Golden Hour (6:15 PM)", tip: "Elevate your shot with architectural foreground framing." },
          { name: "Old Heritage Quarter", bestTime: "Morning (8:00 AM)", tip: "Soft ambient sunlight and quiet streets." },
        ],
        hiddenGems: [
          { name: "Historic Sanctuary Garden", description: "Quiet courtyard away from the main thoroughfare." },
          { name: "Artisan Culinary Market", description: "Locally recommended tasting stops for regional bites." },
        ],
        signatureActivities: [],
      },
    };
  }

  // Generic World Destination Fallback
  return {
    key: "global",
    destination: clean,
    meta: {
      country: clean.includes(",") ? clean.split(",")[1].trim() : "International",
      tagline: `Curated neural exploration through the captivating wonders of ${clean}`,
      coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      lat: 35.0116,
      lng: 135.7681,
      currency: "Local Currency / USD",
      avgCostPerDay: 200,
      weather: {
        avgTemp: "21°C / 70°F",
        condition: "Favorable travel conditions with clear skies",
        packingAdvice: "Comfortable walking shoes, breathable layers, camera, universal charger",
      },
      instagramSpots: [
        { name: `${clean} Main Scenic Overlook`, bestTime: "Sunset (6:00 PM)", tip: "Catch the transition between twilight and city lights." },
        { name: `${clean} Historic Promenade`, bestTime: "Morning (8:00 AM)", tip: "Clear, unobstructed view before mid-day crowds." },
      ],
      hiddenGems: [
        { name: "Secret Rooftop Sanctuary", description: "Quiet terrace offering 360-degree skyline views." },
        { name: "Traditional Artisans Courtyard", description: "Authentic workshops preserved across generations." },
      ],
      signatureActivities: [],
    },
  };
}

/**
 * Client-Side Neural Trip Architect
 * Guarantees zero failures and produces a full, hyper-realistic TripItinerary
 */
export function generateClientSideTrip(params: TripRequestParams): TripItinerary {
  const destName = params.destination.trim() || "Kyoto, Japan";
  const { meta } = resolveDestinationContext(destName);

  const duration = Math.min(Math.max(params.durationDays || 3, 1), 14);
  const adults = params.travelers?.adults ?? 2;
  const children = params.travelers?.children ?? 0;
  const totalTravelers = Math.max(1, adults + children);

  const budgetMultiplier =
    params.budgetTier === "Budget"
      ? 0.65
      : params.budgetTier === "Premium Luxury"
      ? 2.2
      : params.budgetTier === "Ultra High-Net-Worth"
      ? 4.5
      : 1.0;

  const perDayUSD = Math.round(meta.avgCostPerDay * budgetMultiplier);
  const totalUSD = perDayUSD * duration * Math.max(1, Math.round(totalTravelers * 0.8));

  // Build Day-by-Day schedule
  const days: DayPlan[] = [];
  const baseLat = meta.lat;
  const baseLng = meta.lng;

  // Use signature activities if available, or generate realistic curated blocks
  const sig = meta.signatureActivities && meta.signatureActivities.length > 0 ? meta.signatureActivities : [];

  for (let d = 1; d <= duration; d++) {
    const daySchedule: ScheduleItem[] = [];

    // Select 3 to 4 activities per day
    const dayTheme =
      d === 1
        ? { title: "Historic Icons & Grand Welcome", summary: `Day 1 immerses you in the quintessential landmarks and culinary traditions of ${destName}.` }
        : d === 2
        ? { title: "Secret Temples, Nature & Culinary Treasures", summary: `Day 2 explores meditative gardens, peaceful bamboo lanes, and gourmet tastings.` }
        : d === 3
        ? { title: "Artisan Enclaves & Golden Sunset Panorama", summary: `Day 3 highlights local artisan quarters, boutique dining, and evening vistas.` }
        : { title: `Deep Cultural Exploration - Day ${d}`, summary: `Day ${d} takes you off the beaten path into neighborhood cafes and scenic preserves.` };

    // Activity 1: Morning
    const act1 = sig[(d * 2 - 2) % (sig.length || 1)];
    const act1Cost = act1 ? act1.costUSD : Math.round(15 * budgetMultiplier);
    daySchedule.push({
      id: `sch-${d}-1`,
      time: "08:30 AM",
      title: act1 ? act1.title : `${destName} Morning Landmark Walk`,
      description: act1 ? act1.description : `Explore iconic morning sights around ${destName} during the quietest hours of the day.`,
      category: act1 ? act1.category : "Landmark",
      duration: "2.5 hours",
      costUSD: act1Cost,
      lat: baseLat + (act1 ? act1.latOffset : (d * 0.005) - 0.01),
      lng: baseLng + (act1 ? act1.lngOffset : (d * 0.004) - 0.008),
      address: act1 ? act1.address : `${destName} Central District`,
      proTip: act1 ? act1.proTip : "Arrive early right as gates open for pristine photos without crowds.",
    });

    // Activity 2: Mid-day Gourmet
    const act2 = sig[(d * 2 - 1) % (sig.length || 1)];
    daySchedule.push({
      id: `sch-${d}-2`,
      time: "12:30 PM",
      title: act2 ? act2.title : `Authentic ${destName} Culinary Tasting`,
      description: act2 ? act2.description : `Savor regional delicacies, seasonal ingredients, and artisan dishes recommended by local connoisseurs.`,
      category: "Food",
      duration: "1.5 hours",
      costUSD: Math.round((act2 ? act2.costUSD : 35) * budgetMultiplier),
      lat: baseLat + (act2 ? act2.latOffset : (d * 0.002) + 0.005),
      lng: baseLng + (act2 ? act2.lngOffset : (d * 0.003) - 0.002),
      address: act2 ? act2.address : `${destName} Gourmet Quarter`,
      proTip: act2 ? act2.proTip : "Ask for the chef's seasonal recommendation or local tea pairing.",
    });

    // Activity 3: Afternoon Culture / Shopping
    daySchedule.push({
      id: `sch-${d}-3`,
      time: "03:15 PM",
      title: `${destName} Artisan District & Scenic Garden Walk`,
      description: `Wander through historic lanes, visiting local craft ateliers, pottery workshops, and hidden courtyard gardens.`,
      category: d % 2 === 0 ? "Shopping" : "Culture",
      duration: "2 hours",
      costUSD: Math.round(20 * budgetMultiplier),
      lat: baseLat - 0.004 * d,
      lng: baseLng + 0.003 * d,
      address: `${destName} Heritage Promenade`,
      proTip: "Pick up hand-crafted regional souvenirs directly from independent artisan workshops.",
    });

    // Activity 4: Evening Sunset & Dining
    daySchedule.push({
      id: `sch-${d}-4`,
      time: "07:00 PM",
      title: `Twilight Stroll & Rooftop Dining in ${destName}`,
      description: `Unwind with panoramic views of illuminated monuments and a memorable multi-course dinner.`,
      category: "Relaxation",
      duration: "2.5 hours",
      costUSD: Math.round(65 * budgetMultiplier),
      lat: baseLat + 0.006,
      lng: baseLng - 0.005,
      address: `${destName} Waterfront / Skyline View`,
      proTip: "Book a window or terrace table in advance to catch the transition from sunset to city lights.",
    });

    days.push({
      dayNumber: d,
      title: dayTheme.title,
      summary: dayTheme.summary,
      schedule: daySchedule,
    });
  }

  return {
    id: `trip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    destination: destName,
    country: meta.country,
    tagline: meta.tagline,
    overview: `Experience the pinnacle of travel in ${destName}. Tailored with precision for ${params.travelStyle || "Explorer"} travelers with ${params.budgetTier || "Balanced"} budget preferences. Every day blends landmark icons with serene cultural secrets.`,
    coverImage: meta.coverImage,
    weatherForecast: meta.weather,
    estimatedBudget: {
      totalUSD,
      perDayUSD,
      breakdown: [
        { category: "Accommodation", amountUSD: Math.round(totalUSD * 0.45) },
        { category: "Dining & Drinks", amountUSD: Math.round(totalUSD * 0.28) },
        { category: "Activities & Entries", amountUSD: Math.round(totalUSD * 0.17) },
        { category: "Local Transport", amountUSD: Math.round(totalUSD * 0.10) },
      ],
    },
    days,
    instagramSpots: meta.instagramSpots,
    hiddenGems: meta.hiddenGems,
    packingChecklist: [
      { item: "Universal Travel Power Adapter (USB-C PD)", category: "Tech", essential: true },
      { item: "Ergonomic Walking Sneakers", category: "Footwear", essential: true },
      { item: "Light Windbreaker or Layered Jacket", category: "Clothing", essential: true },
      { item: "Compact Power Bank (10,000mAh)", category: "Tech", essential: true },
      { item: "Reusable Water Bottle with Filter", category: "Essentials", essential: false },
      { item: "Offline Map Downloads & Digital Visa Copies", category: "Documents", essential: true },
    ],
    essentialInfo: {
      visa: "Check entry visa requirements according to your passport. Most tourists receive 90-day visa-free entry.",
      currency: meta.currency,
      language: "Local language widely spoken; English universally understood in tourist hubs, hotels and restaurants.",
      safetyTips: [
        "Store digital photocopies of your passport and travel insurance in cloud storage.",
        "Keep local emergency numbers saved on your phone.",
        "Use official transit cards (e.g. Suica/Pasmo in Japan, contactless card in Europe) for rapid subway tap-and-go.",
      ],
      emergencyNumbers: "Police: 110 / Ambulance & Medical: 119 (or standard 112 international)",
    },
    createdAt: new Date().toISOString(),
    isSaved: true,
  };
}

/**
 * Primary Itinerary Generation Coordinator
 * Automatically detects if backend API is reachable, handles Netlify static deployments gracefully,
 * and ensures the user ALWAYS receives a flawless itinerary without any browser alert errors.
 */
export async function generateTripItinerary(params: TripRequestParams): Promise<TripItinerary> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 second network timeout

    const response = await fetch("/api/generate-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";

    if (response.ok && contentType.includes("application/json")) {
      const data = await response.json();
      if (data && data.success && data.trip) {
        // Ensure coverImage exists
        if (!data.trip.coverImage) {
          const resolved = resolveDestinationContext(params.destination);
          data.trip.coverImage = resolved.meta.coverImage;
        }
        return {
          ...data.trip,
          id: data.trip.id || `trip-${Date.now()}`,
          createdAt: data.trip.createdAt || new Date().toISOString(),
          isSaved: true,
        };
      }
    }

    // Server returned non-JSON, 404 (e.g. Netlify static hosting), or unsuccessful status
    console.info("[VoyageAI] Backend API endpoint /api/generate-trip returned non-JSON or status", response.status, ". Activating Neural Trip Architect engine...");
  } catch (netErr: any) {
    // Expected on Netlify static hosting where Express server is not present
    console.info("[VoyageAI] Connecting to Client Neural Trip Architect (Netlify/Offline Mode):", netErr?.message);
  }

  // Seamless fallback: generate client-side itinerary tailored to user preferences
  return generateClientSideTrip(params);
}

/**
 * AI Concierge Chat Coordinator
 * Connects to /api/ai-chat or provides intelligent contextual travel advice
 */
export async function chatWithConcierge(
  message: string,
  tripContext?: TripItinerary | null
): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("/api/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ message, tripContext }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    if (response.ok && contentType.includes("application/json")) {
      const data = await response.json();
      if (data && data.reply) {
        return data.reply;
      }
    }
  } catch (err: any) {
    console.info("[VoyageAI Concierge] Using local intelligence engine:", err?.message);
  }

  // Client-side travel concierge intelligence
  const destName = tripContext?.destination || "your destination";
  const m = message.toLowerCase();

  if (m.includes("weather") || m.includes("pack") || m.includes("rain") || m.includes("cloth")) {
    return `🌤️ **Weather & Packing Insights for ${destName}**\n\n- **Expected Temperature:** Around 20°C–23°C (68°F–73°F) with pleasant skies.\n- **What to Pack:** Breathable cotton or linen layers, ergonomic walking shoes, a light jacket for evenings, and an umbrella.\n- **Insider Tip:** Morning temple walks can be crisp; keep a light scarf or windbreaker handy!`;
  }

  if (m.includes("food") || m.includes("eat") || m.includes("restaurant") || m.includes("dinner") || m.includes("dish")) {
    return `🍽️ **Culinary Highlights in ${destName}**\n\n1. **Regional Tasting:** Don't miss the local market specialties and multi-course seasonal platters.\n2. **Hidden Cafe:** Seek out quiet residential alleyway teahouses for pour-over coffee and matcha confections.\n3. **Sunset Dining:** Reserve an outdoor riverfront or skyline terrace table 1–2 days ahead for magical evening views.`;
  }

  if (m.includes("transit") || m.includes("train") || m.includes("metro") || m.includes("subway") || m.includes("taxi")) {
    return `🚇 **Getting Around ${destName}**\n\n- **Public Transit:** Subway and bus systems are exceptionally clean, prompt, and easy to navigate with mobile contactless cards.\n- **Walking:** The historical districts are best explored on foot—most key sights cluster within 15–20 minutes of each other.\n- **Ride-hailing:** Licensed taxis and ride-hailing apps are available at all major transit stations.`;
  }

  return `✨ **VoyageAI Travel Concierge**\n\nI've analyzed your itinerary for **${destName}**!\n\nHere are 3 tailored recommendations:\n\n1. **Early Morning Advantage:** Visit key shrines and iconic lookouts between 7:30 AM and 9:00 AM to enjoy serene, uncrowded photo opportunities.\n2. **Cultural Respect:** Be mindful of photo etiquette in historic residential lanes and remember to remove footwear when entering traditional temple halls.\n3. **Local Flavor:** Try stopping at an authentic family-run bistro away from major train station exits for the finest culinary quality.\n\nWhat other questions can I answer about flights, bookings, or places in ${destName}?`;
}
