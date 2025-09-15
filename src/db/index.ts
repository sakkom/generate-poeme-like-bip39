import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL!;

//transaction pooler => {prepar: false}, now is session pooler
export const client = postgres(databaseUrl, { prepare: false });
export const db = drizzle(client);
