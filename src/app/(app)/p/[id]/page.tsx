import { getPost } from "./actions";
import { formatDistanceToNow } from "date-fns";
import { PostCard } from "@/components/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./comment-form";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PostCard post={post} />

      <Separator className="my-2" />

      <div className="flex flex-col gap-4 px-2" id="comments">
        <h2 className="text-lg font-medium">Comments</h2>
        <CommentForm postId={post.id} />
        <div className="flex flex-col gap-4">
          {post.comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
