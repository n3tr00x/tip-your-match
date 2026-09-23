import 'dotenv/config';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

// The local `prisma dev` database is PGlite (an embedded, single-connection
// Postgres engine) behind a proxy that fakes multi-connection support. It
// can't safely handle two queries in flight at once: Studio always fires at
// least two /bff requests concurrently on load (schema metadata + timezone),
// and that concurrency corrupts the shared session — surfacing as
// "invalid_sql_statement_name" (SQLSTATE 26000) on Bind, and under enough
// concurrent load it can crash the whole `prisma dev` server for every
// client (raw `pg` connections included) until it's restarted. Forcing
// postgres.js down to a single connection (max=1) with no pipelining
// (max_pipeline=1) makes it queue and fully serialize every query, which
// avoids the corruption. prepare=false is kept too since it's a cheap way
// to sidestep any prepared-statement-name reuse across reconnects.
// The app itself uses `pg` via @prisma/adapter-pg (unnamed statements, one
// query at a time per request) so it isn't affected the same way and this
// only needs to apply to the Studio CLI invocation.
const url = new URL(process.env.DATABASE_URL!);
url.searchParams.set('prepare', 'false');
url.searchParams.set('max', '1');
url.searchParams.set('max_pipeline', '1');

const prismaCli = createRequire(import.meta.url).resolve('prisma/build/index.js');

// shell: false (the default) avoids cmd.exe/sh treating "&" in the URL
// as a command separator, which shell: true would do on every platform.
spawn(process.execPath, [prismaCli, 'studio', '--url', url.toString()], {
	stdio: 'inherit',
});
