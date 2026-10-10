export type TravelStyle =
  | "Solo"
  | "Luxury"
  | "Family"
  | "Backpacker"
  | "Digital Nomad"
  | "Business"
  | "Adventure"
  | "Road Trip"
  | "Couples"
  | "Senior"
  | "Explorer";

export type BudgetTier = "Budget" | "Balanced" | "Premium Luxury" | "Ultra High-Net-Worth";

export interface UserPreferences {
  name: string;
  travelStyle: TravelStyle;
  budgetTier: BudgetTier;
  currency: string;
  language: string;
  country: string;
  foodPreference: string;
  travelFrequency: string;
  dreamDestinations: string[];
  accessibility: boolean;
  interests: string[];
  isOnboarded: boolean;
}

export interface ScheduleItem {
  id?: string;
  time: string;
  title: string;
  description: string;
  category: "Food" | "Landmark" | "Culture" | "Nature" | "Shopping" | "Relaxation";
  duration: string;
  costUSD: number;
  lat: number;
  lng: number;
  address: string;
  proTip: string;
  isCompleted?: boolean;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  summary: string;
  schedule: ScheduleItem[];
}

export interface BudgetCategory {
  category: string;
  amountUSD: number;
}

export interface InstagramSpot {
  name: string;
  bestTime: string;
  tip: string;
}

export interface HiddenGem {
  name: string;
  description: string;
}

export interface PackingItem {
  item: string;
  category: string;
  essential: boolean;
  checked?: boolean;
}

export interface EssentialInfo {
  visa: string;
  currency: string;
  language: string;
  safetyTips: string[];
  emergencyNumbers: string;
}

export interface TripItinerary {
  id: string;
  destination: string;
  country: string;
  tagline: string;
  overview: string;
  coverImage?: string;
  weatherForecast: {
    avgTemp: string;
    condition: string;
    packingAdvice: string;
  };
  estimatedBudget: {
    totalUSD: number;
    perDayUSD: number;
    breakdown: BudgetCategory[];
  };
  days: DayPlan[];
  instagramSpots: InstagramSpot[];
  hiddenGems: HiddenGem[];
  packingChecklist: PackingItem[];
  essentialInfo: EssentialInfo;
  createdAt: string;
  isSaved?: boolean;
}

export interface DestinationCardData {
  id: string;
  title: string;
  country: string;
  region: "Asia" | "Europe" | "Americas" | "Africa & ME" | "Oceania";
  image: string;
  rating: number;
  reviewsCount: number;
  avgCostPerDay: number;
  tags: string[];
  tagline: string;
  bestMonths: string;
  lat: number;
  lng: number;
  isTrending?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  logo: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopLocation?: string;
  priceUSD: number;
  cabinClass: "Economy" | "Premium Economy" | "Business" | "First";
  aiScore: number;
  priceTrend: "dropping" | "rising" | "stable";
  baggageIncluded: boolean;
  refundable: boolean;
}

export interface HotelOffer {
  id: string;
  name: string;
  category: "Boutique" | "5-Star Resort" | "Luxury Hotel" | "Ryokan" | "Private Villa";
  image: string;
  rating: number;
  reviewsCount: number;
  location: string;
  pricePerNightUSD: number;
  aiMatchScore: number;
  amenities: string[];
  distanceToCenter: string;
  cancellation: string;
  featuredTag?: string;
}

export interface RestaurantSpot {
  id: string;
  name: string;
  cuisine: string;
  dietaryTags: string[];
  image: string;
  rating: number;
  reviewsCount: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  avgCostUSD: number;
  location: string;
  busyStatus: "Quiet" | "Moderate" | "Busy" | "Peak";
  mustTryDish: string;
  aiScore: number;
  michelinStars?: number;
}

export interface TransportOption {
  id: string;
  type: "Ride Share" | "Metro Pass" | "Express Train" | "Private Taxi" | "Electric Bike" | "Car Rental";
  provider: string;
  estTimeMinutes: number;
  costUSD: number;
  co2SavingsKg: number;
  iconName: string;
  details: string;
  availability: "Available Now" | "2 min away" | "Scheduled";
}

