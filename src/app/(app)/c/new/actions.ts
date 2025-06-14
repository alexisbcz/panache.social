"use server";

import { db } from "@/db";
import { communities } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCommunity(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const language = formData.get("language") as string;
  const description = formData.get("description") as string;
  const bannerImage = formData.get("bannerImage") as string;
  const iconImage = formData.get("iconImage") as string;

  if (!title || !slug || !language) {
    throw new Error("Title, slug, and language are required");
  }

  try {
    await db.insert(communities).values({
      title,
      slug,
      language,
      description: description || null,
      bannerImage: bannerImage || null,
      iconImage: iconImage || null,
    });

    revalidatePath("/c");
    redirect("/c");
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique constraint")) {
      throw new Error("A community with this slug already exists");
    }
    throw error;
  }
}
