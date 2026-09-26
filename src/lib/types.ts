import type {
  EventModel,
  SocietyModel,
  SportsMatchModel,
  TournamentModel,
} from "@/generated/prisma/models";

export type EventCardData = EventModel & {
  society: SocietyModel | null;
  match: (SportsMatchModel & { tournament: TournamentModel | null }) | null;
};
