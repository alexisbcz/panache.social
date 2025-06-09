"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface CommentCardProps {
  id: string;
  content: string;
  author: string;
  likes: number;
  postedAt: string;
}

export const CommentCard = ({
  content,
  author,
  likes: initialLikes,
  postedAt,
}: CommentCardProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const { toast } = useToast();

  const handleLike = async () => {
    try {
      // TODO: Implement server-side like action
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
        description: "Failed to update like status",
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
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            {likes}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Posted by</span>
            <Link href={`/u/${author}`} className="hover:underline">
              u/{author}
            </Link>
            <span>•</span>
            <span>{postedAt}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="ghost" size="sm" className="gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>Reply</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
