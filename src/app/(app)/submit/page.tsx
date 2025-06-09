"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Submit() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [activeTab, setActiveTab] = useState("text");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form submission logic
    console.log({
      title,
      content: activeTab === "text" ? content : link,
      type: activeTab,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-3xl px-6 py-4"
    >
      <h1 className="text-2xl font-bold">Submit a post</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="link">Link</TabsTrigger>
        </TabsList>

        <div className="grid items-center gap-1.5 mt-4">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="BREAKING: Rick Astley isn't gringer anymore"
            required
          />
        </div>

        <TabsContent value="text" className="mt-4">
          <div className="grid items-center gap-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Can you believe it? I'll have a hard time processing this information."
              className="min-h-[100px]"
              required
            />
          </div>
        </TabsContent>

        <TabsContent value="link" className="mt-4">
          <div className="grid items-center gap-1.5">
            <Label htmlFor="link">Link</Label>
            <Input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
              required
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
