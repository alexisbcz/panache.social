"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { CommentActionsDropdown } from "./comment-actions-dropdown";
import { formatDistanceToNow } from "date-fns";
import { Comment } from "@/db/schema";
import { toggleCommentLike, hasLikedComment } from "@/app/(app)/p/[id]/actions";
import { cn } from "@/lib/utils";
import { SafeFormattedContent } from "./ui/safe-formatted-content";

interface CommentCardProps {
  comment: Comment & {
    author: {
      username: string;
    };
  };
}

export const CommentCard = ({ comment }: CommentCardProps) => {
  const [likes, setLikes] = useState(comment.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const session = authClient.useSession();
  const isOwner = session.data?.user?.name === comment.author.username;

  const { toast } = useToast();

  // Initialize like state
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (session.data?.user) {
        const liked = await hasLikedComment(comment.id);
        setIsLiked(liked);
      }
    };
    checkLikeStatus();
  }, [comment.id, session.data?.user]);

  const handleLike = async () => {
    if (!session.data?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to like comments",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLiking(true);
      await toggleCommentLike(comment.id);
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Unliked" : "Liked!",
        description: isLiked ? "Comment unliked" : "Comment liked successfully",
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

  return (
    <Card className="!gap-2 !pt-4 !pb-2">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>
            Commented by {comment.author.username}{" "}
            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">
          <SafeFormattedContent content={comment.content} />
        </p>
      </CardContent>
      <CardFooter className="flex items-center gap-2 !pb-0">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "!size-8 !gap-1 transition-all duration-200",
            isLiked
              ? "text-rose-500 scale-110"
              : "text-muted-foreground hover:text-rose-500 hover:bg-rose-50",
          )}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className={`h-3 w-3 ${isLiked ? "fill-current" : ""}`} />
          <span className="text-xs text-muted-foreground font-medium">
            {likes}
          </span>
        </Button>
        {isOwner && <CommentActionsDropdown commentId={comment.id} />}
      </CardFooter>
    </Card>
  );
};
