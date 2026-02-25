import { Metadata } from "next";
import { requireAuthOrRedirect } from "@/lib/utils/protected-route";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getEvents } from "@/lib/actions/events";
import type { EventFilters } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard | Fastbreak Event Dashboard",
  description: "View and manage your sports events",
};

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    sport_type?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  // Require authentication
  const user = await requireAuthOrRedirect();

  // Get search params
  const params = await searchParams;
  const filters: EventFilters = {
    search: params.search,
    sport_type: params.sport_type as EventFilters["sport_type"],
  };

  // Fetch events with filters
  const eventsResult = await getEvents(filters);

  return (
    <div className="container mx-auto py-8 px-4">
      <DashboardContent
        initialEvents={eventsResult.success ? eventsResult.data : []}
        initialFilters={filters}
        currentUserId={user.id}
      />
    </div>
  );
}
