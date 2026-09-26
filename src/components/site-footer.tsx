import Link from "next/link";
import { CATEGORY_LIST } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07070E] px-5 py-14 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-[#7C5CFF]">Campus Geeks</p>
            <p className="display mt-3 max-w-md text-3xl md:text-4xl">
              The social layer of the university.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#9A99B5]">
            <Link className="transition hover:text-white" href="/events">
              Explore
            </Link>
            <Link className="transition hover:text-white" href="/sports">
              Sports
            </Link>
            <Link className="transition hover:text-white" href="/trips">
              Trips
            </Link>
            <Link className="transition hover:text-white" href="/societies">
              Societies
            </Link>
            <Link className="transition hover:text-white" href="/create">
              Host an event
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORY_LIST.map((category) => (
            <Link
              key={category.key}
              href={`/category/${category.key}`}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-[#9A99B5] transition hover:border-white/40 hover:text-white"
            >
              {category.label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-[#5F5F78]">
          Registrations are collected through each organizer&apos;s Google Form. Participant
          counts are maintained by organizers until automatic Google Sheets sync ships.
        </p>
      </div>
    </footer>
  );
}
