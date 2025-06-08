"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageSquare, Share2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface PostCardProps {
  title: string;
  content?: string;
  author: string;
  likes: number;
  comments: number;
  postedAt: string;
}

export const PostCard = ({
  title,
  content,
  author,
  likes: initialLikes,
  comments,
  postedAt,
}: PostCardProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const postUrl = `https://panache.social/posts/123`;

  const { toast } = useToast();

  const handleLike = () => {
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Unliked" : "Liked!",
      description: isLiked ? "Post unliked" : "Post liked successfully",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast({
        title: "Link copied!",
        description: "Post link has been copied to your clipboard.",
      });
    } catch (err) {
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
            className={`sm:!-mt-2 h-8 w-8 transition-all duration-200 ${isLiked ? 'text-rose-500 scale-110' : 'text-muted-foreground hover:text-rose-500 hover:bg-rose-50'}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <span className="text-xs text-muted-foreground font-medium">{likes}</span>
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
          <Link href={`/posts/123`} className="text-lg font-medium hover:underline">
            {title}
          </Link>
        </div>
      </CardHeader>
      {content && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{content}</p>
        </CardContent>
      )}
      <CardFooter className="flex gap-2">
        <Button variant="ghost" size="sm" className="gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{comments} Comments</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={copyToClipboard} className="gap-2 text-xs">
              <LinkIcon className="h-4 w-4" />
              <span>Copy Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
} 