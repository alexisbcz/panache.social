"use client";

import Link from "next/link";
import { ToggleSidebarButton } from "../../../components/toggle-sidebar-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { ToggleThemeButton } from "@/components/toggle-theme-button";

export function HeaderContent({ children }: { children: React.ReactNode }) {
  return (
    <header className="px-4 py-3 sm:py-0 bg-background sticky top-0 z-50 flex flex-wrap w-full items-center border-b sm:h-[var(--header-height)] justify-between gap-2">
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
      <div className="flex gap-2">
        <ToggleThemeButton />
        {children}
      </div>
    </header>
  );
}