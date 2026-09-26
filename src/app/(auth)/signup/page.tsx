import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth-forms";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Join" };

export default async function SignupPage() {
  const user = await getSessionUser();
  if (user) redirect("/feed");

  return (
    <div className="grain mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="eyebrow text-[color:var(--color-lime)]">Join</p>
        <h1 className="display mt-3 text-5xl leading-[0.95] text-[color:var(--color-chalk)] md:text-7xl">
          Build your
          <br />
          campus feed
        </h1>
        <p className="mt-4 max-w-md text-[#9A99B5]">
          Pick what you are into and we will keep the right matches, trips, gigs and
          workshops at the top.
        </p>
      </div>

      <div className="rounded-[2rem] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-7 md:p-10">
        <SignupForm />
        <p className="mt-6 text-sm text-[#9A99B5]">
          Already have an account?{" "}
          <Link href="/login" className="text-[color:var(--color-chalk)] underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
