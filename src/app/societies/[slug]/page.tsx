import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AtSign, Globe, Mail } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { eventInclude, getBookmarkedIds } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const society = await prisma.society.findUnique({ where: { slug } });
  if (!society) return { title: "Society not found" };
  return { title: society.name, description: society.description };
}

export default async function SocietyPage({ params }: Props) {
  const { slug } = await params;
  const [society, user] = await Promise.all([
    prisma.society.findUnique({
      where: { slug },
      include: {
        events: {
          where: { status: { in: ["APPROVED", "REGISTRATION_CLOSED", "COMPLETED"] } },
          include: eventInclude,
          orderBy: { startAt: "asc" },
        },
      },
    }),
    getSessionUser(),
  ]);

  if (!society) notFound();

  const now = new Date();
  const upcoming = society.events.filter((event) => event.startAt >= now);
  const past = society.events.filter((event) => event.startAt < now).reverse();
  const saved = await getBookmarkedIds(user?.id);
  const pathname = `/societies/${society.slug}`;

  return (
    <div className="grain">
      <section className="relative overflow-hidden border-b border-[color:var(--color-line)]">
        <div
          className="absolute -left-20 -top-24 h-96 w-96 rounded-full opacity-30 blur-[130px]"
          style={{ background: society.accent }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
          <div className="flex flex-wrap items-end gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-3xl border border-white/12 md:h-32 md:w-32">
              {society.logoImage ? (
                <Image
                  src={society.logoImage}
                  alt={society.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div>
              <p className="eyebrow" style={{ color: society.accent }}>
                {society.shortName ?? "Society"}
              </p>
              <h1 className="display mt-2 text-4xl leading-[0.95] text-[color:var(--color-chalk)] md:text-6xl">
                {society.name}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-[#C9C7E0]">{society.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {society.website ? (
              <a
                href={society.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-[#C9C7E0] transition hover:border-white/50 hover:text-white"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
            ) : null}
            {society.instagram ? (
              <a
                href={`https://instagram.com/${society.instagram.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-[#C9C7E0] transition hover:border-white/50 hover:text-white"
              >
                <AtSign className="h-4 w-4" />
                {society.instagram}
              </a>
            ) : null}
            {society.email ? (
              <a
                href={`mailto:${society.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-[#C9C7E0] transition hover:border-white/50 hover:text-white"
              >
                <Mail className="h-4 w-4" />
                {society.email}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="display text-3xl text-[color:var(--color-chalk)]">Upcoming events</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              saved={saved.has(event.id)}
              signedIn={Boolean(user)}
              pathname={pathname}
            />
          ))}
        </div>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-[#9A99B5]">Nothing scheduled right now.</p>
        ) : null}

        {past.length > 0 ? (
          <>
            <h2 className="display mt-16 text-3xl text-[color:var(--color-chalk)]">Past events</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {past.slice(0, 6).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  saved={saved.has(event.id)}
                  signedIn={Boolean(user)}
                  pathname={pathname}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
