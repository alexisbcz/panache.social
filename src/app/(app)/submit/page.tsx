"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CommunitySelector } from "@/components/community-selector";
import { submitPost } from "./actions";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";

export default function Submit() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const communityId = formData.get("communityId") as string;

    // Convert image to base64 if present
    let imageBase64: string | undefined;
    if (image) {
      const reader = new FileReader();
      imageBase64 = await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.readAsDataURL(image);
      });
    }

    await submitPost({
      title,
      text: activeTab === "text" ? text : undefined,
      url: activeTab === "link" ? url : undefined,
      image: activeTab === "image" ? imageBase64 : undefined,
      communityId,
    });

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-bold">Submit a post</h1>

      <div className="grid items-center gap-1.5">
        <Label htmlFor="community">Community</Label>
        <CommunitySelector name="communityId" required />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="link">Link</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
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
            <Label htmlFor="text">Content</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Can you believe it? I'll have a hard time processing this information."
              className="min-h-[100px]"
              required={activeTab === "text"}
            />
          </div>
        </TabsContent>

        <TabsContent value="link" className="mt-4">
          <div className="grid items-center gap-1.5">
            <Label htmlFor="url">Link</Label>
            <Input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
              required={activeTab === "link"}
            />
          </div>
        </TabsContent>

        <TabsContent value="image" className="mt-4">
          <div className="grid items-center gap-1.5">
            <ImageUpload
              name="image"
              label="Image"
              value={image}
              onChange={setImage}
              required={activeTab === "image"}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
