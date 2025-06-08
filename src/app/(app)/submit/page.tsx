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
            placeholder="TIFU by showing my cat a mirror and now he's having an existential crisis"
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
              placeholder="So there I was, minding my own business, when I decided to show my cat his reflection in a mirror. Little did I know, I was about to witness a full-blown existential crisis. He's been staring at his reflection for 3 hours now, occasionally looking at his paws and back at the mirror. I think he's questioning the very fabric of reality. AITA for making my cat question his entire existence?"
              className="min-h-[200px]"
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
              placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ (I swear it's not a rickroll... unless?)"
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
