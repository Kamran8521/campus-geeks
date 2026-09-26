import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { EventCard, EventRow } from "@/components/event-card";
import { MatchCard } from "@/components/match-card";
import { SectionHeading } from "@/components/section-heading";
import { getSessionUser } from "@/lib/auth";
import { getCategory } from "@/lib/categories";
import { prisma } from "@/lib/db";
import { eventInclude, getBookmarkedIds, getUpcomingMatches } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Your campus" };

export default async function FeedPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const interests = user.interests.length > 0 ? user.interests : ["sports", "music", "movies"];

  const [recommended, everything, matches, savedEvents] = await Promise.all([
    prisma.event.findMany({
      where: {
        status: "APPROVED",
        startAt: { gte: new Date() },
        category: { in: interests },
      },
      include: eventInclude,
      orderBy: { startAt: "asc" },
      take: 6,
    }),
    prisma.event.findMany({
      where: { status: "APPROVED", startAt: { gte: new Date() } },
      include: eventInclude,
      orderBy: { startAt: "asc" },
      take: 8,
    }),
    getUpcomingMatches(3),
    prisma.bookmark.findMany({
      where: { userId: user.id },
      include: { event: { include: eventInclude } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const saved = await getBookmarkedIds(user.id);
  const mine = await prisma.event.findMany({
    where: { createdById: user.id },
    orderBy: { createdAt: "desc" },
    include: eventInclude,
    take: 6,
  });

  return (
    <div className="grain mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
      <p className="eyebrow text-[color:var(--color-violet)]">Your campus</p>
      <h1 className="display mt-3 text-5xl leading-[0.95] text-[color:var(--color-chalk)] md:text-7xl">
        Hey {user.name.split(" ")[0]}
      </h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {interests.map((key) => {
          const category = getCategory(key);
          return (
            <Link
              key={key}
              href={`/category/${key}`}
              className="rounded-full border px-4 py-2 text-sm"
              style={{
                borderColor: `${category.accent}55`,
                color: category.accent,
                background: `${category.accent}14`,
              }}
            >
              {category.label}
            </Link>
          );
        })}
      </div>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Based on your interests"
          title="Picked for you"
          href="/events"
          accent="#31E981"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(recommended.length > 0 ? recommended : everything).slice(0, 6).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              saved={saved.has(event.id)}
              signedIn
              pathname="/feed"
            />
          ))}
        </div>
      </section>

      {savedEvents.length > 0 ? (
        <section className="mt-16">
          <SectionHeading
            eyebrow="Saved"
            title="Things you kept"
            href="/saved"
            hrefLabel="All saved"
            accent="#B892FF"
          />
          <div className="space-y-3">
            {savedEvents.map((bookmark) => (
              <EventRow
                key={bookmark.id}
                event={bookmark.event}
                saved
                signedIn
                pathname="/feed"
              />
            ))}
          </div>
        </section>
      ) : null}

      {matches.length > 0 ? (
        <section className="mt-16">
          <SectionHeading eyebrow="Sports" title="Next fixtures" href="/sports" accent="#31E981" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((event) => (
              <MatchCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-16">
        <SectionHeading
          eyebrow="Your events"
          title="Things you are hosting"
          href="/create"
          hrefLabel="Host something"
          accent="#FF8A3D"
        />
        {mine.length > 0 ? (
          <div className="space-y-3">
            {mine.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                saved={saved.has(event.id)}
                signedIn
                pathname="/feed"
              />
            ))}
          </div>
        ) : (
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-white/15 px-6 py-5 text-sm text-[#9A99B5] transition hover:border-white/40 hover:text-white"
          >
            You have not organized anything yet — start one
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </section>
    </div>
  );
}
