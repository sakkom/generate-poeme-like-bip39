// import { JMdicWord } from "@/interface/dictInterface";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const hashsTable = pgTable("hashs_table", {
  id: serial("id").primaryKey(),
  hash: text("hash").notNull(),
  // opened: boolean("monostic").default(false).notNull(),
  // poem: text("poem").array().$type<JMdicWord>(),
  // createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dictionaryTable = pgTable("dictionary", {
  id: serial("id").primaryKey(),
  kana: text("kana").notNull(),
  kanji: text("kanji"),
  meaning: text("meaning"),
  syllables: integer("syllables").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// export type InsertUser = typeof hashsTable.$inferInsert;
// export type SelectUser = typeof hashsTable.$inferSelect;

export type InsertDictionary = typeof dictionaryTable.$inferInsert;
export type SelectDictionary = typeof dictionaryTable.$inferSelect;
