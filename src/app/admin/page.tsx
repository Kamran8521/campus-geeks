import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import {
  deleteEvent,
  recordMatchResult,
  setEventStatus,
  toggleFeatured,
  updateParticipantCount,
} from "@/app/actions/events";
import { StatusPill } from "@/components/status-pill";
import { getSessionUser } from "@/lib/auth";
import { getCategory } from "@/lib/categories";
import { prisma } from "@/lib/db";
import { getRegistrationInfo } from "@/lib/events";
import { formatLongDate, formatTime } from "@/lib/format";
import { eventInclude } from "@/lib/queries";
import type { EventCardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Admin" };

const buttonClass =
  "rounded-full border border-white/12 px-3.5 py-1.5 text-xs font-medium text-[#C9C7E0] transition hover:border-white/50 hover:text-white";

function EventAdminRow({ event }: { event: EventCardData }) {
  const category = getCategory(event.category);

  return (
    <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4">
      <div className="flex gap-4">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={event.coverImage ?? category.cover}
            alt=""
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow" style={{ color: category.accent }}>
              {category.label}
            </span>
            <StatusPill info={getRegistrationInfo(event)} />
            {event.featured ? (
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[#C9C7E0]">
                Featured
              </span>
            ) : null}
            <span className="rounded-full border border-white/12 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-[#6B6B85]">
              {event.status}
            </span>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="display mt-1.5 block truncate text-lg text-[color:var(--color-chalk)] hover:underline"
          >
            {event.title}
          </Link>
          <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-[#9A99B5]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatLongDate(event.startAt)} · {formatTime(event.startAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.venue}
            </span>
            <span>by {event.organizerName}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4">
        {(
          [
            ["APPROVED", "Approve"],
            ["PENDING", "Send back"],
            ["REGISTRATION_CLOSED", "Close registration"],
            ["CANCELLED", "Cancel"],
            ["COMPLETED", "Complete"],
          ] as const
        )
          .filter(([status]) => status !== event.status)
          .map(([status, label]) => (
            <form key={status} action={setEventStatus}>
              <input type="hidden" name="id" value={event.id} />
              <input type="hidden" name="status" value={status} />
              <button className={buttonClass}>{label}</button>
            </form>
          ))}

        <form action={toggleFeatured}>
          <input type="hidden" name="id" value={event.id} />
          <button className={buttonClass}>{event.featured ? "Unfeature" : "Feature"}</button>
        </form>

        <form action={updateParticipantCount} className="flex items-center gap-2">
          <input type="hidden" name="id" value={event.id} />
          <input
            type="number"
            name="participantCount"
            min={0}
            defaultValue={event.participantCount}
            aria-label="Participant count"
            className="w-20 rounded-full border border-white/12 bg-[#0B0B14] px-3 py-1.5 text-xs text-[color:var(--color-chalk)] outline-none focus:border-white/50"
          />
          <button className={buttonClass}>Update count</button>
        </form>

        {event.match ? (
          <form action={recordMatchResult} className="flex items-center gap-2">
            <input type="hidden" name="eventId" value={event.id} />
            <input
              type="number"
              name="scoreA"
              min={0}
              defaultValue={event.match.scoreA ?? 0}
              aria-label={`${event.match.teamA} score`}
              className="w-14 rounded-full border border-white/12 bg-[#0B0B14] px-3 py-1.5 text-xs text-[color:var(--color-chalk)] outline-none focus:border-white/50"
            />
            <span className="text-xs text-[#6B6B85]">—</span>
            <input
              type="number"
              name="scoreB"
              min={0}
              defaultValue={event.match.scoreB ?? 0}
              aria-label={`${event.match.teamB} score`}
              className="w-14 rounded-full border border-white/12 bg-[#0B0B14] px-3 py-1.5 text-xs text-[color:var(--color-chalk)] outline-none focus:border-white/50"
            />
            <button className={buttonClass}>Record result</button>
          </form>
        ) : null}

        <form action={deleteEvent}>
          <input type="hidden" name="id" value={event.id} />
          <button className="rounded-full border border-[#FF6B6B]/40 px-3.5 py-1.5 text-xs font-medium text-[#FF9E9E] transition hover:border-[#FF6B6B]">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/feed");

  const [pending, upcoming, societies, users, counts] = await Promise.all([
    prisma.event.findMany({
      where: { status: { in: ["PENDING", "DRAFT"] } },
      include: eventInclude,
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.findMany({
      where: { status: { not: "PENDING" } },
      include: eventInclude,
      orderBy: { startAt: "asc" },
      take: 40,
    }),
    prisma.society.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { events: true } } },
    }),
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.event.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const statusCounts = new Map(counts.map((row) => [row.status, row._count._all]));

  return (
    <div className="grain mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
      <p className="eyebrow text-[color:var(--color-flame)]">Moderation</p>
      <h1 className="display mt-3 text-5xl leading-[0.95] text-[color:var(--color-chalk)] md:text-7xl">
        Admin dashboard
      </h1>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-white/8 sm:grid-cols-3 lg:grid-cols-5">
        {[
          ["Pending", statusCounts.get("PENDING") ?? 0],
          ["Approved", statusCounts.get("APPROVED") ?? 0],
          ["Completed", statusCounts.get("COMPLETED") ?? 0],
          ["Cancelled", statusCounts.get("CANCELLED") ?? 0],
          ["Users", users.length],
        ].map(([label, value]) => (
          <div key={label} className="bg-[color:var(--color-ink)] px-5 py-4">
            <dt className="eyebrow text-[#6B6B85]">{label}</dt>
            <dd className="display mt-1 text-2xl text-[color:var(--color-chalk)]">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-14">
        <h2 className="display text-3xl text-[color:var(--color-chalk)]">
          Pending approval
          <span className="ml-3 text-lg text-[#6B6B85]">{pending.length}</span>
        </h2>
        <div className="mt-6 space-y-4">
          {pending.map((event) => (
            <EventAdminRow key={event.id} event={event} />
          ))}
          {pending.length === 0 ? (
            <p className="text-[#9A99B5]">The queue is clear.</p>
          ) : null}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl text-[color:var(--color-chalk)]">All events</h2>
        <div className="mt-6 space-y-4">
          {upcoming.map((event) => (
            <EventAdminRow key={event.id} event={event} />
          ))}
        </div>
      </section>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="display text-3xl text-[color:var(--color-chalk)]">Societies</h2>
          <ul className="mt-6 space-y-2">
            {societies.map((society) => (
              <li
                key={society.id}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-5 py-3.5"
              >
                <Link
                  href={`/societies/${society.slug}`}
                  className="text-[color:var(--color-chalk)] hover:underline"
                >
                  {society.name}
                </Link>
                <span className="text-sm text-[#6B6B85]">{society._count.events} events</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="display text-3xl text-[color:var(--color-chalk)]">Users</h2>
          <ul className="mt-6 space-y-2">
            {users.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] px-5 py-3.5"
              >
                <div>
                  <p className="text-[color:var(--color-chalk)]">{person.name}</p>
                  <p className="text-sm text-[#6B6B85]">{person.email}</p>
                </div>
                <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#9A99B5]">
                  {person.role}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
