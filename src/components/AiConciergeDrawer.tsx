import React, { useState } from "react";
import { Sparkles, X, Send, Bot, User, MessageSquare, Compass, RefreshCw } from "lucide-react";
import { ChatMessage, TripItinerary } from "../types";

interface AiConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrip?: TripItinerary | null;
}

export const AiConciergeDrawer: React.FC<AiConciergeDrawerProps> = ({
  isOpen,
  onClose,
  activeTrip,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: `Hello! I'm your Aetheria 24/7 AI Travel Concierge. ${
        activeTrip
          ? `I have your active trip to **${activeTrip.destination}** loaded.`
          : "Ask me anything about flight routes, local food, culture, or itinerary recommendations!"
      }`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const promptChips = [
    `Top 3 local dishes in ${activeTrip?.destination || "Kyoto"}?`,
    "What to do if it rains today?",
    "Best quiet cafe with Wi-Fi?",
    "Local tipping etiquette?",
    "Translate 'Where is taxi?'",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          tripContext: activeTrip,
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply || "I am currently adjusting your request. How else can I assist?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "I am having trouble connecting to network services. Please check connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white dark:bg-zinc-900 border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col animate-slideInRight">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
              Aetheria Concierge
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[10px] text-zinc-500">
              {activeTrip ? activeTrip.destination : "Global Travel Companion"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col max-w-[85%] ${
              m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                m.sender === "user"
                  ? "bg-sky-500 text-white rounded-br-none"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-none border border-black/5 dark:border-white/5"
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-zinc-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-sky-500 animate-pulse p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Aetheria AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Prompt Suggestion Chips */}
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800 flex gap-1.5 overflow-x-auto scrollbar-none bg-zinc-50/50 dark:bg-zinc-900/50">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 text-[10px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-sky-500 whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your concierge..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-sky-500 text-white disabled:opacity-50 hover:bg-sky-600 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
