"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Heart,
  MessageSquare,
  Share2,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  id: string;
  title: string;
  content?: string;
  url?: string;
  author: string;
  likes: number;
  comments: number;
  postedAt: string;
}

export const PostCard = ({
  id,
  title,
  content,
  url,
  author,
  likes: initialLikes,
  comments,
  postedAt,
}: PostCardProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const postUrl = `https://panache.social/p/${id}`;

  const { toast } = useToast();

  const handleLike = async () => {
    try {
      // TODO: Implement server-side like action
      setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Unliked" : "Liked!",
        description: isLiked ? "Post unliked" : "Post liked successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast({
        title: "Link copied!",
        description: "Post link has been copied to your clipboard.",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Couldn't copy the link to clipboard.",
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
          <div className="flex items-center gap-2">
            <Link
              href={`/p/${id}`}
              className="text-lg font-medium hover:underline"
            >
              {title}
            </Link>
            {url ? (
              <Badge
                variant="secondary"
                className="gap-1 bg-sky-50 text-sky-600"
              >
                <LinkIcon className="h-3 w-3" />
                <span>Link</span>
              </Badge>
            ) : content ? (
              <Badge
                variant="secondary"
                className="gap-1 bg-violet-50 text-violet-600"
              >
                <FileText className="h-3 w-3" />
                <span>Text</span>
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      {content && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{content}</p>
        </CardContent>
      )}
      {url && (
        <CardContent>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-500 hover:underline"
          >
            <span>{url}</span>
          </a>
        </CardContent>
      )}
      <CardFooter className="flex gap-2">
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link href={`/p/${id}`}>
            <MessageSquare className="h-4 w-4" />
            <span>{comments} Comments</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={copyToClipboard}
              className="gap-2 text-xs"
            >
              <LinkIcon className="h-4 w-4" />
              <span>Copy Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
