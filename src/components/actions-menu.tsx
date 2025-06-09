"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { NavUser } from "@/components/nav-user";
import { authClient } from "@/lib/auth-client";

export function ActionsMenu() {
  const session = authClient.useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, show a consistent loading state
  if (!mounted) {
    return (
      <div className="flex-1 flex justify-end items-center gap-2">
        <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-end items-center gap-2">
      {session.isPending ? (
        <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
      ) : session.data?.user ? (
        <>
          <Link className={buttonVariants({ variant: "ghost" })} href="/submit">
            <PlusIcon className="size-4" />
            <span>Submit</span>
          </Link>
          <NavUser
            user={{
              name: session.data.user.name,
              avatar: session.data.user.image || "",
            }}
          />
        </>
      ) : (
        <>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/log-in"
          >
            <span>Log In</span>
          </Link>
          <Link
            className={buttonVariants({ variant: "default" })}
            href="/sign-up"
          >
            <span>Sign Up</span>
          </Link>
        </>
      )}
    </div>
  );
}
