"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle, Share2 } from "lucide-react";

const buttonClass =
  "flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-[#C9C7E0] transition hover:border-white/50 hover:text-white";

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);

  function eventUrl() {
    return `${window.location.origin}/events/${slug}`;
  }

  async function copy() {
    await navigator.clipboard.writeText(eventUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function whatsapp() {
    const text = encodeURIComponent(`${title} — ${eventUrl()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  async function share() {
    const url = eventUrl();
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await copy();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={whatsapp} className={buttonClass}>
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </button>
      <button type="button" onClick={copy} className={buttonClass}>
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button type="button" onClick={share} className={buttonClass}>
        <Share2 className="h-4 w-4" />
        Share
      </button>
    </div>
  );
}
