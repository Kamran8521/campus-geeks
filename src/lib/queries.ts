import { prisma } from "@/lib/db";
import { addDays, startOfDay } from "@/lib/format";

/** Statuses that make an event publicly visible. */
export const PUBLIC_STATUSES = [
  "APPROVED",
  "REGISTRATION_CLOSED",
  "CANCELLED",
  "COMPLETED",
];

export const eventInclude = {
  society: true,
  match: { include: { tournament: true } },
} as const;

export type EventWithRelations = Awaited<ReturnType<typeof getEventBySlug>>;

export function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: eventInclude,
  });
}

export function getUpcoming(limit = 12, category?: string) {
  return prisma.event.findMany({
    where: {
      status: { in: ["APPROVED", "REGISTRATION_CLOSED"] },
      startAt: { gte: new Date() },
      ...(category ? { category } : {}),
    },
    include: eventInclude,
    orderBy: { startAt: "asc" },
    take: limit,
  });
}

export function getFeatured(limit = 5) {
  return prisma.event.findMany({
    where: {
      status: "APPROVED",
      featured: true,
      startAt: { gte: new Date() },
    },
    include: eventInclude,
    orderBy: { startAt: "asc" },
    take: limit,
  });
}

export function getTrending(limit = 6) {
  return prisma.event.findMany({
    where: {
      status: { in: ["APPROVED", "REGISTRATION_CLOSED"] },
      startAt: { gte: new Date() },
    },
    include: eventInclude,
    orderBy: [{ interest: "desc" }, { participantCount: "desc" }],
    take: limit,
  });
}

export function getWeekAhead() {
  const from = startOfDay(new Date());
  const to = addDays(from, 7);
  return prisma.event.findMany({
    where: {
      status: { in: ["APPROVED", "REGISTRATION_CLOSED"] },
      startAt: { gte: from, lt: to },
    },
    include: eventInclude,
    orderBy: { startAt: "asc" },
  });
}

export function getUpcomingMatches(limit = 6) {
  return prisma.event.findMany({
    where: {
      category: "sports",
      match: { is: {} },
      startAt: { gte: new Date() },
      status: { in: ["APPROVED", "REGISTRATION_CLOSED"] },
    },
    include: eventInclude,
    orderBy: { startAt: "asc" },
    take: limit,
  });
}

export function getRecentResults(limit = 6) {
  return prisma.event.findMany({
    where: { match: { is: { resultRecordedAt: { not: null } } } },
    include: eventInclude,
    orderBy: { startAt: "desc" },
    take: limit,
  });
}

export function getTournaments() {
  return prisma.tournament.findMany({
    orderBy: { startAt: "asc" },
    include: {
      teams: { orderBy: [{ points: "desc" }, { won: "desc" }] },
      matches: { include: { event: true }, orderBy: { event: { startAt: "asc" } } },
    },
  });
}

export function getSocieties() {
  return prisma.society.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { events: true } },
    },
  });
}

export async function getBookmarkedIds(userId?: string) {
  if (!userId) return new Set<string>();
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    select: { eventId: true },
  });
  return new Set(bookmarks.map((bookmark) => bookmark.eventId));
}
