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
import { SelectGroup } from "@radix-ui/react-select";
import { PostCard } from "@/components/post-card";
import { type Post } from "../actions";
import { useRouter, useSearchParams } from "next/navigation";

interface PostsViewProps {
  initialPosts: Post[];
  initialSort: string;
  initialTimeFrame: string;
}

export function PostsView({
  initialPosts,
  initialSort,
  initialTimeFrame,
}: PostsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`?${params.toString()}`);
  };

  const handleTimeFrameChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("timeFrame", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs
      value={initialSort}
      onValueChange={handleSortChange}
      className="w-full"
    >
      <div className="flex items-center gap-4">
        <TabsList>
          <TabsTrigger value="top">Top</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>

        <TabsContent value="top">
          <Select
            value={initialTimeFrame}
            onValueChange={handleTimeFrameChange}
          >
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
          {initialPosts.length === 0 ? (
            <div className="text-center py-8">No posts found</div>
          ) : (
            initialPosts.map((post) => (
              <PostCard key={post.id} post={post} truncate />
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="top" className="mt-4">
        <div className="flex flex-col gap-4">
          {initialPosts.length === 0 ? (
            <div className="text-center py-8">No posts found</div>
          ) : (
            initialPosts.map((post) => (
              <PostCard key={post.id} post={post} truncate />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
