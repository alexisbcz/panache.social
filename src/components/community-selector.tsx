"use client";

import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface CommunitySelectorProps {
  name: string;
  required?: boolean;
}

export function CommunitySelector({ name, required }: CommunitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [communities, setCommunities] = useState<
    (typeof communities.$inferSelect)[]
  >([]);

  // Load communities when the popover opens
  const loadCommunities = async () => {
    if (communities.length === 0) {
      const result = await fetch("/api/communities");
      const data = await result.json();
      setCommunities(data);
    }
  };

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen) loadCommunities();
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {value
                  ? communities.find((c) => c.id === value)?.title
                  : "Select a community"}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command className="max-h-[300px]">
            <CommandInput placeholder="Search communities..." />
            <CommandEmpty>No community found.</CommandEmpty>
            <CommandGroup className="overflow-y-auto">
              {communities.map((community) => (
                <CommandItem
                  key={community.id}
                  value={community.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{community.title}</span>
                    <span className="text-muted-foreground">
                      ({community.language})
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" name={name} value={value} required={required} />
    </>
  );
}
