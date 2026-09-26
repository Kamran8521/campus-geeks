import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, MessagesSquare, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { getSessionUser } from "@/lib/auth";
import { getCategory } from "@/lib/categories";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Campus chat rooms — enter a room and talk to the people going.",
};

export default async function RoomsPage() {
  const [user, rooms] = await Promise.all([
    getSessionUser(),
    prisma.chatRoom.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { messages: true, members: true } } },
    }),
  ]);

  return (
    <div className="grain mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
      <p className="eyebrow text-[color:var(--color-violet)]">Rooms</p>
      <h1 className="display mt-3 text-5xl leading-[0.92] text-[color:var(--color-chalk)] md:text-7xl">
        Talk before
        <br />
        you show up
      </h1>
      <p className="mt-4 max-w-2xl text-[#9A99B5]">
        Enter a room, find who else is going, organize a team, plan the trip.
        {user ? "" : " Sign in with your campus email to join the conversation."}
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, index) => {
          const category = getCategory(room.category);
          const Icon = category.icon;
          return (
            <Reveal key={room.id} delay={index * 0.04}>
              <Link
                href={`/rooms/${room.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-6 transition hover:-translate-y-1"
              >
                <div
                  className="absolute inset-x-0 top-0 h-28 opacity-40 transition group-hover:opacity-70"
                  style={{ background: category.gradient }}
                />
                <div className="relative flex items-start justify-between">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                    style={{
                      borderColor: category.accent,
                      color: category.accent,
                      background: category.accentSoft,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-white/30 transition group-hover:text-white" />
                </div>

                <h2 className="display relative mt-6 text-2xl text-[color:var(--color-chalk)]">
                  {room.name}
                </h2>
                <p className="relative mt-2 flex-1 text-sm text-[#9A99B5]">{room.topic}</p>

                <div className="relative mt-6 flex items-center gap-5 text-xs text-[#6B6B85]">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {room._count.members} in room
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessagesSquare className="h-3.5 w-3.5" />
                    {room._count.messages} messages
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
