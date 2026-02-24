import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Tag, ArrowLeft, Pencil } from "lucide-react";
import { format } from "date-fns";

import { requireAuthOrRedirect } from "@/lib/utils/protected-route";
import { getEvent } from "@/lib/actions/events";
import { getCurrentUser } from "@/lib/utils/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Event Details | Fastbreak Event Dashboard",
  description: "View detailed information about a sports event",
};

interface EventDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  await requireAuthOrRedirect();
  const { id } = await params;

  const eventResult = await getEvent(id);

  if (!eventResult.success || !eventResult.data) {
    notFound();
  }

  const event = eventResult.data;
  const user = await getCurrentUser();
  const canEdit = user?.id === event.created_by;

  const eventDate = new Date(event.date_time);
  const venueNames = event.venues.map((v) => v.name).join(", ") || "No venues";

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Link>
        </Button>
        {canEdit && (
          <Button asChild size="sm">
            <Link href={`/events/${event.id}/edit`} className="flex items-center">
              <Pencil className="mr-2 h-4 w-4" />
              Edit Event
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{event.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-2 text-sm">
            <Tag className="h-4 w-4" />
            <span>{event.sport_type}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(eventDate, "PPP 'at' p")}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{venueNames}</span>
          </div>
          {event.description && (
            <div className="pt-2">
              <h2 className="text-sm font-semibold mb-1">Description</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {event.description}
              </p>
            </div>
          )}
          {event.venues.length > 0 && (
            <div className="pt-2">
              <h2 className="text-sm font-semibold mb-1">Venues</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {event.venues.map((venue) => (
                  <li key={venue.id}>
                    <div className="font-medium">{venue.name}</div>
                    {venue.address && <div>{venue.address}</div>}
                    {venue.capacity && (
                      <div>Capacity: {venue.capacity.toLocaleString()}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

