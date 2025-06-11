import { getPost } from "./actions";
import { PostCard } from "@/components/post-card";
import Link from "next/link";
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
import { CommentCard } from "@/components/comment-card";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  return {
    title: post.title,
    description:
      post.text?.slice(0, 160) || "Check out this post on Panache.social",
    openGraph: {
      title: post.title,
      description:
        post.text?.slice(0, 160) || "Check out this post on Panache.social",
      type: "article",
      url: `https://panache.social/p/${id}`,
      images: post.url ? [{ url: post.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description:
        post.text?.slice(0, 160) || "Check out this post on Panache.social",
      images: post.url ? [post.url] : undefined,
    },
  };
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
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}
