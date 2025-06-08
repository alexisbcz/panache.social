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
import { useState } from "react";
import { SelectGroup } from "@radix-ui/react-select";
import { PostCard } from "@/components/post-card";

const samplePosts = [
  {
    title:
      "TIFU by showing my cat a mirror and now he's having an existential crisis",
    content:
      "So there I was, minding my own business, when I decided to show my cat his reflection in a mirror. Little did I know, I was about to witness a full-blown existential crisis. He's been staring at his reflection for 3 hours now, occasionally looking at his paws and back at the mirror. I think he's questioning the very fabric of reality.",
    author: "CatPhilosopher",
    community: "TIFU",
    likes: 4231,
    comments: 342,
    postedAt: "2 hours ago",
  },
  {
    title:
      "My roommate's plant collection has evolved into a full-blown jungle. I'm starting to hear bird calls.",
    content:
      "I haven't seen my roommate in 3 days. The plants have grown so tall they've blocked the windows. I'm pretty sure I saw a monkey swinging from the ceiling fan yesterday. Send help.",
    author: "JungleExplorer",
    community: "funny",
    likes: 15678,
    comments: 892,
    postedAt: "5 hours ago",
  },
  {
    title:
      "PSA: If you microwave a grape, it turns into plasma. Don't ask how I know.",
    content:
      "The fire department was very understanding. My cat now looks at me with a mix of fear and respect. The grape is fine, though.",
    author: "ScienceGoneWrong",
    community: "todayilearned",
    likes: 8923,
    comments: 567,
    postedAt: "8 hours ago",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("top");
  const [timeFrame, setTimeFrame] = useState("month");

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
            {samplePosts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top" className="mt-4">
          <div className="flex flex-col gap-4">
            {samplePosts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
