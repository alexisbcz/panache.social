"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";

export async function checkUsernameAvailability(username: string, currentUserId: string) {
  const existingUser = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.username, username),
        not(eq(users.id, currentUserId))
      )
    )
    .limit(1);

  return {
    isAvailable: existingUser.length === 0,
  };
} 