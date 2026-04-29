import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema.js';  // note .js extension for ES modules

const sqlite = new Database('./sqlite.db');
sqlite.pragma('foreign_keys = ON');      // must be before any queries

export const db = drizzle(sqlite, { schema });