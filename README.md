# Tip Your Match

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![better-auth](https://img.shields.io/badge/better--auth-auth-000000)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel)

A football score prediction app: join a league, predict Premier League scores and climb the ranking.

It started as a small side project for a group of friends who wanted to settle who really knows football. Along the way it grew into a full-stack app that I kept polishing as a portfolio piece. The UI is in Polish.

**Live demo:** https://tip-your-match.vercel.app

## Features

- Sign in with email and password, Discord or Google
- Predict scores of upcoming fixtures; predictions lock 5 minutes before kickoff, and the lock is enforced on the server, not only in the UI
- Browse the schedule with results
- Global ranking plus private leagues joined with a 6-character code (up to 50 members, up to 5 leagues created per user); league rankings count only the rounds after you joined
- Fixtures and results are synced from [football-data.org](https://www.football-data.org/) by a cron job; points are calculated only during the sync, and the ranking SQL reuses the same scoring constants
- Profile page

### Scoring

| Prediction                          | Points |
| ----------------------------------- | ------ |
| Exact score                         | 3      |
| Correct outcome (win / draw / loss) | 1      |
| Miss                                | 0      |

## Tech stack

- **Next.js 16** (App Router, Server Components, Server Actions) and **React 19**, TypeScript in strict mode
- **PostgreSQL** with **Prisma 7** (`@prisma/adapter-pg`)
- **better-auth** for email/password, Discord and Google sign-in
- **Tailwind CSS v4** and **shadcn/ui** on Base UI
- **zod v4** for validation shared by server actions and forms
- **TanStack Table** for the ranking tables
- **football-data.org** API for fixtures and results
- **Vercel** for hosting

## Getting started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)
- A free [football-data.org API key](https://www.football-data.org/client/register)

### Setup

```bash
pnpm install
cp .env.example .env    # fill in the values, see the comments in the file
pnpm prisma:dev         # local Postgres; keep it running and copy the connection strings it prints into .env
pnpm prisma:migrate     # apply migrations
pnpm sync:fixtures      # fetch fixtures from the API
pnpm seed:ranking       # optional: add fake players to the ranking
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command                | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `pnpm dev`             | Start the development server                                    |
| `pnpm build`           | Build for production                                            |
| `pnpm lint`            | Run ESLint                                                      |
| `pnpm prisma:dev`      | Start a local Postgres database                                 |
| `pnpm prisma:migrate`  | Create and apply migrations                                     |
| `pnpm prisma:generate` | Regenerate the Prisma client (also runs on `postinstall`)       |
| `pnpm prisma:studio`   | Open Prisma Studio                                              |
| `pnpm sync:fixtures`   | Pull fixtures from the API and score finished predictions       |
| `pnpm seed:ranking`    | Add fake players to the local database (`--clean` removes them) |

## Deployment

The app is deployed on Vercel. The `vercel-build` script runs `prisma migrate deploy` on production builds, so migrations are applied automatically. Fixtures are synced by calling `GET /api/cron/sync-fixtures` with an `Authorization: Bearer <CRON_SECRET>` header; the schedule is managed on [cron-job.org](https://cron-job.org/). Set the OAuth redirect URIs as described in `.env.example`.

## License

[MIT](LICENSE)
