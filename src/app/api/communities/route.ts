import { db } from "@/db";
import { communities } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const allCommunities = await db.select().from(communities);
  return NextResponse.json(allCommunities);
}
