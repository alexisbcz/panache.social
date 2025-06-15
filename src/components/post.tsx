import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { PostWithAuthor } from "@/db/schema";

export function Post({ post }: { post: PostWithAuthor }) {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={post.author.image || undefined} />
          <AvatarFallback>
            {post.author.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{post.author.username}</span>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        {post.text && <p className="text-muted-foreground">{post.text}</p>}
        {post.url && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {post.url}
          </a>
        )}
        {post.image && (
          <div className="relative w-full aspect-video">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-contain rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2">
          <ThumbsUp className="h-4 w-4" />
          {post.likesCount}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          {post.commentsCount}
        </Button>
      </div>
    </div>
  );
}
