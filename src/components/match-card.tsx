import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { EventCardData } from "@/lib/types";

function TeamBadge({ name, meta }: { name: string; meta?: string | null }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="flex flex-1 flex-col items-center gap-2 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-sm font-semibold tracking-wide text-[color:var(--color-chalk)]">
        {initials}
      </div>
      <div>
        <p className="display text-sm leading-tight text-[color:var(--color-chalk)] sm:text-base">
          {name}
        </p>
        {meta ? <p className="text-xs text-[#6B6B85]">{meta}</p> : null}
      </div>
    </div>
  );
}

export function MatchCard({ event }: { event: EventCardData }) {
  const match = event.match;
  if (!match) return null;

  const played = match.scoreA !== null && match.scoreB !== null;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="card-hover group relative block overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #31E98155, transparent 70%)" }}
      />
      <div className="relative flex items-center justify-between">
        <span className="eyebrow text-[color:var(--color-lime)]">{match.sport}</span>
        <span className="rounded-full border border-white/12 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#9A99B5]">
          {match.matchType}
        </span>
      </div>

      <div className="relative mt-6 flex items-center gap-3">
        <TeamBadge name={match.teamA} meta={match.teamAMeta} />
        {played ? (
          <div className="display text-2xl text-[color:var(--color-chalk)]">
            {match.scoreA} <span className="text-[#6B6B85]">—</span> {match.scoreB}
          </div>
        ) : (
          <div className="display text-sm uppercase tracking-[0.2em] text-[#6B6B85]">vs</div>
        )}
        <TeamBadge name={match.teamB} meta={match.teamBMeta} />
      </div>

      <div className="relative mt-6 space-y-1.5 border-t border-white/8 pt-4 text-sm text-[#9A99B5]">
        <p className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          {formatDateTime(event.startAt)}
        </p>
        <p className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {event.venue}
        </p>
        {match.round ? (
          <p className="text-xs uppercase tracking-[0.16em] text-[#6B6B85]">{match.round}</p>
        ) : null}
      </div>
    </Link>
  );
}
