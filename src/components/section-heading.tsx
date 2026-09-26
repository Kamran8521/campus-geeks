import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "See all",
  accent = "#7C5CFF",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
  accent?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="eyebrow" style={{ color: accent }}>
          {eyebrow}
        </p>
        <h2 className="display mt-2 text-3xl leading-[1.05] text-[color:var(--color-chalk)] sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm text-[#9A99B5] sm:text-base">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-[#C9C7E0] transition hover:border-white/50 hover:text-white"
        >
          {hrefLabel}
          <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
