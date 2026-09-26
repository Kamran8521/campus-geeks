# Campus Geeks

The digital social layer of the university: discover matches, trips, movie nights, workshops,
society events and everything else happening around campus this week.

## Stack

- Next.js 16 (App Router, Server Actions, Turbopack)
- TypeScript, Tailwind CSS v4, Framer Motion, Lucide icons
- Prisma 7 with SQLite locally, Supabase Postgres ready (driver adapters)
- Signed HTTP-only cookie sessions (HMAC-SHA256), restricted to campus email addresses

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
| admin@uetpeshawar.edu.pk       | ADMIN     |
| organizer@uetpeshawar.edu.pk   | ORGANIZER |
| student@uetpeshawar.edu.pk     | STUDENT   |

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
- `/rooms` and `/rooms/[slug]` category chat rooms students enter and post in

## Campus sign-in

Only `@uetpeshawar.edu.pk` addresses can sign up or sign in. The domain and campus name come
from `NEXT_PUBLIC_CAMPUS_EMAIL_DOMAIN` / `NEXT_PUBLIC_CAMPUS_NAME` and are enforced in
`src/app/actions/auth.ts` through `src/lib/campus.ts`.

## Supabase and Clerk

The database layer picks its Prisma driver adapter from `DATABASE_URL`: a `postgres...` URL uses
the Postgres adapter (Supabase), anything else uses local SQLite. To move to Supabase set
`DATABASE_URL` to the Supabase connection string, change `provider` to `postgresql` in
`prisma/schema.prisma`, then run `npx prisma migrate dev --config prisma7.config.ts`.

Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) are reserved in
`.env.example`. Session handling lives behind `src/lib/auth.ts` (`getSessionUser`, `requireUser`,
`requireAdmin`), so swapping to Clerk means reimplementing that module only.

## Registration model

Organizers collect participant details through their own Google Form. The platform stores the
form URL, capacity and a manually maintained participant count, and derives the registration
state (open, filling fast, full, closed, cancelled, completed, pending approval).

`Event.googleSheetId`, `Event.autoSyncEnabled` and `Event.lastSyncedAt` are reserved for the
future Google Form to Google Sheet to automatic participant count sync.
