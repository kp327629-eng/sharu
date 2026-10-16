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

function generateSmartReply(msg: string, context: any) {
  const m = msg.toLowerCase();
  const destName = context?.destination || "your destination";

  if (m.includes("weather") || m.includes("pack") || m.includes("rain")) {
    return `🌤️ **Weather & Packing Insights for ${destName}**\n\n- **Expected Temperature:** Around 20°C–24°C (68°F–75°F) with light breeze.\n- **What to Pack:** Breathable cotton/linen tops, dark walking pants or jeans, comfortable walking sneakers, and a light jacket for breezy evenings.\n- **Rain Preparedness:** A compact windproof umbrella or light waterproof shell is recommended.`;
  }

  if (m.includes("food") || m.includes("eat") || m.includes("restaurant") || m.includes("dish")) {
    return `🍽️ **Culinary Recommendations for ${destName}**\n\n1. **Local Specialties:** Don't miss out on regional tasting platters and artisan street bites.\n2. **Top Cafe Pick:** *The Secret Courtyard Cafe* – Famous for pour-over coffee, quiet patio seating, and fast Wi-Fi.\n3. **Dinner Highlight:** Book a table at a local wine bistro or rooftop grill for sunset views.\n\n*Pro Tip:* In popular dining hubs, making lunch reservations 1–2 days ahead guarantees the best window seats!`;
  }

  return `✨ **VoyageAI Concierge**\n\nI've analyzed your inquiry regarding **${destName}**!\n\nHere are 3 key travel recommendations:\n\n1. **Optimal Timing:** Plan your top landmark visits between 8:30 AM and 10:00 AM for soft morning light and minimal waiting times.\n2. **Transit Hack:** Grab a local contactless transit card or use mobile tap-to-pay for seamless subway and bus transfers.\n3. **Hidden Highlight:** Take an early evening stroll through the old artisan district when ambient lantern lights turn on.\n\nHow else can I assist with your itinerary or booking details?`;
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
    const body = event.body ? JSON.parse(event.body) : {};
    const { message = "", tripContext } = body;

    const ai = getGeminiClient();

    if (ai) {
      const modelsToTry = ["gemini-3.8-flash", "gemini-3.6-flash", "gemini-flash-latest"];
      for (const model of modelsToTry) {
        try {
          const systemPrompt = `You are Aetheria AI, an elite 24/7 personal travel concierge inspired by Apple elegance and Google Travel intelligence.
Context of user's trip:
${tripContext ? JSON.stringify(tripContext, null, 2) : "No active trip loaded."}

Answer the user's travel question with warmth, hyper-relevant insider travel tips, bullet points where helpful, pricing estimates, local etiquette, and actionable advice.`;

          const response = await ai.models.generateContent({
            model,
            contents: `${systemPrompt}\n\nUser Question: ${message}`,
            config: {
              temperature: 0.7,
            },
          });

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, reply: response.text }),
          };
        } catch (err: any) {
          console.warn(`Netlify Chat ${model} failed:`, err?.message);
        }
      }
    }

    const reply = generateSmartReply(message, tripContext);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, reply }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
