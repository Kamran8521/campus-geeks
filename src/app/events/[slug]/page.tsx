import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  BadgeCheck,
  Bus,
  CalendarDays,
  Clock,
  Backpack,
  Mail,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import { BookmarkButton } from "@/components/bookmark-button";
import { EventCard } from "@/components/event-card";
import { ShareButtons } from "@/components/share-buttons";
import { CapacityBar, StatusPill } from "@/components/status-pill";
import { getSessionUser } from "@/lib/auth";
import { getCategory } from "@/lib/categories";
import { prisma } from "@/lib/db";
import { getRegistrationInfo, splitList } from "@/lib/events";
import { formatCost, formatLongDate, formatTime } from "@/lib/format";
import { eventInclude, getBookmarkedIds, getEventBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Event not found" };

  return {
    title: event.title,
    description: event.subtitle ?? event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.subtitle ?? event.description.slice(0, 160),
      images: event.coverImage ? [event.coverImage] : undefined,
      type: "article",
    },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const [event, user] = await Promise.all([getEventBySlug(slug), getSessionUser()]);

  if (!event) notFound();

  const isStaff = user?.role === "ADMIN" || event.createdById === user?.id;
  const isPublic = event.status !== "PENDING" && event.status !== "DRAFT";
  if (!isPublic && !isStaff) notFound();

  const category = getCategory(event.category);
  const info = getRegistrationInfo(event);
  const saved = await getBookmarkedIds(user?.id);
  const Icon = category.icon;

  const related = await prisma.event.findMany({
    where: {
      category: event.category,
      status: "APPROVED",
      startAt: { gte: new Date() },
      NOT: { id: event.id },
    },
    include: eventInclude,
    orderBy: { startAt: "asc" },
    take: 3,
  });

  const included = splitList(event.tripIncluded);
  const bring = splitList(event.tripBring);
  const isTrip = event.category === "trips";

  return (
    <div className="grain pb-24">
      <section className="relative">
        <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden md:h-[62vh]">
          <Image
            src={event.coverImage ?? category.cover}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/50 to-[#05050A]/30" />
        </div>

        <div className="mx-auto -mt-32 max-w-6xl px-5 sm:px-8 md:-mt-40">
          <div className="relative">
            <Link
              href={`/category/${category.key}`}
              className="eyebrow inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[color:var(--color-ink)]"
              style={{ background: category.accent }}
            >
              <Icon className="h-3.5 w-3.5" />
              {event.tag ?? category.label}
            </Link>

            <h1 className="display mt-4 max-w-3xl text-4xl leading-[0.95] text-[color:var(--color-chalk)] sm:text-6xl md:text-7xl">
              {event.title}
            </h1>
            {event.subtitle ? (
              <p className="mt-4 max-w-2xl text-lg text-[#C9C7E0]">{event.subtitle}</p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StatusPill info={info} size="md" />
              {event.society ? (
                <Link
                  href={`/societies/${event.society.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-[#C9C7E0] transition hover:border-white/50 hover:text-white"
                >
                  <BadgeCheck className="h-4 w-4" />
                  {event.society.name}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-12 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-white/8 sm:grid-cols-3">
            {[
              {
                icon: CalendarDays,
                label: "Date",
                value: formatLongDate(event.startAt),
              },
              {
                icon: Clock,
                label: "Time",
                value: `${formatTime(event.startAt)}${event.endAt ? ` – ${formatTime(event.endAt)}` : ""}`,
              },
              { icon: MapPin, label: "Venue", value: event.venue },
            ].map((item) => (
              <div key={item.label} className="bg-[color:var(--color-ink)] p-5">
                <p className="eyebrow flex items-center gap-2 text-[#6B6B85]">
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </p>
                <p className="mt-2 text-[color:var(--color-chalk)]">{item.value}</p>
              </div>
            ))}
          </div>

          <section>
            <h2 className="display text-2xl text-[color:var(--color-chalk)]">About</h2>
            <p className="mt-4 whitespace-pre-line text-[#C9C7E0]">{event.description}</p>
          </section>

          {event.match ? (
            <section className="rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6">
              <p className="eyebrow text-[color:var(--color-lime)]">
                {event.match.sport} · {event.match.matchType}
              </p>
              <div className="mt-6 flex items-center justify-between gap-4 text-center">
                <div className="flex-1">
                  <p className="display text-xl text-[color:var(--color-chalk)] sm:text-3xl">
                    {event.match.teamA}
                  </p>
                  <p className="text-xs text-[#6B6B85]">{event.match.teamAMeta}</p>
                </div>
                <div className="display text-2xl text-[#6B6B85] sm:text-4xl">
                  {event.match.scoreA !== null && event.match.scoreB !== null
                    ? `${event.match.scoreA} — ${event.match.scoreB}`
                    : "vs"}
                </div>
                <div className="flex-1">
                  <p className="display text-xl text-[color:var(--color-chalk)] sm:text-3xl">
                    {event.match.teamB}
                  </p>
                  <p className="text-xs text-[#6B6B85]">{event.match.teamBMeta}</p>
                </div>
              </div>
              {event.match.tournament ? (
                <Link
                  href={`/sports#${event.match.tournament.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-[color:var(--color-lime)]"
                >
                  {event.match.tournament.name}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : null}
            </section>
          ) : null}

          {isTrip ? (
            <section className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6">
                <p className="eyebrow flex items-center gap-2 text-[color:var(--color-flame)]">
                  <Bus className="h-4 w-4" />
                  Travel
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["Departure", event.tripDeparture],
                    ["Return", event.tripReturn],
                    ["Departure point", event.tripDeparturePoint],
                  ]
                    .filter(([, value]) => Boolean(value))
                    .map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <dt className="text-[#6B6B85]">{label}</dt>
                        <dd className="text-right text-[color:var(--color-chalk)]">{value}</dd>
                      </div>
                    ))}
                </dl>
              </div>
              <div className="rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6">
                <p className="eyebrow flex items-center gap-2 text-[color:var(--color-flame)]">
                  <Backpack className="h-4 w-4" />
                  Included / Bring
                </p>
                <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <ul className="space-y-1.5 text-[color:var(--color-chalk)]">
                    {included.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <ul className="space-y-1.5 text-[#9A99B5]">
                    {bring.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ) : null}

          <section>
            <h2 className="display text-2xl text-[color:var(--color-chalk)]">Share this</h2>
            <p className="mt-2 text-sm text-[#9A99B5]">
              Every event has its own link: /events/{event.slug}
            </p>
            <div className="mt-4">
              <ShareButtons slug={event.slug} title={event.title} />
            </div>
          </section>
        </div>

        {/* Registration panel */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6">
            <div className="flex items-baseline justify-between">
              <p className="eyebrow text-[#6B6B85]">Registration</p>
              <p className="display text-lg text-[color:var(--color-chalk)]">
                {formatCost(event.cost)}
              </p>
            </div>

            <div className="mt-5">
              <CapacityBar
                info={info}
                participantCount={event.participantCount}
                capacity={event.capacity}
                accent={category.accent}
              />
            </div>

            <div className="mt-6 space-y-3">
              {info.canRegister && event.googleFormUrl ? (
                <a
                  href={event.googleFormUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-chalk)] px-5 py-3.5 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-white"
                >
                  <Ticket className="h-4 w-4" />
                  Register for event
                </a>
              ) : (
                <div className="flex w-full items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-3.5 text-sm font-medium text-[#9A99B5]">
                  {info.label}
                </div>
              )}

              <BookmarkButton
                eventId={event.id}
                saved={saved.has(event.id)}
                signedIn={Boolean(user)}
                pathname={`/events/${event.slug}`}
                variant="full"
              />
            </div>

            {event.googleFormUrl ? (
              <p className="mt-4 text-xs leading-relaxed text-[#6B6B85]">
                Registration is collected through the organizer&rsquo;s Google Form.
                Participant counts are updated by the organizer.
              </p>
            ) : null}

            <dl className="mt-6 space-y-3 border-t border-white/8 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6B6B85]">Organizer</dt>
                <dd className="text-right text-[color:var(--color-chalk)]">
                  {event.organizerName}
                </dd>
              </div>
              {event.eligibility ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6B6B85]">Eligibility</dt>
                  <dd className="text-right text-[color:var(--color-chalk)]">
                    {event.eligibility}
                  </dd>
                </div>
              ) : null}
              {event.campusLocation ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6B6B85]">Location</dt>
                  <dd className="text-right text-[color:var(--color-chalk)]">
                    {event.campusLocation}
                  </dd>
                </div>
              ) : null}
              {event.costNote ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6B6B85]">Cost note</dt>
                  <dd className="text-right text-[color:var(--color-chalk)]">{event.costNote}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-[#6B6B85]">Interested</dt>
                <dd className="inline-flex items-center gap-1.5 text-[color:var(--color-chalk)]">
                  <Users className="h-4 w-4" />
                  {event.interest}
                </dd>
              </div>
              {event.contactInfo ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#6B6B85]">Contact</dt>
                  <dd className="inline-flex items-center gap-1.5 text-right text-[color:var(--color-chalk)]">
                    <Mail className="h-4 w-4 shrink-0" />
                    {event.contactInfo}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
          <h2 className="display text-3xl text-[color:var(--color-chalk)]">
            More {category.label.toLowerCase()}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <EventCard
                key={item.id}
                event={item}
                saved={saved.has(item.id)}
                signedIn={Boolean(user)}
                pathname={`/events/${event.slug}`}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
