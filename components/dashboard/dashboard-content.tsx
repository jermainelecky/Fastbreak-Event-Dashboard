"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventFilters } from "@/components/events/event-filters";
import { EventList } from "@/components/events/event-list";
import { Button } from "@/components/ui/button";
import { Plus, Grid3x3, List } from "lucide-react";
import type { EventWithVenues, SportType } from "@/lib/types";
import Link from "next/link";

interface DashboardContentProps {
  initialEvents: EventWithVenues[];
  initialFilters: {
    search?: string;
    sport_type?: SportType;
  };
  currentUserId: string;
}

type ViewMode = "grid" | "list";

export function DashboardContent({
  initialEvents,
  initialFilters,
  currentUserId,
}: DashboardContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = (search: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`);
    });
  };

  const handleSportTypeChange = (sportType: SportType | "all" | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sportType && sportType !== "all") {
      params.set("sport_type", sportType);
    } else {
      params.delete("sport_type");
    }
    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage and view all sports events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode !== "grid" ? "rounded-r-none bg-white" : "rounded-r-none"}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode !== "list" ? "rounded-l-none bg-white" : "rounded-l-none"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/events/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <EventFilters
        search={initialFilters.search}
        sportType={initialFilters.sport_type}
        onSearchChange={handleSearchChange}
        onSportTypeChange={handleSportTypeChange}
      />

      {/* Events List */}
      <EventList events={initialEvents} viewMode={viewMode} isLoading={isPending} currentUserId={currentUserId} />
    </div>
  );
}
