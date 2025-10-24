// db.ts
import {
  type BetterSQLite3Database,
  drizzle as drizzleSqlite,
} from "drizzle-orm/better-sqlite3";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { migrate as migrateSqlite } from "drizzle-orm/better-sqlite3/migrator";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";
import Database from "better-sqlite3";
import postgres from "postgres";
import * as schema from "./schema";
import * as schemaPostgres from "./schema-postgres";
import path from "node:path";
import fs from "node:fs";
import { getDyadAppPath, getUserDataPath } from "../paths/paths";
import log from "electron-log";

const logger = log.scope("db");

// Database connection factory
let _db: any = null;
let _isPostgres = false;

/**
 * Get the database path based on the current environment
 */
export function getDatabasePath(): string {
  return path.join(getUserDataPath(), "sqlite.db");
}

/**
 * Initialize the database connection
 */
export function initializeDatabase(): any {
  if (_db) return _db as any;

  // Check if DATABASE_URL is set for PostgreSQL
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl && databaseUrl.startsWith('postgresql://')) {
    logger.log("Initializing PostgreSQL database with DATABASE_URL");
    
    try {
      const sql = postgres(databaseUrl, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 10,
        // Enforce SSL for cloud providers; harmless if already required
        ssl: 'require',
      });
      
      const pgDb = drizzlePostgres(sql, { schema: schemaPostgres });
      
      // Run PostgreSQL migrations
      const migrationsFolder = path.join(__dirname, "..", "..", "drizzle-postgres");
      if (fs.existsSync(migrationsFolder)) {
        logger.log("Running PostgreSQL migrations from:", migrationsFolder);
        migratePostgres(pgDb, { migrationsFolder });
      } else {
        logger.warn("PostgreSQL migrations folder not found:", migrationsFolder);
      }
      
      _db = pgDb;
      _isPostgres = true;
      logger.log("PostgreSQL database initialized successfully");
      return _db as any;
    } catch (error: any) {
      const code = error?.code || error?.errno;
      if (code === 'ENOTFOUND' || code === 'ENODATA') {
        logger.error(
          "PostgreSQL DNS resolution failed (likely IPv6-only host). Enable IPv6 or use an IPv4-accessible provider. Error:",
          error,
        );
      } else {
        logger.error("Failed to initialize PostgreSQL database:", error);
      }
      logger.warn("Falling back to SQLite");
      // Continue to SQLite initialization below
    }
  }

  // Fallback to SQLite
  logger.log("Initializing SQLite database");
  _isPostgres = false;
  
  const dbPath = getDatabasePath();
  logger.log("SQLite database path:", dbPath);

  // Check if the database file exists and remove it if it has issues
  try {
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      if (stats.size < 100) {
        logger.log("Database file exists but may be corrupted. Removing it...");
        fs.unlinkSync(dbPath);
      }
    }
  } catch (error) {
    logger.error("Error checking database file:", error);
  }

  fs.mkdirSync(getUserDataPath(), { recursive: true });
  fs.mkdirSync(getDyadAppPath("."), { recursive: true });

  const sqlite = new Database(dbPath, { timeout: 10000 });
  sqlite.pragma("foreign_keys = ON");

  _db = drizzleSqlite(sqlite, { schema });

  try {
    const migrationsFolder = path.join(__dirname, "..", "..", "drizzle");
    if (!fs.existsSync(migrationsFolder)) {
      logger.error("SQLite migrations folder not found:", migrationsFolder);
    } else {
      logger.log("Running SQLite migrations from:", migrationsFolder);
      migrateSqlite(_db, { migrationsFolder });
    }
  } catch (error) {
    logger.error("SQLite migration error:", error);
  }

  return _db as any;
}

/**
 * Get the database instance (throws if not initialized)
 */
export function getDb(): any {
  if (!_db) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first.",
    );
  }
  return _db as any;
}

/**
 * Check if the current database is PostgreSQL
 */
export function isPostgresDatabase(): boolean {
  return _isPostgres;
}

export const db = new Proxy({} as any, {
  get(target, prop) {
    const database = getDb();
    return database[prop as keyof typeof database];
  },
}) as any;
