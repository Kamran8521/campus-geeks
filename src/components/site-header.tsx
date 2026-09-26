"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bookmark, LogOut, Menu, Plus, Search, Shield, X } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { logout } from "@/app/actions/auth";

const NAV = [
  { href: "/events", label: "Explore" },
  { href: "/sports", label: "Sports" },
  { href: "/trips", label: "Trips" },
  { href: "/category/music", label: "Music" },
  { href: "/category/art", label: "Art" },
  { href: "/category/movies", label: "Movies" },
  { href: "/societies", label: "Societies" },
  { href: "/rooms", label: "Rooms" },
];

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/events?q=${encodeURIComponent(trimmed)}` : "/events");
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open
          ? "border-b border-white/10 bg-[#05050A]/90 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 md:h-20 md:px-10">
        <Link href="/" className="group flex items-center gap-2">
          <span className="h-7 w-7 rounded-md bg-gradient-to-br from-[#7C5CFF] via-[#F0409C] to-[#FF8A3D] transition-transform duration-500 group-hover:rotate-12" />
          <span className="display text-lg tracking-tight md:text-xl">Campus Geeks</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition hover:text-white ${
                pathname === item.href ? "text-white" : "text-[#9A99B5]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden md:block">
          <label className="flex w-56 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition focus-within:border-white/40 lg:w-64">
            <Search className="h-4 w-4 shrink-0 text-[#9A99B5]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search football, pottery..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#6B6B85]"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          {user ? (
            <>
              <Link
                href="/saved"
                aria-label="Saved events"
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#9A99B5] transition hover:border-white/40 hover:text-white md:flex"
              >
                <Bookmark className="h-4 w-4" />
              </Link>
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  aria-label="Admin dashboard"
                  className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#9A99B5] transition hover:border-white/40 hover:text-white md:flex"
                >
                  <Shield className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                href="/create"
                className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-[#E4E1FF] md:flex"
              >
                <Plus className="h-4 w-4" />
                Host
              </Link>
              <Link
                href="/feed"
                className="hidden h-9 items-center rounded-full border border-white/10 px-3 text-sm text-white transition hover:border-white/40 md:flex"
              >
                {user.name.split(" ")[0]}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm text-[#9A99B5] transition hover:text-white md:block"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-[#E4E1FF] md:block"
              >
                Join
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#05050A] px-5 py-6 lg:hidden">
          <form onSubmit={submitSearch} className="mb-5 md:hidden">
            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-[#9A99B5]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#6B6B85]"
              />
            </label>
          </form>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="display text-xl">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5">
            {user ? (
              <>
                <Link href="/feed" className="text-sm text-[#9A99B5]">
                  Your campus
                </Link>
                <Link href="/saved" className="text-sm text-[#9A99B5]">
                  Saved events
                </Link>
                {user.role === "ADMIN" ? (
                  <Link href="/admin" className="text-sm text-[#9A99B5]">
                    Admin dashboard
                  </Link>
                ) : null}
                <Link
                  href="/create"
                  className="rounded-full bg-white px-4 py-2 text-center text-sm font-medium text-black"
                >
                  Host an event
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-2 text-sm text-[#9A99B5]"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-[#9A99B5]">
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-white px-4 py-2 text-center text-sm font-medium text-black"
                >
                  Join Campus Geeks
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
