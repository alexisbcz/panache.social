import { ToggleSidebarButton } from "./toggle-sidebar-button";
import { ActionsMenu } from "./actions-menu";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function SiteHeader() {
  return (
    <header className="px-4 py-3 sm:py-0 bg-background sticky top-0 z-50 flex flex-wrap w-full items-center border-b sm:h-(--header-height) justify-between gap-2">
      <div className="flex-1 flex items-center gap-2">
        <ToggleSidebarButton />
        <Tooltip>
          <TooltipTrigger>
            <Link href="/" className="font-pirata text-3xl">
              Panache
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go back home</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <ActionsMenu />
    </header>
  );
}
