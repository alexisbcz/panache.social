"use client";

import { SharePostDropdown } from "./share-post-dropdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, MessageSquare, Link as LinkIcon, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import {
  deletePost,
  toggleLike,
  hasLikedPost,
} from "@/app/(app)/p/[id]/actions";
import { useRouter } from "next/navigation";
import { PostActionsDropdown } from "./post-actions-dropdown";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  text?: string | null;
  url?: string | null;
  image?: string | null;
  author: {
    username: string;
  };
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
}

interface PostCardProps {
  post: Post;
  truncate?: boolean;
}

export const PostCard = ({ post, truncate = false }: PostCardProps) => {
  const [likes, setLikes] = useState(post.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const postUrl = `https://panache.social/p/${post.id}`;
  const session = authClient.useSession();
  const isOwner = session.data?.user?.name === post.author.username;
  const router = useRouter();

  const { toast } = useToast();

  // Initialize like state
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (session.data?.user) {
        const liked = await hasLikedPost(post.id);
        setIsLiked(liked);
      }
    };
    checkLikeStatus();
  }, [post.id, session.data?.user]);

  const handleLike = async () => {
    if (!session.data?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLiking(true);
      await toggleLike(post.id);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Unliked" : "Liked!",
        description: isLiked ? "Post unliked" : "Post liked successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="!gap-4">
      <CardHeader className="flex flex-row sm:items-center gap-2">
        <div className="flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className={`sm:!-mt-2 h-8 w-8 transition-all duration-200 ${isLiked ? "text-rose-500 scale-110" : "text-muted-foreground hover:text-rose-500 hover:bg-rose-50"}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            {likes}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Posted by {post.author.username}</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(post.createdAt, { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/p/${post.id}`}
              className="text-lg font-medium hover:underline"
            >
              {post.title}
            </Link>
            {post.url ? (
              <Badge
                variant="secondary"
                className="gap-1 bg-sky-50 text-sky-600"
              >
                <LinkIcon className="h-3 w-3" />
                <span>Link</span>
              </Badge>
            ) : post.text ? (
              <Badge
                variant="secondary"
                className="gap-1 bg-violet-50 text-violet-600"
              >
                <FileText className="h-3 w-3" />
                <span>Text</span>
              </Badge>
            ) : post.image ? (
              <Badge
                variant="secondary"
                className="gap-1 bg-emerald-50 text-emerald-600"
              >
                <ImageIcon className="h-3 w-3" />
                <span>Image</span>
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {post.text && (
          <p
            className={cn(
              "text-sm text-muted-foreground",
              truncate ? "line-clamp-3" : "whitespace-pre-wrap",
            )}
          >
            {post.text}
          </p>
        )}
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="line-clamp-1 truncate break-all text-sm text-blue-500 hover:underline"
          >
            {post.url}
          </a>
        )}
        {post.image && (
          <div className="relative w-full aspect-video mt-2">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link href={`/p/${post.id}#comments`}>
            <MessageSquare className="h-4 w-4" />
            <span>
              {post.commentsCount} Comment{post.commentsCount === 1 ? "" : "s"}
            </span>
          </Link>
        </Button>

        <SharePostDropdown postUrl={postUrl} />
        <PostActionsDropdown
          postId={post.id}
          isOwner={isOwner}
          onDelete={handleDelete}
        />
      </CardFooter>
    </Card>
  );
};
