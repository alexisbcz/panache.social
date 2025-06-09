import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchForm() {
  return (
    <form className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search posts..."
        className="w-full pl-8 bg-muted/50"
      />
    </form>
  );
}
