<!-- intent-skills:start -->

## Skill Loading

Before editing files for a substantial task:

- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: tip-your-match

Football match prediction app: users join leagues, predict match scores and compete in rankings. The UI is Polish-only.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict)
- Route protection lives in `proxy.ts` (Next 16 replacement for `middleware.ts`)
- Prisma 7 + PostgreSQL via `@prisma/adapter-pg`; client is generated to `app/generated/prisma` (gitignored, regenerated on `postinstall`)
- better-auth (`lib/auth.ts` server, `lib/auth-client.ts` client): email/password + Discord + Google
- Tailwind v4, shadcn/ui on **Base UI, not Radix** (`components/ui`), lucide-react icons, zod v4, TanStack Table (ranking)
- Fixtures come from football-data.org (`lib/football-api/`)
- Deployed on Vercel

## Commands

- Use **pnpm** only (never npm/yarn)
- `pnpm dev` / `pnpm build` / `pnpm lint`
- `pnpm prisma:dev` - local Postgres (`prisma dev`); must be running for `dev`, migrations and scripts
- After editing `prisma/schema.prisma`: `pnpm prisma:migrate`, then `pnpm prisma:generate`
- `pnpm prisma:studio` - always use this wrapper, not `prisma studio` directly (see comment in `scripts/studio.ts`)
- `pnpm sync:fixtures` - pull fixtures from the API and score finished predictions
- `pnpm seed:ranking` - add fake players to the local DB (`--clean` removes them); refuses non-local hosts
- No test runner yet: verify changes with `pnpm lint` and `pnpm build`

## Structure

- `app/(app)/` - authenticated pages (predictions, schedule, ranking, leagues, profile), each with its own `loading.tsx`
- `app/login`, `app/register` - public auth pages
- `app/api/cron/sync-fixtures` - cron endpoint, authorized with `Bearer CRON_SECRET`
- `lib/actions/` - server actions (`'use server'`), one file per domain
- `lib/<domain>/` (`leagues`, `predictions`, `profile`, `ranking`, `schedule`) - domain logic split into:
  - `queries.ts` - Prisma reads, start with `import 'server-only'`
  - `rules.ts` - limits and business constants (shared by server validation and client inputs)
  - `schema.ts` - zod schemas reused in several places; `types.ts` - DTOs returned by queries
- `lib/football-api/` - external API client, types and mappers to Prisma data; `sync-fixtures.ts` is shared by the cron route and the script
- `lib/session.ts` - `requireSession()`; `lib/date.ts` - date formatters; `lib/utils.ts` - `cn()`, `requireEnvVariable()`
- `lib/toasts/` - toast helpers per domain (`toast` from `components/ui/toast`)
- `components/<domain>/` - feature components; `components/loading/` - skeletons; `components/form-errors.tsx` - form error list
- `components/ui/` - generated shadcn components; avoid manual edits
- `scripts/` - tsx scripts run via pnpm scripts (load `.env` with `dotenv/config`)
- `.agents/skills/` - Prisma and shadcn skills; most relevant: `prisma-client-api`, `prisma-cli`, `shadcn` (check `rules/base-vs-radix.md`)

## Domain rules

- Scoring: `POINTS` in `lib/predictions/scoring.ts` (exact score / correct outcome / miss); ranking SQL reuses the same constants
- Predictions lock `PREDICTION_LOCK_MINUTES` before kickoff and only for `SCHEDULED` fixtures (`lib/predictions/rules.ts`); check it on the server, not only in the UI
- `Prediction.points` is `null` until scored; points are (re)calculated only during fixture sync (`lib/predictions/score-fixtures.ts`), never in request handlers
- The current season is `FOOTBALL_API_SEASON`; leagues belong to a season, and league rankings count only rounds from the member's `joinedRound`

## Conventions

- Prefer Server Components; add `'use client'` only when interactivity requires it
- Every page and server action calls `requireSession()` even though `proxy.ts` guards routes
- Server actions follow one shape (see `lib/actions/leagues.ts`, `predictions.ts`):
- signature `(previousState: XFormState, formData: FormData)` with exported `XFormState = { success: boolean; errors?: string[] }`
- validate with zod `safeParse` and return messages instead of throwing
- wrap DB work in `try/catch`, `console.error` the cause and return a generic Polish error
- call `redirect()` outside `try/catch` (it throws); call `refresh()` from `next/cache` after a successful mutation that stays on the page
- clients use `useActionState` and render `state.errors` with `<FormErrors>`
- `lib/actions/auth.ts` predates this shape; don't copy it
- Import Prisma types from `@/app/generated/prisma/client` (or `/enums`, `/models`), never from `@prisma/client`
- Use the `@/` import alias instead of relative `../` paths
- Use `cn()` for conditional class names
- Read env vars with `requireEnvVariable()` instead of raw `process.env`; exception: `NEXT_PUBLIC_*` in client code must be read as `process.env.NEXT_PUBLIC_X` so Next can inline it
- Dates: timezone `Europe/Warsaw`, locale `pl-PL`; reuse or extend formatters in `lib/date.ts`
- User-facing text (UI, validation messages, toasts, script logs) is Polish; identifiers and code comments are English
- Accessibility: link inputs to hints and errors with `useId()` + `aria-describedby`; loading UIs use `<LoadingRegion label>`
- Code style: tabs, single quotes, kebab-case file names; no formatter is configured, so match the surrounding code
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`); branches `feat/...`, `fix/...`

## Do not

- Do not edit `app/generated/**` by hand
- Do not import the Prisma client in client components
- Do not edit applied migrations in `prisma/migrations/`; production runs `prisma migrate deploy` on every Vercel build (`vercel-build`)
- Do not add a public route without updating the `proxy.ts` matcher; routes excluded there must authorize requests themselves
- Do not commit `.env` or print secrets
- Do not run `pnpm prisma:reset` without asking first
