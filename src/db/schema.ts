import { KanjiKanaMeaning } from "@/interface/dictInterface";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const hashsTable = pgTable("hashs_table", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  // opened: boolean("monostic").default(false).notNull(),
  // poem: text("poem").array().$type<KanjiKanaMeaning>(),
  // createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type InsertUser = typeof hashsTable.$inferInsert;
export type SelectUser = typeof hashsTable.$inferSelect;
