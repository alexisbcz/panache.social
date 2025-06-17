"use server";

import { HeaderContent } from "./header-content";
import { ActionsMenu } from "./actions-menu";

export async function SiteHeader() {
  return (
    <HeaderContent>
      <ActionsMenu /> 
    </HeaderContent>
  );
}