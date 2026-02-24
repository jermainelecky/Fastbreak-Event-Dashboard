"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

export interface InputSearchProps extends Omit<InputProps, "onChange"> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  debounceMs?: number;
}

const InputSearch = React.forwardRef<HTMLInputElement, InputSearchProps>(
  ({ className, onSearch, onClear, debounceMs = 300, value, ...props }, ref) => {
    const [searchValue, setSearchValue] = React.useState(value || "");
    const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
      if (value !== undefined) {
        setSearchValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchValue(newValue);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for debounced search
      debounceTimerRef.current = setTimeout(() => {
        onSearch?.(newValue);
      }, debounceMs);
    };

    const handleClear = () => {
      setSearchValue("");
      onClear?.();
      onSearch?.("");
    };

    React.useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    return (
      <div className={cn("relative", className)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          value={searchValue}
          onChange={handleChange}
          className="pl-9 pr-9"
          {...props}
        />
        {searchValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    );
  }
);
InputSearch.displayName = "InputSearch";

export { InputSearch };
