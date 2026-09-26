import type { RegistrationInfo } from "@/lib/events";
import { statusTone } from "@/lib/events";

export function StatusPill({
  info,
  size = "sm",
}: {
  info: RegistrationInfo;
  size?: "sm" | "md";
}) {
  const tone = statusTone(info.state);
  const live = info.state === "OPEN" || info.state === "FILLING_FAST";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-medium ${
        size === "md" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs"
      }`}
      style={{
        borderColor: `${tone}55`,
        color: tone,
        background: `${tone}14`,
      }}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${live ? "live-dot" : ""}`}
        style={{ background: tone }}
      />
      {info.label}
    </span>
  );
}

export function CapacityBar({
  info,
  participantCount,
  capacity,
  accent,
}: {
  info: RegistrationInfo;
  participantCount: number;
  capacity: number | null;
  accent: string;
}) {
  if (!capacity) return null;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between text-sm">
        <span className="display text-base">
          {participantCount} <span className="text-[#6B6B85]">/ {capacity}</span>
        </span>
        <span className="text-xs text-[#9A99B5]">
          {info.spotsLeft && info.spotsLeft > 0 ? `${info.spotsLeft} spots left` : "No spots left"}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{
            width: `${Math.round((info.fill ?? 0) * 100)}%`,
            background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
          }}
        />
      </div>
    </div>
  );
}
