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

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        viewMode === "list" && "flex flex-row",
        isDeleting && "opacity-50"
      )}
    >
      <CardHeader className={cn(viewMode === "list" && "flex-1")}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold line-clamp-2">{event.name}</h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>{event.sport_type}</span>
            </div>
          </div>
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
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className={cn(viewMode === "list" && "flex-1")}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(eventDate, "PPP 'at' p")}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="line-clamp-2">{venueNames}</span>
          </div>
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className={cn(viewMode === "list" && "flex-col items-start")}>
        <Link href={`/events/${event.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
