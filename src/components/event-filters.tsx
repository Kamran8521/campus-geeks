"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/categories";

const WHEN = [
  { value: "", label: "Any date" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "weekend", label: "This weekend" },
  { value: "month", label: "This month" },
];

const PRICE = [
  { value: "", label: "Any price" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

const STATUS = [
  { value: "", label: "Any status" },
  { value: "open", label: "Registration open" },
  { value: "full", label: "Full" },
  { value: "closed", label: "Closed" },
];

const SORT = [
  { value: "", label: "Soonest" },
  { value: "trending", label: "Trending" },
  { value: "new", label: "Recently added" },
];

type Society = { slug: string; name: string };

export function EventFilters({ societies }: { societies: Society[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const currentQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(currentQuery);
  const [syncedQuery, setSyncedQuery] = useState(currentQuery);

  if (syncedQuery !== currentQuery) {
    setSyncedQuery(currentQuery);
    setQuery(currentQuery);
  }

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.push(`/events?${next.toString()}`));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    update("q", query.trim());
  }

  const active = Array.from(params.keys()).length > 0;

  const selectClass =
    "rounded-full border border-white/12 bg-[color:var(--color-surface)] px-4 py-2.5 text-sm text-[color:var(--color-chalk)] outline-none transition hover:border-white/35 focus:border-white/60";

  return (
    <div className={pending ? "opacity-60 transition" : "transition"}>
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B6B85]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search football, pottery, hackathon, Mukshpuri..."
          className="w-full rounded-full border border-white/12 bg-[color:var(--color-surface)] py-4 pl-14 pr-28 text-[color:var(--color-chalk)] outline-none transition placeholder:text-[#6B6B85] focus:border-white/50"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-chalk)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-ink)]"
        >
          Search
        </button>
      </form>

      <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => update("category", "")}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
            !params.get("category")
              ? "border-white/70 bg-white text-black"
              : "border-white/12 text-[#C9C7E0] hover:border-white/40"
          }`}
        >
          All
        </button>
        {CATEGORY_LIST.map((category) => {
          const selected = params.get("category") === category.key;
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => update("category", selected ? "" : category.key)}
              className="shrink-0 rounded-full border px-4 py-2 text-sm transition"
              style={
                selected
                  ? {
                      borderColor: category.accent,
                      background: `${category.accent}22`,
                      color: category.accent,
                    }
                  : { borderColor: "rgba(255,255,255,0.12)", color: "#C9C7E0" }
              }
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          className={selectClass}
          value={params.get("when") ?? ""}
          onChange={(event) => update("when", event.target.value)}
        >
          {WHEN.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={params.get("society") ?? ""}
          onChange={(event) => update("society", event.target.value)}
        >
          <option value="">Any society</option>
          {societies.map((society) => (
            <option key={society.slug} value={society.slug}>
              {society.name}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={params.get("price") ?? ""}
          onChange={(event) => update("price", event.target.value)}
        >
          {PRICE.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={params.get("status") ?? ""}
          onChange={(event) => update("status", event.target.value)}
        >
          {STATUS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={params.get("sort") ?? ""}
          onChange={(event) => update("sort", event.target.value)}
        >
          {SORT.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {active ? (
          <button
            type="button"
            onClick={() => startTransition(() => router.push("/events"))}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-2.5 text-sm text-[#9A99B5] transition hover:border-white/40 hover:text-white"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
