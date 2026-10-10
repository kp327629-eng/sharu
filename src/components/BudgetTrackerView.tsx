import React, { useState } from "react";
import { Wallet, Plus, DollarSign, Calculator, ArrowRightLeft, Users, PieChart, CheckCircle2 } from "lucide-react";
import { UserPreferences } from "../types";
import { ALL_CURRENCIES, getCurrencyInfo } from "../data/currencies";

interface BudgetTrackerViewProps {
  prefs?: UserPreferences;
}

export const BudgetTrackerView: React.FC<BudgetTrackerViewProps> = ({ prefs }) => {
  const userCurrency = prefs?.currency || "USD";
  const userCurrencySymbol = getCurrencyInfo(userCurrency).symbol;

  const [expenses, setExpenses] = useState([
    { id: "1", title: "Flight Tickets", category: "Transport", amountUSD: 540, paidBy: "Alex" },
    { id: "2", title: "Boutique Ryokan Hotel", category: "Accommodation", amountUSD: 680, paidBy: "Alex" },
    { id: "3", title: "Michelin Kaiseki Dinner", category: "Dining", amountUSD: 180, paidBy: "Sarah" },
    { id: "4", title: "Tea Ceremony Ticket", category: "Activities", amountUSD: 45, paidBy: "Alex" },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("Dining");
  const [newPayer, setNewPayer] = useState("Alex");

  // Currency converter state
  const [convAmount, setConvAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState(userCurrency);

  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 155.4,
    AUD: 1.52,
    CAD: 1.36,
    INR: 83.5,
    AED: 3.67,
    SAR: 3.75,
    CHF: 0.88,
    SGD: 1.34,
    CNY: 7.23,
    BRL: 5.45,
    MXN: 18.2,
    ZAR: 18.1,
    THB: 36.5,
    MYR: 4.71,
    IDR: 16250,
    KRW: 1380,
    PKR: 278,
    BDT: 117,
  };

  const getRate = (code: string) => rates[code] || 1;

  const convertedValue = ((convAmount / getRate(fromCurrency)) * getRate(toCurrency)).toFixed(2);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;

    setExpenses([
      ...expenses,
      {
        id: `exp-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        amountUSD: Number(newAmount),
        paidBy: newPayer,
      },
    ]);

    setNewTitle("");
    setNewAmount("");
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amountUSD, 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
          <Wallet className="w-4 h-4 text-blue-500" />
          Financial Control Center
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Smart Budget & Expense Manager
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mt-1">
          Track group expenses, log receipts, and perform instant live currency conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Expense Logger & List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Expense Form */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" />
              Log New Expense
            </h3>

            <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Expense description..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="px-4 py-3 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
              />

              <input
                type="number"
                placeholder="Amount ($ USD)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="px-4 py-3 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
              />

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-4 py-3 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="Dining" className="bg-zinc-900 text-white">Dining</option>
                <option value="Accommodation" className="bg-zinc-900 text-white">Accommodation</option>
                <option value="Transport" className="bg-zinc-900 text-white">Transport</option>
                <option value="Activities" className="bg-zinc-900 text-white">Activities</option>
                <option value="Shopping" className="bg-zinc-900 text-white">Shopping</option>
              </select>

              <button
                type="submit"
                className="py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>
          </div>

          {/* Expense History List */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bold text-base text-white">
                Logged Expenses
              </h3>
              <span className="font-black text-xl text-blue-400">
                Total: ${totalSpent}
              </span>
            </div>

            <div className="space-y-3">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs hover:border-white/20 transition-all"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-white text-sm">{exp.title}</p>
                    <span className="text-[10px] text-white/50">
                      {exp.category} • Paid by {exp.paidBy}
                    </span>
                  </div>

                  <span className="font-black text-base text-white">
                    ${exp.amountUSD}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Currency Converter & Splitter */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-400" />
              Live Currency Calculator
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Amount</label>
                <input
                  type="number"
                  value={convAmount}
                  onChange={(e) => setConvAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/10 font-bold text-sm text-white mt-1 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">From</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white mt-1 focus:outline-none focus:border-blue-500/50"
                  >
                    {ALL_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                        {c.flag} {c.code} - {c.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">To</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white mt-1 focus:outline-none focus:border-blue-500/50"
                  >
                    {ALL_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-zinc-900 text-white">
                        {c.flag} {c.code} - {c.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-600 text-white text-center space-y-1 shadow-lg shadow-blue-600/30">
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/70">Result</p>
                <p className="text-3xl font-black">
                  {convertedValue} {toCurrency}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
