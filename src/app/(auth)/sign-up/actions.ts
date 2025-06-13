"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkUsername(username: string) {
  const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);

  return {
    isAvailable: !existingUser,
  };
} 