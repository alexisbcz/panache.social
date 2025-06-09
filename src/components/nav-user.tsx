"use client";

import { ChevronsUpDown, CircleUserIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/ui/use-toast";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    avatar: string;
  };
}) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      router.push("/log-in");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" variant="ghost">
          <CircleUserIcon className="size-5 stroke-muted-foreground" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
