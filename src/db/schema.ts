// import { JMdicWord } from "@/interface/dictInterface";
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
  opened: boolean("opened").default(false).notNull(),
  poetry: text("poetry").default(null),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dictionaryTable = pgTable("dictionary", {
  id: serial("id").primaryKey(),
  kana: text("kana").notNull(),
  kanji: text("kanji"),
  meaning: text("meaning"),
  syllables: integer("syllables").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customDictionaryTable = pgTable("custom_dictionary", {
  id: serial("id").primaryKey(),
  kana: text("kana").notNull(),
  kanji: text("kanji"),
  syllables: integer("syllables").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// export type InsertUser = typeof hashsTable.$inferInsert;
// export type SelectUser = typeof hashsTable.$inferSelect;

export type InsertDictionary = typeof dictionaryTable.$inferInsert;
export type SelectDictionary = typeof dictionaryTable.$inferSelect;

export type InsertCustomDictionary = typeof customDictionaryTable.$inferInsert;
