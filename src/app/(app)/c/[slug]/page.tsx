import { getCommunityPosts } from "./actions";
import { PostsView } from "@/app/(app)/_components/posts-view";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; timeFrame?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { community } = await getCommunityPosts({ slug });

  return {
    title: `r/${community.title} - Panache.social`,
    description: community.description || `Welcome to r/${community.title}`,
    openGraph: {
      title: `r/${community.title} - Panache.social`,
      description: community.description || `Welcome to r/${community.title}`,
      type: "website",
      url: `https://panache.social/c/${slug}`,
      images: community.bannerImage
        ? [{ url: community.bannerImage }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `r/${community.title} - Panache.social`,
      description: community.description || `Welcome to r/${community.title}`,
      images: community.bannerImage ? [community.bannerImage] : undefined,
    },
  };
}

export default async function CommunityPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const params_ = await searchParams;
  const sort = params_.sort || "top";
  const timeFrame = params_.timeFrame || "month";

  const { community, posts } = await getCommunityPosts({
    slug,
    sort: sort as "top" | "new",
    timeFrame: timeFrame as "today" | "week" | "month" | "year" | "all",
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Community Header */}
      <div className="relative">
        {community.bannerImage && (
          <div className="relative w-full h-48">
            <Image
              src={community.bannerImage}
              alt={`${community.title} banner`}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        )}
        <div className="flex items-end gap-4 p-4 bg-card rounded-b-lg">
          {community.iconImage && (
            <div className="relative w-20 h-20 -mt-10">
              <Image
                src={community.iconImage}
                alt={`${community.title} icon`}
                fill
                className="object-cover rounded-full border-4 border-background"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">r/{community.title}</h1>
            {community.description && (
              <p className="text-muted-foreground">{community.description}</p>
            )}
          </div>
          <Button asChild>
            <Link href="/submit">Create Post</Link>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Posts */}
      <PostsView
        initialPosts={posts}
        initialSort={sort}
        initialTimeFrame={timeFrame}
      />
    </div>
  );
}
