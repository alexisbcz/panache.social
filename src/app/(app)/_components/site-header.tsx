"use server";

import { HeaderContent } from "./header-content";
import { ActionsMenu } from "./actions-menu";
import { ToggleThemeButton } from "@/components/toggle-theme-button";

export async function SiteHeader() {
  return (
    <HeaderContent>
      <div className="flex items-center gap-2">
        <ToggleThemeButton />
        <ActionsMenu />
      </div>
    </HeaderContent>
  );
}