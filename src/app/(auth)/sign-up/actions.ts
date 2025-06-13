"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkUsername(username: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return {
    isAvailable: !existingUser,
  };
} 