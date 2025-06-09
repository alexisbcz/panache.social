"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { SelectGroup } from "@radix-ui/react-select";
import { PostCard } from "@/components/post-card";
import { getPosts, type Post } from "./actions";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const [activeTab, setActiveTab] = useState("top");
  const [timeFrame, setTimeFrame] = useState("month");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const fetchedPosts = await getPosts({
          sort: activeTab as "top" | "new",
          timeFrame: timeFrame as "today" | "week" | "month" | "year" | "all",
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [activeTab, timeFrame]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="top">Top</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>

          <TabsContent value="top">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger>
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time Frame</SelectLabel>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </TabsContent>
        </div>

        <TabsContent value="new" className="mt-4">
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">No posts found</div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.text || ""}
                  url={post.url || undefined}
                  author={post.author.username}
                  likes={post.likesCount}
                  comments={post.commentsCount}
                  postedAt={formatDistanceToNow(post.createdAt, {
                    addSuffix: true,
                  })}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="top" className="mt-4">
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">No posts found</div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.text || ""}
                  url={post.url || undefined}
                  author={post.author.username}
                  likes={post.likesCount}
                  comments={post.commentsCount}
                  postedAt={formatDistanceToNow(post.createdAt, {
                    addSuffix: true,
                  })}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
