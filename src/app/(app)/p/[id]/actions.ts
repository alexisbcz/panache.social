"use server";

import { posts, users, comments } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { db } from "@/db";

export type PostWithComments = {
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
  comments: Array<{
    id: string;
    content: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    author: {
      id: string;
      username: string;
      image: string | null;
    };
  }>;
};

export async function getPost(id: string): Promise<PostWithComments> {
  const post = await db
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
    .where(eq(posts.id, id))
    .limit(1);

  if (!post.length) {
    redirect("/404");
  }

  const postComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      authorId: comments.authorId,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      author: {
        id: users.id,
        username: users.username,
        image: users.image,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.postId, id))
    .orderBy(desc(comments.createdAt));

  return {
    ...post[0],
    comments: postComments,
  };
}

export async function addComment(postId: string, content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be logged in to comment");
  }

  if (!content.trim()) {
    throw new Error("Comment cannot be empty");
  }

  await db.insert(comments).values({
    id: nanoid(),
    postId,
    authorId: session.user.id,
    content: content.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
    likesCount: 0,
  });

  revalidatePath(`/p/${postId}`);
}
