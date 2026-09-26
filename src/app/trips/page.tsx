import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Bus, Clock, MapPin, Users } from "lucide-react";
import { CategoryTheme } from "@/components/category-theme";
import { Reveal } from "@/components/reveal";
import { StatusPill } from "@/components/status-pill";
import { getSessionUser } from "@/lib/auth";
import { getCategory } from "@/lib/categories";
import { prisma } from "@/lib/db";
import { getRegistrationInfo, splitList } from "@/lib/events";
import { formatCost, formatLongDate } from "@/lib/format";
import { eventInclude } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trips",
  description: "Hikes, treks, heritage walks and weekend escapes from campus.",
};

export default async function TripsPage() {
  const [user, trips] = await Promise.all([
    getSessionUser(),
    prisma.event.findMany({
      where: {
        category: "trips",
        status: { in: ["APPROVED", "REGISTRATION_CLOSED"] },
        startAt: { gte: new Date() },
      },
      include: eventInclude,
      orderBy: { startAt: "asc" },
    }),
  ]);

  const category = getCategory("trips");
  void user;

  return (
    <div className="grain">
      <CategoryTheme category={category} />
      <section className="relative overflow-hidden border-b border-[color:var(--color-line)]">
        <Image src={category.cover} alt="" fill priority className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/70 to-[#05050A]/30" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 md:pb-24 md:pt-28">
          <p className="eyebrow text-[color:var(--color-flame)]">Off campus</p>
          <h1 className="display mt-4 text-[14vw] leading-[0.85] text-white sm:text-8xl md:text-[8.5rem]">
            GO
            <br />
            SOMEWHERE
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            Sunrise hikes, lake days, heritage walks and winter treks. Transport, guides
            and food sorted — you just show up.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-5 py-16 sm:px-8 md:py-24">
        {trips.map((trip, index) => {
          const info = getRegistrationInfo(trip);
          const included = splitList(trip.tripIncluded);
          const bring = splitList(trip.tripBring);

          return (
            <Reveal key={trip.id}>
              <article
                className={`grid items-stretch gap-0 overflow-hidden rounded-[2rem] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] lg:grid-cols-2 ${
                  index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <Link
                  href={`/events/${trip.slug}`}
                  className="group relative block aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[420px]"
                >
                  <Image
                    src={trip.coverImage ?? category.cover}
                    alt={trip.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="zoom-media object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </Link>

                <div className="flex flex-col justify-center p-7 md:p-12">
                  <p className="eyebrow text-[color:var(--color-flame)]">
                    {formatLongDate(trip.startAt)}
                  </p>
                  <h2 className="display mt-3 text-4xl leading-[0.95] text-[color:var(--color-chalk)] md:text-6xl">
                    {trip.title}
                  </h2>
                  <p className="mt-4 text-[#9A99B5]">{trip.subtitle ?? trip.description}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    {[
                      { icon: Clock, label: "Departure", value: trip.tripDeparture },
                      { icon: Clock, label: "Return", value: trip.tripReturn },
                      { icon: MapPin, label: "From", value: trip.tripDeparturePoint },
                      { icon: Bus, label: "Cost", value: formatCost(trip.cost) },
                    ]
                      .filter((item) => Boolean(item.value))
                      .map((item) => (
                        <div key={item.label}>
                          <dt className="eyebrow flex items-center gap-1.5 text-[#6B6B85]">
                            <item.icon className="h-3.5 w-3.5" />
                            {item.label}
                          </dt>
                          <dd className="mt-1 text-[color:var(--color-chalk)]">{item.value}</dd>
                        </div>
                      ))}
                  </dl>

                  {included.length > 0 || bring.length > 0 ? (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      {included.length > 0 ? (
                        <div>
                          <p className="eyebrow text-[#6B6B85]">Included</p>
                          <ul className="mt-2 space-y-1 text-sm text-[color:var(--color-chalk)]">
                            {included.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {bring.length > 0 ? (
                        <div>
                          <p className="eyebrow text-[#6B6B85]">Bring</p>
                          <ul className="mt-2 space-y-1 text-sm text-[#9A99B5]">
                            {bring.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <StatusPill info={info} size="md" />
                    {trip.capacity ? (
                      <span className="inline-flex items-center gap-2 text-sm text-[#9A99B5]">
                        <Users className="h-4 w-4" />
                        {trip.participantCount} / {trip.capacity} participants
                      </span>
                    ) : null}
                    <Link
                      href={`/events/${trip.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-chalk)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-ink)] transition hover:bg-white"
                    >
                      Trip details
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}

        {trips.length === 0 ? (
          <p className="text-[#9A99B5]">No trips scheduled right now.</p>
        ) : null}
      </div>
    </div>
  );
}
