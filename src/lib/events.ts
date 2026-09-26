export const EVENT_STATUSES = [
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REGISTRATION_CLOSED",
  "CANCELLED",
  "COMPLETED",
] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export type RegistrationState =
  | "OPEN"
  | "FILLING_FAST"
  | "FULL"
  | "CLOSED"
  | "CANCELLED"
  | "COMPLETED"
  | "PENDING"
  | "NO_REGISTRATION";

export type RegistrationInfo = {
  state: RegistrationState;
  label: string;
  /// 0 - 1, null when the event has no capacity limit
  fill: number | null;
  spotsLeft: number | null;
  canRegister: boolean;
};

type EventLike = {
  status: string;
  startAt: Date;
  endAt?: Date | null;
  capacity?: number | null;
  participantCount: number;
  registrationRequired: boolean;
  googleFormUrl?: string | null;
};

export function getRegistrationInfo(
  event: EventLike,
  now: Date = new Date(),
): RegistrationInfo {
  const capacity = event.capacity ?? null;
  const fill = capacity && capacity > 0 ? Math.min(event.participantCount / capacity, 1) : null;
  const spotsLeft = capacity ? Math.max(capacity - event.participantCount, 0) : null;

  const base = { fill, spotsLeft };

  if (event.status === "CANCELLED") {
    return { ...base, state: "CANCELLED", label: "Event cancelled", canRegister: false };
  }
  if (event.status === "COMPLETED" || (event.endAt ?? event.startAt) < now) {
    return { ...base, state: "COMPLETED", label: "Event completed", canRegister: false };
  }
  if (event.status === "PENDING" || event.status === "DRAFT") {
    return { ...base, state: "PENDING", label: "Pending approval", canRegister: false };
  }
  if (!event.registrationRequired) {
    return { ...base, state: "NO_REGISTRATION", label: "Open to everyone", canRegister: false };
  }
  if (event.status === "REGISTRATION_CLOSED") {
    return { ...base, state: "CLOSED", label: "Registration closed", canRegister: false };
  }
  if (spotsLeft !== null && spotsLeft <= 0) {
    return { ...base, state: "FULL", label: "Full", canRegister: false };
  }
  if (fill !== null && fill >= 0.75) {
    return {
      ...base,
      state: "FILLING_FAST",
      label: "Filling fast",
      canRegister: Boolean(event.googleFormUrl),
    };
  }
  return {
    ...base,
    state: "OPEN",
    label: "Registration open",
    canRegister: Boolean(event.googleFormUrl),
  };
}

export function statusTone(state: RegistrationState): string {
  switch (state) {
    case "OPEN":
      return "#31E981";
    case "FILLING_FAST":
      return "#FFB020";
    case "FULL":
    case "CLOSED":
      return "#FF6B6B";
    case "CANCELLED":
      return "#FF4D4D";
    case "COMPLETED":
      return "#8A8AA3";
    case "PENDING":
      return "#B892FF";
    default:
      return "#4CC9F0";
  }
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
}

export function splitList(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
