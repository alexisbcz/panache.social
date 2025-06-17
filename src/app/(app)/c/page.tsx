import { db } from "@/db";
import { communities } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function CommunitiesPage() {
  const allCommunities = await db.select().from(communities);

  return (
    <div className="container mx-auto">
      <div className="flex gap-4 items-center mb-8">
        <h1 className="text-2xl font-bold">Communities</h1>
        <Button asChild>
          <Link href="/c/new">Create Community</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allCommunities.map((community) => (
          <Link key={community.id} href={`/c/${community.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{community.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Language: {community.language}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
