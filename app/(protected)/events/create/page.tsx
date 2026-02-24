import { Metadata } from "next";
import { requireAuthOrRedirect } from "@/lib/utils/protected-route";
import { EventForm } from "@/components/events/event-form";
import { getVenues } from "@/lib/actions/venues";

export const metadata: Metadata = {
  title: "Create Event | Fastbreak Event Dashboard",
  description: "Create a new sports event",
};

export default async function CreateEventPage() {
  await requireAuthOrRedirect();

  // Fetch venues for the form
  const venuesResult = await getVenues();
  const venues = venuesResult.success ? venuesResult.data : [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <EventForm venues={venues} />
    </div>
  );
}
