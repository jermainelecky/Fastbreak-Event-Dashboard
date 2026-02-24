import { Metadata } from "next";
import { requireAuthOrRedirect } from "@/lib/utils/protected-route";
import { EventForm } from "@/components/events/event-form";
import { getEvent } from "@/lib/actions/events";
import { getVenues } from "@/lib/actions/venues";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/utils/auth";

export const metadata: Metadata = {
  title: "Edit Event | Fastbreak Event Dashboard",
  description: "Edit sports event details",
};

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  await requireAuthOrRedirect();
  const { id } = await params;

  // Fetch event and venues
  const [eventResult, venuesResult] = await Promise.all([
    getEvent(id),
    getVenues(),
  ]);

  if (!eventResult.success || !eventResult.data) {
    notFound();
  }

  const event = eventResult.data;
  const venues = venuesResult.success ? venuesResult.data : [];

  // Check if user owns this event
  const user = await getCurrentUser();
  if (event.created_by !== user?.id) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <EventForm event={event} venues={venues} />
    </div>
  );
}
