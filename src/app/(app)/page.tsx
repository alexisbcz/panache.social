import { getPosts } from "./actions";
import { PostsView } from "./_components/posts-view";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; timeFrame?: string }>;
}) {
  const params = await searchParams;
  const sort = params.sort || "top";
  const timeFrame = params.timeFrame || "month";

  const posts = await getPosts({
    sort: sort as "top" | "new",
    timeFrame: timeFrame as "today" | "week" | "month" | "year" | "all",
  });

  return (
    <div className="flex flex-col gap-4 p-4 max-w-5xl">
      <PostsView
        initialPosts={posts}
        initialSort={sort}
        initialTimeFrame={timeFrame}
      />
    </div>
  );
}
