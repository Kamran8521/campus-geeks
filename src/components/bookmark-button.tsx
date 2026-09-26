"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleBookmark } from "@/app/actions/events";

export function BookmarkButton({
  eventId,
  saved,
  signedIn,
  pathname,
  variant = "icon",
}: {
  eventId: string;
  saved: boolean;
  signedIn: boolean;
  pathname: string;
  variant?: "icon" | "full";
}) {
  const [isSaved, setIsSaved] = useState(saved);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!signedIn) {
      router.push("/login");
      return;
    }

    setIsSaved((value) => !value);
    startTransition(async () => {
      await toggleBookmark(eventId, pathname);
    });
  }

  const Icon = isSaved ? BookmarkCheck : Bookmark;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={`flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition ${
          isSaved
            ? "border-white/60 bg-white/10 text-white"
            : "border-white/15 text-[#C9C7E0] hover:border-white/50 hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4" />
        {isSaved ? "Saved" : "Save event"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={isSaved ? "Remove bookmark" : "Save event"}
      onClick={onClick}
      disabled={pending}
      className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition ${
        isSaved
          ? "border-white/70 bg-white text-black"
          : "border-white/25 bg-black/40 text-white hover:border-white hover:bg-black/70"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
