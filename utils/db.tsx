import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

function createDb() {
  const url = process.env.NEXT_PUBLIC_DRIZZLE_DB_URL;
  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_DRIZZLE_DB_URL is not set. Add it to .env.local (see .env.example).'
    );
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    return (getDb() as Record<string, unknown>)[prop as string];
  },
});