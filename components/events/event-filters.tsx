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
import { SPORT_TYPES, type EventSortBy, type EventSortOrder, type SportType } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const SORT_BY_OPTIONS: { value: EventSortBy; label: string }[] = [
  { value: "date_time", label: "Date" },
  { value: "name", label: "Name" },
  { value: "venue", label: "Venue" },
];

const SORT_ORDER_OPTIONS: { value: EventSortOrder; label: string }[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export interface EventFiltersProps {
  search?: string;
  sportType?: SportType;
  sortBy?: EventSortBy;
  sortOrder?: EventSortOrder;
  onSearchChange?: (search: string) => void;
  onSportTypeChange?: (sportType: SportType | "all" | undefined) => void;
  onSortChange?: (sortBy: EventSortBy, sortOrder: EventSortOrder) => void;
  className?: string;
}

export function EventFilters({
  search,
  sportType,
  sortBy = "date_time",
  sortOrder = "asc",
  onSearchChange,
  onSportTypeChange,
  onSortChange,
  className,
}: EventFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap",
        className
      )}
    >
      <div className="flex-1 min-w-0">
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
      <div className="w-full sm:w-[180px]">
        <Select
          value={sortBy}
          onValueChange={(value) => onSortChange?.(value as EventSortBy, sortOrder)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_BY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-[180px]">
        <Select
          value={sortOrder}
          onValueChange={(value) => onSortChange?.(sortBy, value as EventSortOrder)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            {SORT_ORDER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
