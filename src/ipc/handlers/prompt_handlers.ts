import { IpcMainInvokeEvent } from "electron";
import log from "electron-log";
import { createLoggedHandler } from "./safe_handle";
import { db, isPostgresDatabase } from "@/db";
import * as sqliteSchema from "@/db/schema";
import * as pgSchema from "@/db/schema-postgres";
import { eq } from "drizzle-orm";
import {
  CreatePromptParamsDto,
  PromptDto,
  UpdatePromptParamsDto,
} from "../ipc_types";

const logger = log.scope("prompt_handlers");
const handle = createLoggedHandler(logger);

export function registerPromptHandlers() {
  handle("prompts:list", async (): Promise<PromptDto[]> => {
    const table = isPostgresDatabase() ? pgSchema.prompts : sqliteSchema.prompts;
    const rows = isPostgresDatabase()
      ? await db.select().from(table)
      : db.select().from(table).all();
    return rows.map((r: any) => ({
      id: r.id!,
      title: r.title,
      description: r.description ?? null,
      content: r.content,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  });

  handle(
    "prompts:create",
    async (
      _e: IpcMainInvokeEvent,
      params: CreatePromptParamsDto,
    ): Promise<PromptDto> => {
      const { title, description, content } = params;
      if (!title || !content) {
        throw new Error("Title and content are required");
      }

      const table = isPostgresDatabase() ? pgSchema.prompts : sqliteSchema.prompts;

      if (isPostgresDatabase()) {
        const inserted = await db
          .insert(table)
          .values({
            title,
            description: description ?? null,
            content,
          })
          .returning();

        const r = inserted[0];
        return {
          id: r.id!,
          title: r.title,
          description: r.description ?? null,
          content: r.content,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        };
      } else {
        const result = db
          .insert(table)
          .values({
            title,
            description: description ?? null,
            content,
          })
          .run();

        const id = Number(result.lastInsertRowid);
        const row = db
          .select()
          .from(table)
          .where(eq(table.id, id))
          .get();
        if (!row) throw new Error("Failed to fetch created prompt");
        return {
          id: row.id!,
          title: row.title,
          description: row.description ?? null,
          content: row.content,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };
      }
    },
  );

  handle(
    "prompts:update",
    async (
      _e: IpcMainInvokeEvent,
      params: UpdatePromptParamsDto,
    ): Promise<void> => {
      const { id, title, description, content } = params;
      if (!id) throw new Error("Prompt id is required");
      if (!title || !content) throw new Error("Title and content are required");
      const now = new Date();
      const table = isPostgresDatabase() ? pgSchema.prompts : sqliteSchema.prompts;

      if (isPostgresDatabase()) {
        await db
          .update(table)
          .set({
            title,
            description: description ?? null,
            content,
            updatedAt: now,
          })
          .where(eq(table.id, id));
      } else {
        db
          .update(table)
          .set({
            title,
            description: description ?? null,
            content,
            updatedAt: now,
          })
          .where(eq(table.id, id))
          .run();
      }
    },
  );

  handle(
    "prompts:delete",
    async (_e: IpcMainInvokeEvent, id: number): Promise<void> => {
      if (!id) throw new Error("Prompt id is required");
      const table = isPostgresDatabase() ? pgSchema.prompts : sqliteSchema.prompts;
      if (isPostgresDatabase()) {
        await db.delete(table).where(eq(table.id, id));
      } else {
        db.delete(table).where(eq(table.id, id)).run();
      }
    },
  );
}
