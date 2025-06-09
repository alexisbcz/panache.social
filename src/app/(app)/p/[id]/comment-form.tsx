"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { addComment } from "./actions";
import { Label } from "@/components/ui/label";

interface CommentFormProps {
  postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addComment(postId, content);
      toast({
        title: "Comment submitted",
        description: "Your comment has been posted successfully.",
      });
      setContent("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="comment">New comment</Label>
        <Textarea
          placeholder="What are your thoughts?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
          id="comment"
        />
      </div>
      <div className="flex">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}
