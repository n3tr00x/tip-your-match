<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: tip-your-match

Football match prediction app: users join leagues, predict match scores and compete in rankings.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Route protection lives in `proxy.ts` (Next 16 replacement for `middleware.ts`)
- Prisma 7 + PostgreSQL via `@prisma/adapter-pg`; client is generated to `app/generated/prisma`
- better-auth (`lib/auth.ts` server, `lib/auth-client.ts` client)
- Tailwind v4, shadcn/ui on Base UI (`components/ui`), lucide-react icons, zod v4

## Commands

- Use **pnpm** only (never npm/yarn)
- `pnpm dev` / `pnpm build` / `pnpm lint`
- After editing `prisma/schema.prisma`: `pnpm prisma:migrate`, then `pnpm prisma:generate`
- No test runner yet: verify changes with `pnpm lint` and `pnpm build`

## Structure

- `app/(app)/` - authenticated pages (schedule, leagues, ranking)
- `app/login`, `app/register` - public auth pages
- `lib/actions/` - server actions (`'use server'`)
- `lib/football-api/` - external football API client and types
- `lib/utils.ts` - `cn()`, `requireEnvVariable()`, date formatters
- `components/ui/` - generated shadcn components; avoid manual edits
- `.agents/skills/` - skills for Prisma and shadcn; read them before working in those areas

## Conventions

- Prefer Server Components; add `'use client'` only when interactivity requires it
- Mutations go through server actions in `lib/actions/`, validated with zod
- Use `cn()` for conditional class names
- Read env vars with `requireEnvVariable()` instead of raw `process.env`
- Dates: timezone `Europe/Warsaw`, locale `pl-PL`; reuse formatters from `lib/utils.ts`
- Code style: tabs, single quotes, kebab-case file names
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`); branches `feat/...`, `fix/...`

## Do not

- Do not edit `app/generated/**` by hand
- Do not import the Prisma client in client components
- Do not commit `.env` or print secrets
- Do not run `pnpm prisma:reset` without asking first
