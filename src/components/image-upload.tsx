"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  name: string;
  label: string;
  aspectRatio?: "square" | "banner";
  required?: boolean;
  value?: File | null;
  onChange?: (file: File | null) => void;
}

export function ImageUpload({
  name,
  label,
  aspectRatio = "square",
  required,
  onChange,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) {
      onChange?.(null);
      return;
    }

    setIsUploading(true);

    try {
      // Create a preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();

      // Update the hidden input with the blob URL
      const input = document.querySelector(
        `input[name="${name}"]`
      ) as HTMLInputElement;
      if (input) {
        input.value = url;
      }

      onChange?.(file);
    } catch (error) {
      console.error("Upload error:", error);
      setPreview(null);
      onChange?.(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await handleFile(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center gap-4">
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex items-center justify-center bg-muted rounded-lg overflow-hidden cursor-pointer transition-colors ${
            aspectRatio === "square" ? "w-24 h-24" : "w-full h-32"
          } ${
            isDragging
              ? "ring-2 ring-primary ring-offset-2 bg-muted/80"
              : "hover:bg-muted/80"
          }`}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes={aspectRatio === "square" ? "96px" : "100vw"}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="w-6 h-6" />
              <span className="text-xs text-center">
                Click or drag to upload
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <Input
            ref={fileInputRef}
            type="file"
            id={name}
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            required={required}
            className="hidden"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {aspectRatio === "square"
              ? "Recommended: 256x256px"
              : "Recommended: 1920x256px"}
          </p>
        </div>
      </div>
      <input type="hidden" name={name} required={required} />
    </div>
  );
}
