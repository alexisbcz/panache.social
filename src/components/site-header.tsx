import { SearchForm } from "@/components/search-form";
import { ToggleSidebarButton } from "./toggle-sidebar-button";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { NavUser } from "./nav-user";
import { PlusIcon } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="px-4 py-3 sm:py-0 bg-background sticky top-0 z-50 flex flex-wrap w-full items-center border-b sm:h-(--header-height) justify-between gap-2">
      <div className="flex-1 flex items-center gap-2">
        <ToggleSidebarButton />
        <span className="font-pirata text-3xl">Panache</span>
      </div>

      <div className="flex-1 flex justify-center">
        <SearchForm />
      </div>

      <div className="flex-1 flex justify-end items-center gap-2">
        <Link href="/submit">
          <Button variant="ghost">
            <PlusIcon className="size-4" />
            <span>Submit</span>
          </Button>
        </Link>
        <NavUser
          user={{
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "https://github.com/shadcn.png",
          }}
        />
        <Link className={buttonVariants({ variant: "outline" })} href="/login">
          <span>Log In</span>
        </Link>
        <Link className={buttonVariants({ variant: "default" })} href="/signup">
          <span>Sign Up</span>
        </Link>
      </div>
    </header>
  );
}
