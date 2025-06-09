import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { users, accounts, sessions, verifications } from "@/db/schema";

export const auth = betterAuth({
  user: {
    fields: {
      name: "username",
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      users,
      accounts,
      sessions,
      verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    hashPassword: true,
  },
});
