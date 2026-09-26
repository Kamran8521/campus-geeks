import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/categories";

export function CategoryTile({
  category,
  count,
  large = false,
}: {
  category: Category;
  count?: number;
  large?: boolean;
}) {
  const Icon = category.icon;

  return (
    <Link
      href={`/category/${category.key}`}
      className={`card-hover group relative block overflow-hidden rounded-3xl border border-[color:var(--color-line)] ${
        large ? "min-h-[320px]" : "min-h-[220px]"
      }`}
    >
      <Image
        src={category.cover}
        alt={category.label}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="zoom-media object-cover opacity-60"
      />
      <div
        className="absolute inset-0 opacity-80 mix-blend-multiply"
        style={{ background: category.gradient }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
        <div className="flex items-start justify-between">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/30 backdrop-blur"
            style={{ color: category.accent }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <ArrowUpRight className="h-5 w-5 text-white/60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
        </div>
        <div className="mt-16">
          <h3
            className={`display leading-none text-white ${large ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}
          >
            {category.label}
          </h3>
          <p className="mt-2 max-w-xs text-sm text-white/75">{category.tagline}</p>
          {typeof count === "number" ? (
            <p className="eyebrow mt-3 text-white/60">{count} upcoming</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
