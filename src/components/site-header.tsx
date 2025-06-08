import { SearchForm } from "@/components/search-form"
import { ToggleSidebarButton } from "./toggle-sidebar-button"
import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { NavUser } from "./nav-user"

export function SiteHeader() {
  return (
    <header className="px-4 bg-background sticky top-0 z-50 flex flex-wrap w-full items-center border-b py-3 sm:py-0 sm:h-(--header-height) justify-between gap-2">
        <div className="flex items-center gap-2">
          <ToggleSidebarButton />
          <span className="font-pirata text-3xl">Panache</span>
        </div>

        <SearchForm />

        <div className="flex flex-wrap items-center gap-2">
          <NavUser user={{
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "https://github.com/shadcn.png"
          }} />
          <Link className={buttonVariants({ variant: "outline" })} href="/login">
            <span>Log In</span>
          </Link>
          <Link className={buttonVariants({ variant: "default" })} href="/signup">
            <span>Sign Up</span>
        </Link>
      </div>
    </header>
  )
}
