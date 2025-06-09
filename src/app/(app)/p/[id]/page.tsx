import { getPost } from "./actions";
import { formatDistanceToNow } from "date-fns";
import { PostCard } from "@/components/post-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./comment-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);
  console.log(post);

  return (
    <div className="flex flex-col gap-4 p-4">
      <PostCard
        id={post.id}
        title={post.title}
        content={post.text || ""}
        url={post.url || undefined}
        author={post.author.username}
        likes={post.likesCount}
        comments={post.commentsCount}
        postedAt={formatDistanceToNow(post.createdAt, { addSuffix: true })}
      />

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Comments</h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CommentForm postId={post.id} />
            <div className="flex flex-col gap-4">
              {post.comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Link
                          href={`/u/${comment.author.username}`}
                          className="hover:underline"
                        >
                          u/{comment.author.username}
                        </Link>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(comment.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Heart className="h-4 w-4" />
                          <span>0</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>Reply</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
