import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, AtSign, Globe } from "lucide-react";
import { getSocieties } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Societies",
  description: "The societies and organizations running campus life.",
};

export default async function SocietiesPage() {
  const societies = await getSocieties();

  return (
    <div className="grain mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
      <p className="eyebrow text-[color:var(--color-violet)]">Societies</p>
      <h1 className="display mt-3 text-5xl leading-[0.92] text-[color:var(--color-chalk)] md:text-7xl">
        The people behind
        <br />
        campus life
      </h1>
      <p className="mt-4 max-w-2xl text-[#9A99B5]">
        Recurring organizers with their own identity, calendar and following.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {societies.map((society) => (
          <Link
            key={society.id}
            href={`/societies/${society.slug}`}
            className="card-hover group relative overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-30 blur-3xl"
              style={{ background: society.accent ?? "#7C5CFF" }}
            />
            <div className="relative flex items-start justify-between">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/12">
                {society.logoImage ? (
                  <Image
                    src={society.logoImage}
                    alt={society.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <ArrowUpRight className="h-5 w-5 text-white/40 transition group-hover:text-white" />
            </div>
            <h2 className="display relative mt-5 text-2xl text-[color:var(--color-chalk)]">
              {society.name}
            </h2>
            <p className="relative mt-2 line-clamp-3 text-sm text-[#9A99B5]">
              {society.description}
            </p>
            <div className="relative mt-5 flex items-center gap-4 text-xs text-[#6B6B85]">
              <span>{society._count.events} events</span>
              {society.website ? <Globe className="h-3.5 w-3.5" /> : null}
              {society.instagram ? <AtSign className="h-3.5 w-3.5" /> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
