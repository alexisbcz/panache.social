"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function submitPost(formData: {
  title: string;
  text?: string;
  url?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check if session exists and has user data
  if (!session || session instanceof Error || !session.user) {
    throw new Error("You must be logged in to submit a post");
  }

  const { title, text, url } = formData;

  // Validate that either text or url is provided
  if (!text && !url) {
    throw new Error("Either text or URL must be provided");
  }

  // Create the post
  const [post] = await db
    .insert(posts)
    .values({
      title,
      text: text || null,
      url: url || null,
      authorId: session.user.id,
    })
    .returning();

  // Revalidate the home page to show the new post
  revalidatePath("/");

  // Redirect to the post page
  redirect(`/p/${post.id}`);
}
