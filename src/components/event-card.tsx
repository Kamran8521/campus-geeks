import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { BookmarkButton } from "@/components/bookmark-button";
import { StatusPill } from "@/components/status-pill";
import { getCategory } from "@/lib/categories";
import { getRegistrationInfo } from "@/lib/events";
import { formatCost, formatDateTime, relativeLabel } from "@/lib/format";
import type { EventCardData } from "@/lib/types";

type CardProps = {
  event: EventCardData;
  saved?: boolean;
  signedIn?: boolean;
  pathname?: string;
  priority?: boolean;
};

export function EventCard({
  event,
  saved = false,
  signedIn = false,
  pathname = "/",
  priority = false,
}: CardProps) {
  const category = getCategory(event.category);
  const info = getRegistrationInfo(event);
  const Icon = category.icon;

  return (
    <article className="card-hover group relative overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
      <Link href={`/events/${event.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={event.coverImage ?? category.cover}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
            className="zoom-media object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/25 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span
              className="eyebrow flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[color:var(--color-ink)]"
              style={{ background: category.accent }}
            >
              <Icon className="h-3.5 w-3.5" />
              {event.tag ?? category.label}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
                {relativeLabel(event.startAt)}
              </p>
              <h3 className="display mt-1 text-xl leading-tight text-white md:text-2xl">
                {event.title}
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#9A99B5]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDateTime(event.startAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.venue}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <StatusPill info={info} />
            <div className="flex items-center gap-3 text-sm text-[#9A99B5]">
              {event.capacity ? (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {event.participantCount}/{event.capacity}
                </span>
              ) : null}
              <span className="display text-sm text-[color:var(--color-chalk)]">
                {formatCost(event.cost)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute right-4 top-4">
        <BookmarkButton
          eventId={event.id}
          saved={saved}
          signedIn={signedIn}
          pathname={pathname}
        />
      </div>
    </article>
  );
}

export function EventRow({
  event,
  saved = false,
  signedIn = false,
  pathname = "/",
}: CardProps) {
  const category = getCategory(event.category);
  const info = getRegistrationInfo(event);
  const Icon = category.icon;

  return (
    <article className="card-hover group relative flex gap-4 overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-3">
      <Link href={`/events/${event.slug}`} className="flex flex-1 gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-36">
          <Image
            src={event.coverImage ?? category.cover}
            alt={event.title}
            fill
            sizes="160px"
            className="zoom-media object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 py-1 pr-10">
          <p
            className="eyebrow flex items-center gap-1.5"
            style={{ color: category.accent }}
          >
            <Icon className="h-3.5 w-3.5" />
            {event.tag ?? category.label}
          </p>
          <h3 className="display mt-1 truncate text-lg text-[color:var(--color-chalk)]">
            {event.title}
          </h3>
          <p className="mt-1 truncate text-sm text-[#9A99B5]">
            {formatDateTime(event.startAt)} · {event.venue}
          </p>
          <div className="mt-2">
            <StatusPill info={info} />
          </div>
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <BookmarkButton
          eventId={event.id}
          saved={saved}
          signedIn={signedIn}
          pathname={pathname}
        />
      </div>
    </article>
  );
}
