import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, MapPin, Play, Ticket } from "lucide-react";
import { CategoryTheme } from "@/components/category-theme";
import { EventCard } from "@/components/event-card";
import { Reveal } from "@/components/reveal";
import { StatusPill } from "@/components/status-pill";
import { getSessionUser } from "@/lib/auth";
import { CATEGORIES, CATEGORY_KEYS, getCategory } from "@/lib/categories";
import { prisma } from "@/lib/db";
import { getRegistrationInfo } from "@/lib/events";
import { formatDay, formatShortDate, formatTime } from "@/lib/format";
import { eventInclude, getBookmarkedIds } from "@/lib/queries";
import type { EventCardData } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ key: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  if (!CATEGORY_KEYS.includes(key as never)) return { title: "Category" };
  const category = getCategory(key);
  return { title: category.label, description: category.tagline };
}

function MusicRow({ event }: { event: EventCardData }) {
  const category = getCategory(event.category);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-white/5"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
        <Image
          src={event.coverImage ?? category.cover}
          alt={event.title}
          fill
          sizes="96px"
          className="object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
          <Play className="h-6 w-6 text-white" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="display truncate text-lg text-[color:var(--color-chalk)] sm:text-xl">
          {event.title}
        </p>
        <p className="truncate text-sm text-[#9A99B5]">
          {event.organizerName} · {event.venue}
        </p>
      </div>
      <div className="hidden text-right text-sm text-[#9A99B5] sm:block">
        <p>{formatDay(event.startAt)}</p>
        <p className="text-[#6B6B85]">{formatTime(event.startAt)}</p>
      </div>
      <StatusPill info={getRegistrationInfo(event)} />
    </Link>
  );
}

function MoviePoster({ event }: { event: EventCardData }) {
  const category = getCategory(event.category);
  return (
    <Link href={`/events/${event.slug}`} className="card-hover group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10">
        <Image
          src={event.coverImage ?? category.cover}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="zoom-media object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="eyebrow text-white/70">{formatShortDate(event.startAt)}</p>
          <p className="display mt-1 text-xl leading-tight text-white">{event.title}</p>
          <p className="mt-1 text-xs text-white/60">
            {formatTime(event.startAt)} · {event.venue}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ArtTile({ event }: { event: EventCardData }) {
  const category = getCategory(event.category);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="card-hover group mb-5 block break-inside-avoid overflow-hidden rounded-3xl border border-white/10"
    >
      <div className="relative">
        <Image
          src={event.coverImage ?? category.cover}
          alt={event.title}
          width={800}
          height={1000}
          className="zoom-media h-auto w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="display text-2xl leading-tight text-white">{event.title}</p>
          <p className="mt-1 text-sm text-white/70">
            {formatDay(event.startAt)} · {event.venue}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { key } = await params;
  if (!(key in CATEGORIES)) notFound();

  const category = getCategory(key);
  const Icon = category.icon;

  const [user, events, past] = await Promise.all([
    getSessionUser(),
    prisma.event.findMany({
      where: {
        category: key,
        status: { in: ["APPROVED", "REGISTRATION_CLOSED"] },
        startAt: { gte: new Date() },
      },
      include: eventInclude,
      orderBy: { startAt: "asc" },
      take: 40,
    }),
    prisma.event.findMany({
      where: { category: key, startAt: { lt: new Date() } },
      include: eventInclude,
      orderBy: { startAt: "desc" },
      take: 3,
    }),
  ]);

  const saved = await getBookmarkedIds(user?.id);
  const [lead, ...rest] = events;

  return (
    <div className="grain">
      <CategoryTheme category={category} />
      <section className="relative overflow-hidden border-b border-[color:var(--color-line)]">
        <Image
          src={category.cover}
          alt=""
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 opacity-70 mix-blend-multiply" style={{ background: category.gradient }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-20 sm:px-8 md:pb-20 md:pt-28">
          <p className="eyebrow inline-flex items-center gap-2 text-white/80">
            <Icon className="h-4 w-4" />
            {events.length} upcoming
          </p>
          <h1 className="display mt-4 text-[15vw] leading-[0.85] text-white sm:text-8xl md:text-[8rem]">
            {category.label.toUpperCase()}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">{category.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {category.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-white/80 backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-20">
        {lead ? (
          <Reveal>
            <Link
              href={`/events/${lead.slug}`}
              className="card-hover group mb-14 grid overflow-hidden rounded-[2rem] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] lg:aspect-auto">
                <Image
                  src={lead.coverImage ?? category.cover}
                  alt={lead.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="zoom-media object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-7 md:p-12">
                <p className="eyebrow" style={{ color: category.accent }}>
                  Next up
                </p>
                <h2 className="display mt-3 text-4xl leading-[0.98] text-[color:var(--color-chalk)] md:text-6xl">
                  {lead.title}
                </h2>
                <p className="mt-4 line-clamp-3 text-[#9A99B5]">{lead.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#C9C7E0]">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatDay(lead.startAt)} · {formatTime(lead.startAt)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {lead.venue}
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <StatusPill info={getRegistrationInfo(lead)} size="md" />
                  <span className="inline-flex items-center gap-2 text-sm text-[#9A99B5]">
                    <Ticket className="h-4 w-4" />
                    {lead.capacity
                      ? `${lead.participantCount}/${lead.capacity}`
                      : "Open attendance"}
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ) : (
          <p className="text-[#9A99B5]">No upcoming {category.label.toLowerCase()} events yet.</p>
        )}

        {key === "music" ? (
          <div className="divide-y divide-white/6 rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-3">
            {rest.map((event) => (
              <MusicRow key={event.id} event={event} />
            ))}
          </div>
        ) : key === "movies" ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {rest.map((event) => (
              <MoviePoster key={event.id} event={event} />
            ))}
          </div>
        ) : key === "art" ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {rest.map((event) => (
              <ArtTile key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                saved={saved.has(event.id)}
                signedIn={Boolean(user)}
                pathname={`/category/${key}`}
              />
            ))}
          </div>
        )}

        {past.length > 0 ? (
          <section className="mt-20">
            <h2 className="display text-3xl text-[color:var(--color-chalk)]">Recently happened</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  saved={saved.has(event.id)}
                  signedIn={Boolean(user)}
                  pathname={`/category/${key}`}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
