"use server";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { NavUser } from "@/components/nav-user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function ActionsMenu() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex-1 flex justify-end items-center gap-2">
      {!session?.user ? (
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
      ) : (
        <>
          <Link className={buttonVariants({ variant: "ghost" })} href="/submit">
            <PlusIcon className="size-4" />
            <span>Submit</span>
          </Link>
          <NavUser
            user={{
              name: session.user.name,
              avatar: session.user.image || "",
            }}
          />
        </>
      )}
    </div>
  );
}
