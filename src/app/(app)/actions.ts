"use server";

import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export type Post = {
  id: string;
  title: string;
  text: string | null;
  url: string | null;
  authorId: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    image: string | null;
  };
};

export async function getPosts({
  sort = "new",
  timeFrame = "all",
}: {
  sort?: "top" | "new";
  timeFrame?: "today" | "week" | "month" | "year" | "all";
} = {}) {
  // Build the time filter
  let timeFilter = sql`1=1`; // Default to no time filter
  if (timeFrame !== "all") {
    const now = new Date();
    const startDate = new Date();

    switch (timeFrame) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    timeFilter = sql`${posts.createdAt} >= ${startDate}`;
  }

  // Build the order by clause
  const orderBy =
    sort === "top" ? desc(posts.likesCount) : desc(posts.createdAt);

  // Fetch posts with author information
  const fetchedPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      text: posts.text,
      url: posts.url,
      authorId: posts.authorId,
      likesCount: posts.likesCount,
      commentsCount: posts.commentsCount,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      author: {
        id: users.id,
        username: users.username,
        image: users.image,
      },
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(timeFilter)
    .orderBy(orderBy)
    .limit(50);

  return fetchedPosts;
}
