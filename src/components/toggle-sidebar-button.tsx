"use client"

import { SidebarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function ToggleSidebarButton() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      className="sm:hidden h-8 w-8"
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
    >
      <SidebarIcon />
    </Button>
  )
} 