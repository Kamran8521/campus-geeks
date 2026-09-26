import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Trophy } from "lucide-react";
import { CategoryTheme } from "@/components/category-theme";
import { EventCard } from "@/components/event-card";
import { MatchCard } from "@/components/match-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getSessionUser } from "@/lib/auth";
import { getCategory } from "@/lib/categories";
import { prisma } from "@/lib/db";
import { formatLongDate, formatShortDate, formatTime } from "@/lib/format";
import {
  eventInclude,
  getBookmarkedIds,
  getRecentResults,
  getTournaments,
  getUpcomingMatches,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sports",
  description: "Matches, results and tournaments across campus.",
};

export default async function SportsPage() {
  const [user, matches, results, tournaments, otherSports] = await Promise.all([
    getSessionUser(),
    getUpcomingMatches(9),
    getRecentResults(6),
    getTournaments(),
    prisma.event.findMany({
      where: {
        category: "sports",
        match: { is: null },
        status: "APPROVED",
        startAt: { gte: new Date() },
      },
      include: eventInclude,
      orderBy: { startAt: "asc" },
      take: 3,
    }),
  ]);

  const saved = await getBookmarkedIds(user?.id);
  const sports = getCategory("sports");

  return (
    <div className="grain">
      <CategoryTheme category={getCategory("sports")} />
      <section className="relative overflow-hidden border-b border-[color:var(--color-line)]">
        <Image src={sports.cover} alt="" fill priority className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/80 to-[#05050A]/40" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#31E981]/20 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-20 sm:px-8 md:pb-20 md:pt-28">
          <p className="eyebrow text-[color:var(--color-lime)]">Campus sports</p>
          <h1 className="display mt-4 text-[14vw] leading-[0.85] text-[color:var(--color-chalk)] sm:text-8xl md:text-[8.5rem]">
            MATCH DAY
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[#C9C7E0]">
            Semester derbies, department rivalries, hostel grudge matches and the cup.
            Watch, play, or build your own fixture.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/create?category=sports"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-lime)] px-6 py-3 text-sm font-semibold text-[color:var(--color-ink)] transition hover:brightness-110"
            >
              Build a matchup
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/events?category=sports"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[color:var(--color-chalk)] transition hover:border-white/60"
            >
              All sports events
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          eyebrow="Upcoming matches"
          title="Fixtures this week"
          accent="#31E981"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((event, index) => (
            <Reveal key={event.id} delay={index * 0.04}>
              <MatchCard event={event} />
            </Reveal>
          ))}
          {matches.length === 0 ? (
            <p className="text-[#9A99B5]">No fixtures scheduled yet.</p>
          ) : null}
        </div>
      </section>

      <section className="border-y border-[color:var(--color-line)] bg-[color:var(--color-ink-soft)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <SectionHeading eyebrow="Results" title="Recent scorelines" accent="#FF8A3D" />
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="card-hover flex items-center gap-4 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="eyebrow text-[#6B6B85]">
                    {event.match?.sport} · {formatShortDate(event.startAt)}
                  </p>
                  <p className="display mt-2 truncate text-lg text-[color:var(--color-chalk)]">
                    {event.match?.teamA}
                  </p>
                  <p className="display truncate text-lg text-[color:var(--color-chalk)]">
                    {event.match?.teamB}
                  </p>
                </div>
                <div className="display text-right text-2xl text-[color:var(--color-chalk)]">
                  <p>{event.match?.scoreA}</p>
                  <p>{event.match?.scoreB}</p>
                </div>
              </Link>
            ))}
            {results.length === 0 ? (
              <p className="text-[#9A99B5]">No results recorded yet.</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          eyebrow="Tournaments"
          title="Cups and leagues"
          description="Standings update as organizers record results."
          accent="#B892FF"
        />
        <div className="space-y-8">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              id={tournament.slug}
              className="overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)]"
            >
              <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_1.2fr] md:p-8">
                <div>
                  <p className="eyebrow flex items-center gap-2 text-[color:var(--color-violet)]">
                    <Trophy className="h-4 w-4" />
                    {tournament.sport} · {tournament.status}
                  </p>
                  <h3 className="display mt-3 text-3xl leading-tight text-[color:var(--color-chalk)] md:text-4xl">
                    {tournament.name}
                  </h3>
                  <p className="mt-3 text-sm text-[#9A99B5]">{tournament.description}</p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#C9C7E0]">
                    <span>{tournament.teams.length} teams</span>
                    <span>{tournament.matches.length} matches</span>
                    {tournament.finalAt ? (
                      <span>Final: {formatLongDate(tournament.finalAt)}</span>
                    ) : null}
                  </div>

                  <div className="mt-6 space-y-2">
                    {tournament.matches.slice(0, 4).map((match) => (
                      <Link
                        key={match.id}
                        href={`/events/${match.event.slug}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/8 px-4 py-2.5 text-sm transition hover:border-white/25"
                      >
                        <span className="truncate text-[#C9C7E0]">
                          {match.teamA} vs {match.teamB}
                        </span>
                        <span className="shrink-0 text-[#6B6B85]">
                          {match.scoreA !== null && match.scoreB !== null
                            ? `${match.scoreA}—${match.scoreB}`
                            : `${formatShortDate(match.event.startAt)} · ${formatTime(match.event.startAt)}`}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[420px] text-left text-sm">
                    <thead>
                      <tr className="text-[#6B6B85]">
                        <th className="eyebrow pb-3 font-normal">Team</th>
                        <th className="eyebrow pb-3 text-center font-normal">P</th>
                        <th className="eyebrow pb-3 text-center font-normal">W</th>
                        <th className="eyebrow pb-3 text-center font-normal">D</th>
                        <th className="eyebrow pb-3 text-center font-normal">L</th>
                        <th className="eyebrow pb-3 text-center font-normal">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="text-[color:var(--color-chalk)]">
                      {tournament.teams.map((team, index) => (
                        <tr key={team.id} className="border-t border-white/8">
                          <td className="py-2.5">
                            <span className="mr-3 text-[#6B6B85]">{index + 1}</span>
                            {team.name}
                          </td>
                          <td className="text-center text-[#9A99B5]">{team.played}</td>
                          <td className="text-center text-[#9A99B5]">{team.won}</td>
                          <td className="text-center text-[#9A99B5]">{team.drawn}</td>
                          <td className="text-center text-[#9A99B5]">{team.lost}</td>
                          <td className="display text-center">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
          {tournaments.length === 0 ? (
            <p className="text-[#9A99B5]">No tournaments yet.</p>
          ) : null}
        </div>
      </section>

      {otherSports.length > 0 ? (
        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <SectionHeading eyebrow="Also on" title="Open sports sessions" accent="#31E981" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherSports.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                saved={saved.has(event.id)}
                signedIn={Boolean(user)}
                pathname="/sports"
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
