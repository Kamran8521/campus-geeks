import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { EventCard } from "@/components/event-card";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { eventInclude } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Saved events" };

export default async function SavedPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: { event: { include: eventInclude } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grain mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
      <p className="eyebrow text-[color:var(--color-violet)]">Saved</p>
      <h1 className="display mt-3 text-5xl leading-[0.95] text-[color:var(--color-chalk)] md:text-7xl">
        Your shortlist
      </h1>
      <p className="mt-4 text-[#9A99B5]">
        {bookmarks.length} {bookmarks.length === 1 ? "activity" : "activities"} saved.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <EventCard
            key={bookmark.id}
            event={bookmark.event}
            saved
            signedIn
            pathname="/saved"
          />
        ))}
      </div>

      {bookmarks.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-10">
          <p className="display text-2xl text-[color:var(--color-chalk)]">Nothing saved yet</p>
          <p className="mt-2 text-sm text-[#9A99B5]">
            Tap the bookmark on any event card to keep it here.
          </p>
          <Link
            href="/events"
            className="mt-6 inline-flex rounded-full bg-[color:var(--color-chalk)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-ink)]"
          >
            Explore events
          </Link>
        </div>
      ) : null}
    </div>
  );
}
