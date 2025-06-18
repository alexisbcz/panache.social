"use server";

import { db } from "@/db";
import { posts, users, communities, likes } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type CommunityPost = {
  id: string;
  title: string;
  text: string | null;
  url: string | null;
  authorId: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  isLiked: boolean;
  author: {
    id: string;
    username: string;
    image: string | null;
  };
};

export async function getCommunityPosts({
  slug,
  sort = "new",
  timeFrame = "all",
}: {
  slug: string;
  sort?: "top" | "new";
  timeFrame?: "today" | "week" | "month" | "year" | "all";
}) {
  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Get the community
  const community = await db
    .select()
    .from(communities)
    .where(eq(communities.slug, slug))
    .limit(1);

  if (!community.length) {
    throw new Error("Community not found");
  }

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
    .where(sql`${posts.communityId} = ${community[0].id} AND ${timeFilter}`)
    .orderBy(orderBy)
    .limit(50);

  // If user is logged in, check which posts they've liked
  let likedPostIds: string[] = [];
  if (session?.user) {
    const userLikes = await db
      .select({ postId: likes.postId })
      .from(likes)
      .where(eq(likes.userId, session.user.id));
    
    likedPostIds = userLikes.map(like => like.postId);
  }

  // Add isLiked property to each post
  const postsWithLikeStatus = fetchedPosts.map(post => ({
    ...post,
    isLiked: likedPostIds.includes(post.id),
  }));

  return {
    community: community[0],
    posts: postsWithLikeStatus,
  };
}
