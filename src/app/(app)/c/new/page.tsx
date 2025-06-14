"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LanguageSelector } from "@/components/language-selector";
import { ImageUpload } from "@/components/image-upload";
import { useState } from "react";
import { createCommunity } from "./actions";
import { ArrowRight } from "lucide-react";

export default function NewCommunityPage() {
  const [currentStep, setCurrentStep] = useState<"basic" | "images">("basic");
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    slug: string;
    language: string;
    iconImage?: File | null;
    bannerImage?: File | null;
  }>({
    title: "",
    description: "",
    slug: "",
    language: "",
    iconImage: null,
    bannerImage: null,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentStep("images");
  };

  const handleFinalSubmit = async () => {
    const finalFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        finalFormData.append(key, value);
      }
    });
    await createCommunity(finalFormData);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-bold">Create New Community</h1>

        {currentStep === "basic" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-muted-foreground">(required)</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter community title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Tell us about your community"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-muted-foreground">(required)</span>
              </Label>
              <div className="flex items-center whitespace-nowrap">
                <span className="inline-flex items-center h-9 px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground shrink-0">
                  /c/
                </span>
                <Input
                  id="slug"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="rounded-l-none flex-1"
                  placeholder="enter-community-slug"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This will be used in the URL. Use only lowercase letters,
                numbers, and hyphens.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">
                Language{" "}
                <span className="text-muted-foreground">(required)</span>
              </Label>
              <LanguageSelector
                name="language"
                required
                value={formData.language}
                onChange={(value) =>
                  setFormData({ ...formData, language: value })
                }
              />
            </div>

            <div className="flex">
              <Button type="submit">
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-8">
              <ImageUpload
                name="iconImage"
                label="Community Icon (optional)"
                aspectRatio="square"
                value={formData.iconImage}
                onChange={(file) =>
                  setFormData({ ...formData, iconImage: file })
                }
              />

              <ImageUpload
                name="bannerImage"
                label="Banner Image (optional)"
                aspectRatio="banner"
                value={formData.bannerImage}
                onChange={(file) =>
                  setFormData({ ...formData, bannerImage: file })
                }
              />
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setCurrentStep("basic")}>
                Back
              </Button>
              <Button onClick={handleFinalSubmit}>Create Community</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
