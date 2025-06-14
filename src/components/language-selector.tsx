"use client";

import { languages } from "@/lib/languages";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface LanguageSelectorProps {
  name: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function LanguageSelector({
  name,
  required,
  value: controlledValue,
  onChange,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue ?? internalValue;

  const handleSelect = (currentValue: string) => {
    setInternalValue(currentValue);
    onChange?.(currentValue);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>
                {value
                  ? languages.find((lang) => lang.code === value)?.name
                  : "Select a language"}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command className="max-h-[300px]">
            <CommandInput placeholder="Search language..." />
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup className="overflow-y-auto">
              {languages.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.code}
                  onSelect={handleSelect}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{language.name}</span>
                    <span className="text-muted-foreground">
                      ({language.nativeName})
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
