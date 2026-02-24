"use client";

import * as React from "react";
import { InputSearch } from "@/components/ui/input-search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORT_TYPES, type SportType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export interface EventFiltersProps {
  search?: string;
  sportType?: SportType;
  onSearchChange?: (search: string) => void;
  onSportTypeChange?: (sportType: SportType | "all" | undefined) => void;
  className?: string;
}

export function EventFilters({
  search,
  sportType,
  onSearchChange,
  onSportTypeChange,
  className,
}: EventFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="flex-1">
        <InputSearch
          placeholder="Search events by name..."
          value={search}
          onSearch={onSearchChange}
          onClear={() => onSearchChange?.("")}
        />
      </div>
      <div className="w-full sm:w-[200px]">
        <Select
          value={sportType || "all"}
          onValueChange={(value) =>
            onSportTypeChange?.(value === "all" ? undefined : (value as SportType))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {SPORT_TYPES.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
