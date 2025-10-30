import { desc, eq } from "drizzle-orm";
import { createLoggedHandler } from "./safe_handle";
import log from "electron-log";
import { db } from "../../db";
import { accounts } from "../../db/schema";
import type {
  Account,
  SetActiveAccountParams,
  UpsertAccountParams,
} from "../ipc_types";

const logger = log.scope("account_handlers");
const handle = createLoggedHandler(logger);

export function registerAccountHandlers() {
  // List accounts
  handle("accounts:list", async () => {
    const rows = await db.select().from(accounts).orderBy(desc(accounts.updatedAt));
    return rows as unknown as Account[];
  });

  // Upsert account
  handle("accounts:upsert", async (_event, params: UpsertAccountParams) => {
    if (!params?.provider) {
      throw new Error("Provider is required");
    }

    if (params.id) {
      // Update existing
      await db
        .update(accounts)
        .set({
          provider: params.provider,
          externalId: params.externalId ?? null,
          email: params.email ?? null,
          name: params.name ?? null,
          avatarUrl: params.avatarUrl ?? null,
          isActive: params.isActive ?? false,
          updatedAt: new Date(),
        })
        .where(eq(accounts.id, params.id));
    } else {
      // Insert new
      await db.insert(accounts).values({
        provider: params.provider,
        externalId: params.externalId ?? null,
        email: params.email ?? null,
        name: params.name ?? null,
        avatarUrl: params.avatarUrl ?? null,
        isActive: params.isActive ?? false,
      });
    }

    const rows = await db
      .select()
      .from(accounts)
      .orderBy(desc(accounts.updatedAt));
    return rows as unknown as Account[];
  });

  // Set active account
  handle("accounts:set-active", async (_event, params: SetActiveAccountParams) => {
    if (!params?.id) {
      throw new Error("Account id is required");
    }
    const existing = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, params.id));
    if (!existing?.[0]) {
      throw new Error(`Account ${params.id} not found`);
    }

    // Deactivate all, then activate this one
    await db.update(accounts).set({ isActive: false });
    await db.update(accounts).set({ isActive: true, updatedAt: new Date() }).where(eq(accounts.id, params.id));

    const rows = await db
      .select()
      .from(accounts)
      .orderBy(desc(accounts.updatedAt));
    return rows as unknown as Account[];
  });
}