export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  country: string;
  flag: string;
}

export const ALL_CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "United States Dollar", country: "United States", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", country: "European Union", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound Sterling", country: "United Kingdom", flag: "🇬🇧" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India", flag: "🇮🇳" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan", flag: "🇯🇵" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia", flag: "🇦🇺" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada", flag: "🇨🇦" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", country: "Switzerland", flag: "🇨🇭" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore", flag: "🇸🇬" },
  { code: "AED", symbol: "AED", name: "United Arab Emirates Dirham", country: "UAE", flag: "🇦🇪" },
  { code: "SAR", symbol: "SAR", name: "Saudi Riyal", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", country: "China", flag: "🇨🇳" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", country: "Hong Kong", flag: "🇭🇰" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", country: "South Korea", flag: "🇰🇷" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand", flag: "🇳🇿" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil", flag: "🇧🇷" },
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso", country: "Mexico", flag: "🇲🇽" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa", flag: "🇿🇦" },
  { code: "THB", symbol: "฿", name: "Thai Baht", country: "Thailand", flag: "🇹🇭" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia", flag: "🇲🇾" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia", flag: "🇮🇩" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "Philippines", flag: "🇵🇭" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", country: "Vietnam", flag: "🇻🇳" },
  { code: "PKR", symbol: "Rs", name: "Pakistani Rupee", country: "Pakistan", flag: "🇵🇰" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", country: "Bangladesh", flag: "🇧🇩" },
  { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "NPR", symbol: "Rs", name: "Nepalese Rupee", country: "Nepal", flag: "🇳🇵" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden", flag: "🇸🇪" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "Norway", flag: "🇳🇴" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", country: "Denmark", flag: "🇩🇰" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", country: "Poland", flag: "🇵🇱" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", country: "Turkey", flag: "🇹🇷" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound", country: "Egypt", flag: "🇪🇬" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", country: "Russia", flag: "🇷🇺" },
  { code: "ILS", symbol: "₪", name: "Israeli New Shekel", country: "Israel", flag: "🇮🇱" },
  { code: "COP", symbol: "COL$", name: "Colombian Peso", country: "Colombia", flag: "🇨🇴" },
  { code: "ARS", symbol: "$", name: "Argentine Peso", country: "Argentina", flag: "🇦🇷" },
  { code: "CLP", symbol: "CLP$", name: "Chilean Peso", country: "Chile", flag: "🇨🇱" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", country: "Nigeria", flag: "🇳🇬" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", country: "Kenya", flag: "🇰🇪" },
  { code: "QAR", symbol: "QAR", name: "Qatari Riyal", country: "Qatar", flag: "🇶🇦" },
  { code: "KWD", symbol: "KWD", name: "Kuwaiti Dinar", country: "Kuwait", flag: "🇰🇼" },
  { code: "OMR", symbol: "OMR", name: "Omani Rial", country: "Oman", flag: "🇴🇲" },
  { code: "BHD", symbol: "BHD", name: "Bahraini Dinar", country: "Bahrain", flag: "🇧🇭" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint", country: "Hungary", flag: "🇭🇺" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna", country: "Czechia", flag: "🇨🇿" },
  { code: "RON", symbol: "lei", name: "Romanian Leu", country: "Romania", flag: "🇷🇴" },
];

export const POPULAR_CURRENCIES = [
  "USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "SGD", "AED", "SAR", "CNY", "BRL", "MXN", "ZAR", "THB", "MYR", "IDR"
];

export const EXCHANGE_RATES_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.5,
  JPY: 154.2,
  AUD: 1.52,
  CAD: 1.36,
  CHF: 0.88,
  SGD: 1.34,
  AED: 3.67,
  SAR: 3.75,
  CNY: 7.23,
  HKD: 7.82,
  KRW: 1380,
  NZD: 1.63,
  BRL: 5.45,
  MXN: 18.2,
  ZAR: 18.1,
  THB: 36.5,
  MYR: 4.71,
  IDR: 16250,
  PHP: 58.4,
  VND: 25400,
  PKR: 278,
  BDT: 117,
  LKR: 303,
  NPR: 133,
  SEK: 10.5,
  NOK: 10.8,
  DKK: 6.85,
  PLN: 3.98,
  TRY: 33.2,
  EGP: 48.3,
  RUB: 88.5,
  ILS: 3.72,
  COP: 4050,
  ARS: 915,
  CLP: 940,
  NGN: 1510,
  KES: 129,
  QAR: 3.64,
  KWD: 0.31,
  OMR: 0.38,
  BHD: 0.38,
  HUF: 365,
  CZK: 23.2,
  RON: 4.58,
};

export function getCurrencyInfo(code: string): CurrencyInfo {
  const found = ALL_CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return found || { code, symbol: code, name: code, country: "Global", flag: "🌐" };
}

export function getExchangeRate(code: string): number {
  return EXCHANGE_RATES_USD[code.toUpperCase()] || 1;
}

export function convertFromUSD(amountUSD: number, targetCode: string): number {
  const rate = getExchangeRate(targetCode);
  return Math.round(amountUSD * rate);
}

export function formatCurrency(amountUSD: number, targetCode: string = "USD"): string {
  const info = getCurrencyInfo(targetCode);
  const converted = convertFromUSD(amountUSD, targetCode);
  return `${info.symbol}${converted.toLocaleString()}`;
}

