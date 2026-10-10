import { jsPDF } from "jspdf";
import { TripItinerary, DestinationCardData } from "../types";
import { getCurrencyInfo, formatCurrency } from "../data/currencies";
import { FEATURED_DESTINATIONS } from "../data/destinations";

export interface PlaceReportData {
  destination: string;
  country: string;
  tagline: string;
  overview: string;
  avgCostPerDayUSD: number;
  bestMonths: string;
  days: {
    day: number;
    title: string;
    focus: string;
    schedule: {
      time: string;
      title: string;
      category: string;
      location: string;
      description: string;
      estCostUSD: number;
    }[];
  }[];
  restaurants: {
    name: string;
    cuisine: string;
    priceTier: string;
    mustTry: string;
    address: string;
  }[];
  practicalInfo: {
    weather: string;
    packing: string[];
    emergencyNumber: string;
    visaNote: string;
    localEtiquette: string[];
  };
}

export function buildDefaultDays(title: string) {
  return [
    {
      day: 1,
      title: "Historic Heart & Iconic Landmarks",
      focus: "Heritage, Architecture & Local Orientation",
      schedule: [
        {
          time: "09:00 AM",
          title: `${title} Central Heritage Walk`,
          category: "Culture",
          location: `Old Town District, ${title}`,
          description: `Begin your exploration through the historic core of ${title}, visiting renowned plazas and historic architecture.`,
          estCostUSD: 25,
        },
        {
          time: "01:00 PM",
          title: "Traditional Artisan Lunch",
          category: "Dining",
          location: `Historic Marketplace, ${title}`,
          description: "Savor regional delicacies prepared by multi-generational food artisans.",
          estCostUSD: 45,
        },
        {
          time: "03:30 PM",
          title: "Panoramic Sunset Viewpoint & Garden",
          category: "Sightseeing",
          location: `Overlook Promenade, ${title}`,
          description: "Experience golden hour views across the skyline and natural terrain.",
          estCostUSD: 20,
        },
      ],
    },
    {
      day: 2,
      title: "Artistic Treasures & Hidden Gems",
      focus: "Galleries, Coastal/Scenic Paths & Craft Quarters",
      schedule: [
        {
          time: "09:30 AM",
          title: "Modern & Contemporary Cultural Center",
          category: "Arts",
          location: `Arts Quarter, ${title}`,
          description: "Discover curated collections and immersive exhibits highlighting regional artistry.",
          estCostUSD: 30,
        },
        {
          time: "01:30 PM",
          title: "Botanical or Coastal Trail Exploration",
          category: "Nature",
          location: `Scenic Parkway, ${title}`,
          description: "A leisurely afternoon stroll taking in serene natural landscapes and fresh air.",
          estCostUSD: 15,
        },
        {
          time: "07:00 PM",
          title: "Chef's Table Culinary Experience",
          category: "Dining",
          location: `Gastronomy Avenue, ${title}`,
          description: "An evening dedicated to tasting seasonal local ingredients and fine pairings.",
          estCostUSD: 95,
        },
      ],
    },
    {
      day: 3,
      title: "Local Markets & Authentic Neighborhoods",
      focus: "Shopping, Street Food & Relaxed Excursions",
      schedule: [
        {
          time: "10:00 AM",
          title: "Artisan Marketplace & Souvenir Discovery",
          category: "Shopping",
          location: `Central Bazaar, ${title}`,
          description: "Browse local handcrafted ceramics, textiles, and specialty gourmet gifts.",
          estCostUSD: 60,
        },
        {
          time: "02:00 PM",
          title: "Sanctuary Spa or Tea House Ritual",
          category: "Wellness",
          location: `Zen Sanctuary District, ${title}`,
          description: "Rejuvenate before departure with a traditional wellness or tea experience.",
          estCostUSD: 55,
        },
      ],
    },
  ];
}

/**
 * Automatically builds comprehensive place report data for any destination
 */
export function buildPlaceReportData(input: TripItinerary | DestinationCardData | string): PlaceReportData {
  if (typeof input !== "string" && "days" in input) {
    // Already a full TripItinerary
    const trip = input as TripItinerary;
    const estDays = Math.max(1, trip.days?.length || 1);
    const avgCost =
      trip.estimatedBudget?.perDayUSD ||
      (trip.estimatedBudget?.totalUSD ? Math.round(trip.estimatedBudget.totalUSD / estDays) : 220);

    const mappedDays = (trip.days || []).map((d: any, idx: number) => ({
      day: d.dayNumber || d.day || idx + 1,
      title: d.title || `Day ${idx + 1}`,
      focus: d.summary || d.focus || "Cultural Highlights & Heritage Exploration",
      schedule: (d.schedule || []).map((s: any) => ({
        time: s.time || "10:00 AM",
        title: s.title || "Sightseeing Discovery",
        category: s.category || "Sightseeing",
        location: s.address || s.location || trip.destination,
        description: s.description || s.proTip || "Explore iconic landmarks and scenic vistas.",
        estCostUSD: s.costUSD ?? s.estCostUSD ?? 25,
      })),
    }));

    // Extract food / dining from schedule if present
    const foodItems = (trip.days || []).flatMap((d: any) =>
      (d.schedule || []).filter((s: any) => s.category === "Food")
    );
    const mappedRestaurants =
      foodItems.length > 0
        ? foodItems.slice(0, 4).map((f: any) => ({
            name: f.title,
            cuisine: "Regional Local Culinary",
            priceTier: (f.costUSD || f.estCostUSD || 30) > 60 ? "$$$" : (f.costUSD || f.estCostUSD || 30) > 25 ? "$$" : "$",
            mustTry: f.proTip || "Chef's daily specialty recommendation",
            address: f.address || trip.destination,
          }))
        : [
            {
              name: `${trip.destination} Signature Bistro`,
              cuisine: "Local Heritage Cuisine",
              priceTier: "$$",
              mustTry: "Chef's Tasting & Seasonal Local Specialties",
              address: `Central District, ${trip.destination}`,
            },
            {
              name: "Old Quarter Artisan Cafe",
              cuisine: "Bakery & Specialty Coffee",
              priceTier: "$",
              mustTry: "Freshly Baked Regional Delicacies & Pour-Over",
              address: `Market Square, ${trip.destination}`,
            },
          ];

    return {
      destination: trip.destination,
      country: trip.country,
      tagline: trip.tagline || `Exclusive AI Travel & Exploration Intelligence for ${trip.destination}`,
      overview:
        trip.overview ||
        `${trip.destination} offers an extraordinary blend of cultural heritage, scenic landmarks, and culinary excellence.`,
      avgCostPerDayUSD: avgCost,
      bestMonths: trip.weatherForecast?.condition
        ? `${trip.weatherForecast.avgTemp} (${trip.weatherForecast.condition})`
        : "Spring & Autumn Recommended",
      days: mappedDays.length > 0 ? mappedDays : buildDefaultDays(trip.destination),
      restaurants: mappedRestaurants,
      practicalInfo: {
        weather: trip.weatherForecast
          ? `${trip.weatherForecast.avgTemp} • ${trip.weatherForecast.condition}. ${trip.weatherForecast.packingAdvice || ""}`
          : "Pleasant seasonal variations; layer comfortable clothing.",
        packing:
          trip.packingChecklist && trip.packingChecklist.length > 0
            ? trip.packingChecklist.slice(0, 6).map((p: any) => (typeof p === "string" ? p : p.item))
            : [
                "Comfortable walking shoes",
                "Universal power adapter",
                "Light rain jacket",
                "Portable power bank",
                "Daypack for excursions",
              ],
        emergencyNumber: trip.essentialInfo?.emergencyNumbers || "112 / 911 / Local emergency services",
        visaNote: trip.essentialInfo?.visa || "Check valid passport requirement (at least 6 months validity).",
        localEtiquette:
          trip.essentialInfo?.safetyTips && trip.essentialInfo.safetyTips.length > 0
            ? trip.essentialInfo.safetyTips
            : [
                "Respect local dress codes when visiting temples or religious sites.",
                "Carry a small amount of local currency cash for smaller establishments.",
                "Always ask permission before photographing residents or private ceremonies.",
              ],
      },
    };
  }

  // Check if it's a DestinationCardData or we can find it in FEATURED_DESTINATIONS
  let title = "";
  let country = "";
  let avgCost = 180;
  let bestMonths = "Spring & Autumn";
  let tagline = "";

  if (typeof input === "object" && "title" in input) {
    const card = input as DestinationCardData;
    title = card.title;
    country = card.country;
    avgCost = card.avgCostPerDay || 180;
    bestMonths = card.bestMonths || "Mar - May, Sep - Nov";
    tagline = card.tagline || "Curated global travel discovery experience";
  } else {
    // String input e.g. "Kyoto, Japan"
    const str = input.toString();
    const parts = str.split(",");
    title = parts[0].trim();
    country = parts[1] ? parts[1].trim() : "International";

    const found = FEATURED_DESTINATIONS.find(
      (d) =>
        d.title.toLowerCase() === title.toLowerCase() ||
        d.id.toLowerCase() === title.toLowerCase() ||
        str.toLowerCase().includes(d.title.toLowerCase())
    );
    if (found) {
      title = found.title;
      country = found.country;
      avgCost = found.avgCostPerDay;
      bestMonths = found.bestMonths;
      tagline = found.tagline;
    }
  }

  // Generate rich place report for the place
  return {
    destination: title,
    country: country || "International",
    tagline: tagline || `The Ultimate Architectural, Cultural & Gastronomic Guide to ${title}`,
    overview: `${title} is renowned for its captivating landscapes, rich cultural traditions, and vibrant dining scene. This comprehensive report outlines key landmarks, optimal day-by-day routes, culinary recommendations, and practical travel guidance.`,
    avgCostPerDayUSD: avgCost,
    bestMonths: bestMonths,
    days: buildDefaultDays(title),
    restaurants: [
      {
        name: `${title} Heritage Dining Hall`,
        cuisine: "Regional Traditional",
        priceTier: "$$",
        mustTry: "Signature Slow-Cooked Specialties",
        address: `12 Heritage Way, ${title}`,
      },
      {
        name: "L'Atelier Coastal & Garden",
        cuisine: "Modern Fusion",
        priceTier: "$$$",
        mustTry: "Seasonal Tasting Menu with Local Herbs",
        address: `45 Panorama Blvd, ${title}`,
      },
      {
        name: "Old Quarter Artisan Cafe",
        cuisine: "Bakery & Specialty Coffee",
        priceTier: "$",
        mustTry: "Freshly Baked Pastries & Hand-Pour Coffee",
        address: `8 Market Square, ${title}`,
      },
    ],
    practicalInfo: {
      weather: "Seasonal temperatures average 18°C–25°C (64°F–77°F). Mild breezes.",
      packing: [
        "Ergonomic walking footwear",
        "Universal power adapter & power bank",
        "Lightweight waterproof jacket",
        "Smart-casual attire for evening dining",
        "Travel document organizer",
      ],
      emergencyNumber: "112 / 911 (Global Standard Emergency Services)",
      visaNote: "Check passport expiration (must have 6+ months validity remaining).",
      localEtiquette: [
        "A courteous greeting in the local language is highly appreciated.",
        "Tipping customs vary; check restaurant service charge inclusions.",
        "Keep noise levels modest in religious sanctuaries and public transit.",
      ],
    },
  };
}

/**
 * Converts a place card or search string into a full TripItinerary object for saving
 */
export function createTripItineraryFromPlace(input: DestinationCardData | string): TripItinerary {
  const data = buildPlaceReportData(input);
  let coverImage = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80";

  if (typeof input === "object" && "image" in input) {
    coverImage = (input as DestinationCardData).image;
  } else {
    const found = FEATURED_DESTINATIONS.find(
      (d) =>
        d.title.toLowerCase() === data.destination.toLowerCase() ||
        d.id.toLowerCase() === data.destination.toLowerCase()
    );
    if (found?.image) coverImage = found.image;
  }

  return {
    id: `trip-place-${data.destination.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`,
    destination: data.destination,
    country: data.country,
    tagline: data.tagline,
    overview: data.overview,
    coverImage,
    weatherForecast: {
      avgTemp: "22°C / 72°F",
      condition: data.bestMonths,
      packingAdvice: data.practicalInfo.packing.join(", "),
    },
    estimatedBudget: {
      totalUSD: data.avgCostPerDayUSD * Math.max(1, data.days.length),
      perDayUSD: data.avgCostPerDayUSD,
      breakdown: [
        { category: "Accommodation", amountUSD: Math.round(data.avgCostPerDayUSD * 0.45 * data.days.length) },
        { category: "Dining & Food", amountUSD: Math.round(data.avgCostPerDayUSD * 0.25 * data.days.length) },
        { category: "Activities & Sights", amountUSD: Math.round(data.avgCostPerDayUSD * 0.2 * data.days.length) },
        { category: "Local Transport", amountUSD: Math.round(data.avgCostPerDayUSD * 0.1 * data.days.length) },
      ],
    },
    days: data.days.map((d) => ({
      dayNumber: d.day,
      title: d.title,
      summary: d.focus,
      schedule: d.schedule.map((s, idx) => {
        let cat: "Food" | "Landmark" | "Culture" | "Nature" | "Shopping" | "Relaxation" = "Landmark";
        const rawCat = (s.category || "").toLowerCase();
        if (rawCat.includes("dining") || rawCat.includes("food")) cat = "Food";
        else if (rawCat.includes("nature") || rawCat.includes("park")) cat = "Nature";
        else if (rawCat.includes("shop") || rawCat.includes("market")) cat = "Shopping";
        else if (rawCat.includes("wellness") || rawCat.includes("spa")) cat = "Relaxation";
        else if (rawCat.includes("art") || rawCat.includes("culture")) cat = "Culture";

        return {
          id: `sch-${d.day}-${idx}`,
          time: s.time,
          title: s.title,
          description: s.description,
          category: cat,
          duration: "1.5 hours",
          costUSD: s.estCostUSD,
          lat: 0,
          lng: 0,
          address: s.location,
          proTip: `Recommended visit for best experience: ${s.time}`,
        };
      }),
    })),
    instagramSpots: [
      {
        name: `${data.destination} Heritage Viewpoint`,
        bestTime: "Golden hour (05:30 PM)",
        tip: "Bring a wide-angle lens for panoramic horizon photos.",
      },
      {
        name: `${data.destination} Historic Promenade`,
        bestTime: "Early Morning (08:00 AM)",
        tip: "Empty paths and serene morning light.",
      },
    ],
    hiddenGems: [
      {
        name: `Secret Courtyard of ${data.destination}`,
        description: "Tucked behind the historic plaza, featuring artisan stalls and traditional tea.",
      },
      {
        name: "Artisan Crafts Quarter",
        description: "Quiet alleyway with multi-generational ceramic and textile masters.",
      },
    ],
    packingChecklist: data.practicalInfo.packing.map((item, idx) => ({
      item,
      category: idx < 2 ? "Essentials" : "Clothing",
      essential: idx < 3,
    })),
    essentialInfo: {
      visa: data.practicalInfo.visaNote,
      currency: "Local currency / International cards widely accepted",
      language: "Local official language & English",
      safetyTips: data.practicalInfo.localEtiquette,
      emergencyNumbers: data.practicalInfo.emergencyNumber,
    },
    createdAt: new Date().toISOString(),
    isSaved: true,
  };
}

/**
 * Generates and triggers automatic download of a complete Place Details PDF Report
 */
export function generatePlaceReportPDF(
  placeInput: TripItinerary | DestinationCardData | string,
  currencyCode: string = "USD",
  explorerName: string = "Explorer"
): { success: boolean; filename: string; destination: string } {
  const data = buildPlaceReportData(placeInput);
  const currencyInfo = getCurrencyInfo(currencyCode);
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Helper: check page break
  const checkPageBreak = (neededHeight: number = 15) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
      addHeaderBanner(true);
    }
  };

  // Helper: Header banner
  const addHeaderBanner = (isSubsequent: boolean = false) => {
    doc.setFillColor(13, 27, 42); // Deep navy #0d1b2a
    doc.rect(0, 0, pageWidth, isSubsequent ? 18 : 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    if (isSubsequent) {
      doc.setFontSize(10);
      doc.text(`${data.destination.toUpperCase()}, ${data.country.toUpperCase()} — PLACE REPORT`, margin, 11);
      y = 26;
    } else {
      doc.setFontSize(16);
      doc.text(`${data.destination.toUpperCase()}`, margin, 13);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`${data.country} • Aetheria AI Destination Intelligence Report`, margin, 20);
      y = 38;
    }
  };

  // Helper: Section title
  const addSectionTitle = (title: string) => {
    checkPageBreak(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138); // Blue 900
    doc.text(title.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(59, 130, 246); // Blue 500
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;
  };

  // Add initial header banner
  addHeaderBanner(false);

  // METADATA BAR
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.roundedRect(margin, y, contentWidth, 20, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // Slate 700

  const estTotalDays = Math.max(1, data.days.length);
  const totalCostUSD = data.avgCostPerDayUSD * estTotalDays;
  const formattedTotalCost = formatCurrency(totalCostUSD, currencyCode);
  const formattedDailyCost = formatCurrency(data.avgCostPerDayUSD, currencyCode);

  doc.text(`PREPARED FOR: ${explorerName}`, margin + 5, y + 7);
  doc.text(`CURRENCY: ${currencyInfo.code} (${currencyInfo.symbol})`, margin + 85, y + 7);
  doc.text(`BEST SEASON: ${data.bestMonths}`, margin + 5, y + 15);
  doc.text(`EST. BUDGET: ${formattedTotalCost} (~${formattedDailyCost}/day)`, margin + 85, y + 15);
  y += 28;

  // SECTION 1: OVERVIEW & TAGLINE
  addSectionTitle("1. Destination Overview & Intelligence");
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42); // Slate 900
  const taglineLines = doc.splitTextToSize(`"${data.tagline}"`, contentWidth);
  doc.text(taglineLines, margin, y);
  y += taglineLines.length * 5 + 3;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105); // Slate 600
  const overviewLines = doc.splitTextToSize(data.overview, contentWidth);
  doc.text(overviewLines, margin, y);
  y += overviewLines.length * 5 + 8;

  // SECTION 2: CURATED DAY-BY-DAY ITINERARY SCHEDULE
  addSectionTitle("2. Recommended Day-by-Day Itinerary");

  data.days.forEach((dayItem) => {
    checkPageBreak(25);
    doc.setFillColor(238, 242, 255); // Indigo 50
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(67, 56, 202); // Indigo 700
    doc.text(`DAY ${dayItem.day}: ${dayItem.title.toUpperCase()}`, margin + 4, y + 5.5);
    y += 12;

    dayItem.schedule.forEach((item) => {
      checkPageBreak(18);
      const itemCostFormatted = formatCurrency(item.estCostUSD || 0, currencyCode);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`• [${item.time}] ${item.title}`, margin + 3, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      const costText = item.estCostUSD ? ` (${itemCostFormatted})` : "";
      doc.text(`${item.category} • ${item.location}${costText}`, margin + contentWidth - 65, y);
      y += 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(`   ${item.description}`, contentWidth - 10);
      doc.text(descLines, margin + 4, y);
      y += descLines.length * 4 + 4;
    });
    y += 3;
  });

  // SECTION 3: CULINARY HIGHLIGHTS & DINING
  addSectionTitle("3. Curated Gastronomy & Recommended Dining");
  data.restaurants.forEach((rest) => {
    checkPageBreak(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${rest.name} (${rest.priceTier})`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Cuisine: ${rest.cuisine}`, margin + 85, y);
    y += 4.5;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`  Must Try: ${rest.mustTry} | Location: ${rest.address}`, margin + 3, y);
    y += 7;
  });
  y += 3;

  // SECTION 4: PRACTICAL ESSENTIALS & LOCAL ETIQUETTE
  addSectionTitle("4. Practical Travel Essentials & Etiquette");
  checkPageBreak(25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("Weather Profile:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(data.practicalInfo.weather, margin + 32, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Emergency Contacts:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(data.practicalInfo.emergencyNumber, margin + 38, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Visa & Passport Note:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(data.practicalInfo.visaNote, margin + 40, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Local Etiquette & Advice:", margin, y);
  y += 5;
  data.practicalInfo.localEtiquette.forEach((tip) => {
    checkPageBreak(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const tipLines = doc.splitTextToSize(`• ${tip}`, contentWidth - 5);
    doc.text(tipLines, margin + 3, y);
    y += tipLines.length * 4.5 + 1.5;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.line(margin, pageHeight - 14, margin + contentWidth, pageHeight - 14);
    doc.text(
      `Aetheria AI • Place Details Report (${data.destination}, ${data.country})`,
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${totalPages}`, margin + contentWidth - 20, pageHeight - 8);
  }

  // Sanitize filename and save
  const safeTitle = data.destination.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${safeTitle}_Place_Details_Report.pdf`;
  doc.save(filename);

  return {
    success: true,
    filename,
    destination: data.destination,
  };
}
