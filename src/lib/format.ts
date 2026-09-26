const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? "PM" : "AM";
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

export function formatDay(date: Date) {
  return DAY[date.getDay()];
}

export function formatShortDate(date: Date) {
  return `${date.getDate()} ${MONTH[date.getMonth()].slice(0, 3)}`;
}

export function formatLongDate(date: Date) {
  return `${DAY[date.getDay()]}, ${date.getDate()} ${MONTH[date.getMonth()]}`;
}

export function formatDateTime(date: Date) {
  return `${formatDay(date)} · ${formatTime(date)}`;
}

export function formatCost(cost: number) {
  return cost > 0 ? `Rs. ${cost.toLocaleString("en-PK")}` : "Free";
}

export function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function relativeLabel(date: Date, now = new Date()) {
  const today = startOfDay(now);
  const target = startOfDay(date);
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "Tonight";
  if (diff === 1) return "Tomorrow";
  if (diff > 1 && diff < 7) return formatDay(date);
  return formatShortDate(date);
}

export function toInputValue(date: Date) {
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
