"use client";

import { EventCard } from "./event-card";
import { EventListSkeleton } from "./event-list-skeleton";
import { cn } from "@/lib/utils/cn";
import type { EventWithVenues } from "@/lib/types";

interface EventListProps {
  events: EventWithVenues[];
  viewMode: "grid" | "list";
  isLoading?: boolean;
  currentUserId: string;
}

export function EventList({ events, viewMode, isLoading, currentUserId }: EventListProps) {
  if (isLoading) {
    return <EventListSkeleton count={6} />;
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-gray-500">
          No events found
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Try adjusting your search or filters, or create a new event.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col gap-4"
      )}
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} viewMode={viewMode} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
