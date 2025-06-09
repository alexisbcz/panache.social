"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link as LinkIcon, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SharePostDropdownProps {
  postUrl: string;
}

export function SharePostDropdown({ postUrl }: SharePostDropdownProps) {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast({
        title: "Link copied!",
        description: "Post link has been copied to your clipboard.",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Couldn't copy the link to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={copyToClipboard}
              className="gap-2 text-xs"
            >
              <LinkIcon className="h-4 w-4" />
              <span>Copy link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share post</p>
      </TooltipContent>
    </Tooltip>
  );
}
