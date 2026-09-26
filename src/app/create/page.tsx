import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CreateEventForm } from "@/components/create-event-form";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Host an event",
  description: "Publish a match, trip, workshop or gig to the campus board.",
};

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function CreatePage({ searchParams }: { searchParams: Search }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const societies = await prisma.society.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="grain mx-auto max-w-4xl px-5 py-16 sm:px-8 md:py-24">
      <p className="eyebrow text-[color:var(--color-lime)]">Organize</p>
      <h1 className="display mt-3 text-5xl leading-[0.95] text-[color:var(--color-chalk)] md:text-7xl">
        Put it on the
        <br />
        campus map
      </h1>
      <p className="mt-4 max-w-xl text-[#9A99B5]">
        Five short steps. Attach your Google Form for registrations and an admin will
        review it before it goes live.
      </p>

      <div className="mt-12">
        <CreateEventForm
          societies={societies}
          defaultCategory={category}
          organizerName={user.name}
        />
      </div>
    </div>
  );
}
