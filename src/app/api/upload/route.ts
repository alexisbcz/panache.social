import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    // Get file extension
    const extension = file.name.split('.').pop();
    // Generate unique ID with original extension
    const uniqueId = `${createId()}.${extension}`;

    const blob = await put(uniqueId, file, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
