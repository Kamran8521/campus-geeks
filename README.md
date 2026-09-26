# Campus Geeks

The digital social layer of the university: discover matches, trips, movie nights, workshops,
society events and everything else happening around campus this week.

## Stack

- Next.js 16 (App Router, Server Actions, Turbopack)
- TypeScript, Tailwind CSS v4, Framer Motion, Lucide icons
- Prisma 7 with SQLite (better-sqlite3 driver adapter)
- Signed HTTP-only cookie sessions (HMAC-SHA256)

## Getting started

```bash
npm install
cp .env.example .env
npm run setup    # migrate + generate + seed
npm run dev
```

The app runs at http://localhost:3000.

### Demo accounts

Seeded for local development only, password `campus1234`:

| Email                  | Role      |
| ---------------------- | --------- |
| admin@campus.edu       | ADMIN     |
| organizer@campus.edu   | ORGANIZER |
| student@campus.edu     | STUDENT   |

## Scripts

| Script              | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Dev server                               |
| `npm run build`     | Prisma generate + production build       |
| `npm run lint`      | ESLint                                   |
| `npm run typecheck` | `tsc --noEmit`                           |
| `npm run seed`      | Seed demo campus data                    |
| `npm run setup`     | Migrate, generate and seed in one step   |

## Surface

- `/` homepage: hero, happening soon, this week timeline, trending, categories
- `/events` discovery with search and filters (category, date, society, price, status, sort)
- `/events/[slug]` event detail with Google Form registration, capacity, share, bookmark
- `/category/[key]` category experiences (music, art, movies, technology, gaming, workshops, societies)
- `/sports` fixtures, results and tournaments; `/trips` immersive trip layouts
- `/societies` and `/societies/[slug]` organizer profiles
- `/create` event and sports matchup builder (submits as `PENDING`)
- `/feed` personalized feed, `/saved` bookmarks
- `/admin` moderation: approve, reject, feature, cancel, complete, delete, participant counts, results

## Registration model

Organizers collect participant details through their own Google Form. The platform stores the
form URL, capacity and a manually maintained participant count, and derives the registration
state (open, filling fast, full, closed, cancelled, completed, pending approval).

`Event.googleSheetId`, `Event.autoSyncEnabled` and `Event.lastSyncedAt` are reserved for the
future Google Form to Google Sheet to automatic participant count sync.
