import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Clapperboard,
  Cpu,
  Dumbbell,
  Gamepad2,
  Mountain,
  Music4,
  Palette,
  Users,
  Wrench,
} from "lucide-react";

export type CategoryKey =
  | "music"
  | "sports"
  | "trips"
  | "art"
  | "movies"
  | "technology"
  | "societies"
  | "gaming"
  | "workshops";

export type Category = {
  key: CategoryKey;
  label: string;
  /// One line describing the mood of the category
  tagline: string;
  accent: string;
  accentSoft: string;
  gradient: string;
  icon: LucideIcon;
  cover: string;
  /// Finer grained activity types organizers can pick
  tags: string[];
};

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const CATEGORIES: Record<CategoryKey, Category> = {
  music: {
    key: "music",
    label: "Music",
    tagline: "Loud rooms, late nights, live sound",
    accent: "#F0409C",
    accentSoft: "rgba(240, 64, 156, 0.16)",
    gradient: "linear-gradient(135deg, #2B0B3F 0%, #7A1247 55%, #F0409C 100%)",
    icon: Music4,
    cover: UNSPLASH("photo-1470229722913-7c0e2dbbafd3"),
    tags: ["Live performance", "Open mic", "Jam session", "Listening party", "Concert", "DJ night", "Music workshop"],
  },
  sports: {
    key: "sports",
    label: "Sports",
    tagline: "Matchups, rivalries, silverware",
    accent: "#31E981",
    accentSoft: "rgba(49, 233, 129, 0.14)",
    gradient: "linear-gradient(135deg, #04231A 0%, #0B6B43 55%, #31E981 100%)",
    icon: Dumbbell,
    cover: UNSPLASH("photo-1517649763962-0c623066013b"),
    tags: ["Football", "Futsal", "Cricket", "Basketball", "Volleyball", "Badminton", "Table tennis", "Athletics"],
  },
  trips: {
    key: "trips",
    label: "Trips",
    tagline: "Leave campus before sunrise",
    accent: "#FF8A3D",
    accentSoft: "rgba(255, 138, 61, 0.16)",
    gradient: "linear-gradient(135deg, #231204 0%, #8A3E10 55%, #FF8A3D 100%)",
    icon: Mountain,
    cover: UNSPLASH("photo-1470071459604-3b5ec3a7fe05"),
    tags: ["Hiking", "Day trip", "Overnight trip", "Camping", "City tour", "Adventure"],
  },
  art: {
    key: "art",
    label: "Art",
    tagline: "Hands dirty, walls full",
    accent: "#FFD166",
    accentSoft: "rgba(255, 209, 102, 0.16)",
    gradient: "linear-gradient(135deg, #2A1E05 0%, #8A6B12 55%, #FFD166 100%)",
    icon: Palette,
    cover: UNSPLASH("photo-1513364776144-60967b0f800f"),
    tags: ["Painting", "Sketching", "Pottery", "Clay art", "Texture art", "Crochet", "Calligraphy", "Photography"],
  },
  movies: {
    key: "movies",
    label: "Movies",
    tagline: "Lights down, projector on",
    accent: "#E23C3C",
    accentSoft: "rgba(226, 60, 60, 0.16)",
    gradient: "linear-gradient(135deg, #160406 0%, #6B0F14 55%, #E23C3C 100%)",
    icon: Clapperboard,
    cover: UNSPLASH("photo-1489599849927-2ee91cede3ba"),
    tags: ["Movie night", "Screening", "Film club", "Documentary", "Short film night"],
  },
  technology: {
    key: "technology",
    label: "Technology",
    tagline: "Build something before the deadline",
    accent: "#4CC9F0",
    accentSoft: "rgba(76, 201, 240, 0.16)",
    gradient: "linear-gradient(135deg, #04121F 0%, #0B4C6B 55%, #4CC9F0 100%)",
    icon: Cpu,
    cover: UNSPLASH("photo-1518770660439-4636190af475"),
    tags: ["Hackathon", "Coding competition", "Robotics", "AI workshop", "Bootcamp", "Tech talk"],
  },
  societies: {
    key: "societies",
    label: "Societies",
    tagline: "The people who keep campus busy",
    accent: "#B892FF",
    accentSoft: "rgba(184, 146, 255, 0.16)",
    gradient: "linear-gradient(135deg, #150A2B 0%, #43227F 55%, #B892FF 100%)",
    icon: Users,
    cover: UNSPLASH("photo-1523580494863-6f3031224c94"),
    tags: ["Society event", "Student meetup", "Social gathering", "Orientation", "Panel"],
  },
  gaming: {
    key: "gaming",
    label: "Gaming",
    tagline: "LAN cables and trash talk",
    accent: "#7C5CFF",
    accentSoft: "rgba(124, 92, 255, 0.16)",
    gradient: "linear-gradient(135deg, #0B0722 0%, #3A1E9E 55%, #7C5CFF 100%)",
    icon: Gamepad2,
    cover: UNSPLASH("photo-1542751371-adc38448a05e"),
    tags: ["Esports", "LAN party", "Console night", "Chess", "Board games"],
  },
  workshops: {
    key: "workshops",
    label: "Workshops",
    tagline: "Learn something in one sitting",
    accent: "#2DD4BF",
    accentSoft: "rgba(45, 212, 191, 0.16)",
    gradient: "linear-gradient(135deg, #04201E 0%, #0B6B62 55%, #2DD4BF 100%)",
    icon: Wrench,
    cover: UNSPLASH("photo-1531482615713-2afd69097998"),
    tags: ["Workshop", "Masterclass", "Career session", "Study jam", "Skill share"],
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const CATEGORY_KEYS = CATEGORY_LIST.map((category) => category.key);

export function getCategory(key: string): Category {
  return CATEGORIES[key as CategoryKey] ?? CATEGORIES.societies;
}

export const CAMERA_ICON = Camera;
