"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Calendar, MapPin, Tag, MoreVertical } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import type { EventWithVenues } from "@/lib/types";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/lib/actions/events";
import { handleServerActionResult } from "@/lib/utils/toast";
import { useState } from "react";

interface EventCardProps {
  event: EventWithVenues;
  viewMode: "grid" | "list";
}

export function EventCard({ event, viewMode }: EventCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteEvent(event.id);
    handleServerActionResult(result, {
      successTitle: "Event deleted",
      successDescription: "The event has been deleted successfully",
      onSuccess: () => {
        router.refresh();
      },
    });
    setIsDeleting(false);
  };

  const eventDate = new Date(event.date_time);
  const venueNames = event.venues.map((v) => v.name).join(", ") || "No venues";

  const isList = viewMode === "list";

  return (
    <Card
      className={cn(
        "rounded-lg border transition-all hover:shadow-md relative p-6",
        isList && "flex flex-row",
        isDeleting && "opacity-50"
      )}
    >
      {/* Dropdown menu - always at top right corner */}
      <div className="absolute top-0 right-0 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/events/${event.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isList ? (
        <>
          {/* List view: 3 columns on desktop (header, content, footer), 2 columns on mobile (header+content, footer) */}
          <div className="flex flex-1 flex-row gap-4">
            {/* Left area: header + content */}
            <div className="flex flex-1 flex-col sm:flex-row gap-2">
              <CardHeader className="sm:flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-10">
                    <h3 className="text-xl font-semibold line-clamp-2">
                      {event.name}
                    </h3>
                    {/* In list view, hide sport type on mobile, show on desktop */}
                    <div className="hidden sm:flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Tag className="h-4 w-4" />
                      <span>{event.sport_type}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className=" sm:flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(eventDate, "PPP 'at' p")}</span>
                  </div>
                  <div className="hidden sm:flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="line-clamp-2">{venueNames}</span>
                  </div>
                  {event.description && (
                    <p className="hidden sm:block text-sm text-gray-500 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </div>

            {/* Right area: footer / button */}
            <CardFooter className="flex flex-col justify-center">
              <Link href={`/events/${event.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
            
          </div>
        </>
      ) : (
        <>
          {/* Grid view: original stacked layout */}
          <CardHeader>
            <div className="flex items-start justify-between pb-4">
              <div className="flex-1 pr-10">
                <h3 className="text-xl font-semibold line-clamp-2">
                  {event.name}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <Tag className="h-4 w-4" />
                  <span>{event.sport_type}</span>
                </div>
              </div>
            </div>
          </CardHeader>
            <CardContent>
              <div className="space-y-3 pb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{format(eventDate, "PPP 'at' p")}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <span className="line-clamp-2">{venueNames}</span>
                </div>
                {event.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            </CardContent>
          <CardFooter>
            <Link href={`/events/${event.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
