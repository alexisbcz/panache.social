"use server";

import {
  posts,
  users,
  comments,
  likes,
  commentLikes,
  Comment,
  User,
} from "@/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";
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
  isLiked: boolean;
  author: {
    id: string;
    username: string;
    image: string | null;
  };
  comments: Array<Comment & { author: User }>;
};

export async function getPost(id: string): Promise<PostWithComments> {
  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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

  // Check if user has liked this post
  let isLiked = false;
  if (session?.user) {
    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, id), eq(likes.userId, session.user.id)))
      .limit(1);
    
    isLiked = existingLike.length > 0;
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
      likesCount: comments.likesCount,
      postId: comments.postId,
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.postId, id))
    .orderBy(desc(comments.likesCount));

  return {
    ...post[0],
    isLiked,
    comments: postComments.map((comment) => ({
      ...comment,
      author: {
        ...comment.author,
        email: "",
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })),
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

  // Increment the post's comment count
  await db
    .update(posts)
    .set({
      commentsCount: sql`${posts.commentsCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId));

  revalidatePath(`/p/${postId}`);
}

export async function deletePost(postId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be logged in to delete a post");
  }

  // Get the post to check ownership
  const post = await db
    .select({
      authorId: posts.authorId,
    })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!post.length) {
    throw new Error("Post not found");
  }

  // Check if the user is the author of the post
  if (post[0].authorId !== session.user.id) {
    throw new Error("You can only delete your own posts");
  }

  // Delete the post
  await db.delete(posts).where(eq(posts.id, postId));

  // Revalidate the home page and post page
  revalidatePath("/");
  revalidatePath(`/p/${postId}`);

  // Redirect to home page
  redirect("/");
}

export async function toggleLike(postId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be logged in to like posts");
  }

  const userId = session.user.id;

  // Check if the user has already liked the post
  const existingLike = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
    .limit(1);

  if (existingLike.length > 0) {
    // Unlike the post
    await db
      .delete(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

    // Decrement likes count
    await db
      .update(posts)
      .set({
        likesCount: sql`${posts.likesCount} - 1`,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));
  } else {
    // Like the post
    await db.insert(likes).values({
      id: nanoid(),
      postId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Increment likes count
    await db
      .update(posts)
      .set({
        likesCount: sql`${posts.likesCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));
  }

  revalidatePath(`/p/${postId}`);
  revalidatePath("/");
}

export async function hasLikedPost(postId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return false;
  }

  const existingLike = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, session.user.id)))
    .limit(1);

  return existingLike.length > 0;
}

export async function deleteComment(commentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be logged in to delete comments");
  }

  // Get the comment and its post ID
  const comment = await db
    .select({
      id: comments.id,
      authorId: comments.authorId,
      postId: comments.postId,
    })
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1);

  if (!comment.length) {
    throw new Error("Comment not found");
  }

  if (comment[0].authorId !== session.user.id) {
    throw new Error("You can only delete your own comments");
  }

  // Delete the comment
  await db.delete(comments).where(eq(comments.id, commentId));

  // Decrement the post's comment count
  await db
    .update(posts)
    .set({
      commentsCount: sql`${posts.commentsCount} - 1`,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, comment[0].postId));

  revalidatePath(`/p/${comment[0].postId}`);
  revalidatePath("/");
}

export async function toggleCommentLike(commentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("You must be logged in to like comments");
  }

  const userId = session.user.id;

  // Check if the user has already liked the comment
  const existingLike = await db
    .select()
    .from(commentLikes)
    .where(
      and(
        eq(commentLikes.commentId, commentId),
        eq(commentLikes.userId, userId),
      ),
    )
    .limit(1);

  if (existingLike.length > 0) {
    // Unlike the comment
    await db
      .delete(commentLikes)
      .where(
        and(
          eq(commentLikes.commentId, commentId),
          eq(commentLikes.userId, userId),
        ),
      );

    // Decrement likes count
    await db
      .update(comments)
      .set({
        likesCount: sql`${comments.likesCount} - 1`,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId));
  } else {
    // Like the comment
    await db.insert(commentLikes).values({
      id: nanoid(),
      commentId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Increment likes count
    await db
      .update(comments)
      .set({
        likesCount: sql`${comments.likesCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId));
  }

  revalidatePath(`/p/${commentId}`);
}

export async function hasLikedComment(commentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return false;
  }

  const existingLike = await db
    .select()
    .from(commentLikes)
    .where(
      and(
        eq(commentLikes.commentId, commentId),
        eq(commentLikes.userId, session.user.id),
      ),
    )
    .limit(1);

  return existingLike.length > 0;
}
