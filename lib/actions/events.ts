/**
 * Event server actions
 * All database operations happen server-side
 */

"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { withErrorHandling, withAuth } from "@/lib/utils/actions";
import type { Result } from "@/lib/utils/result";
import type { AppError } from "@/lib/types/errors";
import {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  DatabaseError,
} from "@/lib/types/errors";
import type {
  EventWithVenues,
  EventFormData,
  EventFilters,
} from "@/lib/types";

/**
 * Get all events with their venues
 * Supports search and filter by sport type
 */
export async function getEvents(
  filters?: EventFilters
): Promise<Result<EventWithVenues[], AppError>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();

    // Build query with filters
    let query = supabase
      .from("events")
      .select(
        `
        *,
        event_venues (
          venue:venues (*)
        )
      `
      )
      .order("date_time", { ascending: true });

    // Apply search filter (search in event name)
    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    // Apply sport type filter
    if (filters?.sport_type) {
      query = query.eq("sport_type", filters.sport_type);
    }

    const { data, error } = await query;

    if (error) {
      throw new DatabaseError(error.message, error);
    }

    if (!data) {
      return [];
    }

    // Transform the data to flatten the venue structure
    const eventsWithVenues: EventWithVenues[] = data.map((event: any) => ({
      ...event,
      venues: event.event_venues?.map((ev: any) => ev.venue) || [],
    }));

    return eventsWithVenues;
  });
}

/**
 * Get a single event by ID with its venues
 */
export async function getEvent(
  eventId: string
): Promise<Result<EventWithVenues, AppError>> {
  return withErrorHandling(async () => {
    if (!eventId) {
      throw new ValidationError("Event ID is required");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        event_venues (
          venue:venues (*)
        )
      `
      )
      .eq("id", eventId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new NotFoundError("Event");
      }
      throw new DatabaseError(error.message, error);
    }

    if (!data) {
      throw new NotFoundError("Event");
    }

    // Transform the data to flatten the venue structure
    const eventWithVenues: EventWithVenues = {
      ...data,
      venues: data.event_venues?.map((ev: any) => ev.venue) || [],
    };

    return eventWithVenues;
  });
}

/**
 * Create a new event with venues
 */
export async function createEvent(
  eventData: EventFormData
): Promise<Result<EventWithVenues, AppError>> {
  const supabase = await createClient();
  return withAuth(supabase, async (userId) => {
    // Validation
    if (!eventData.name || eventData.name.trim().length === 0) {
      throw new ValidationError("Event name is required", "name");
    }

    if (!eventData.sport_type || eventData.sport_type.trim().length === 0) {
      throw new ValidationError("Sport type is required", "sport_type");
    }

    if (!eventData.date_time) {
      throw new ValidationError("Date and time is required", "date_time");
    }

    // Validate date is in the future (optional business rule)
    const eventDate = new Date(eventData.date_time);
    if (isNaN(eventDate.getTime())) {
      throw new ValidationError("Invalid date format", "date_time");
    }

    // Create the event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .insert({
        name: eventData.name.trim(),
        sport_type: eventData.sport_type,
        date_time: eventData.date_time,
        description: eventData.description?.trim() || null,
        created_by: userId,
      })
      .select()
      .single();

    if (eventError) {
      throw new DatabaseError(eventError.message, eventError);
    }

    if (!event) {
      throw new DatabaseError("Failed to create event");
    }

    // Associate venues if provided
    if (eventData.venue_ids && eventData.venue_ids.length > 0) {
      const eventVenues = eventData.venue_ids.map((venueId) => ({
        event_id: event.id,
        venue_id: venueId,
      }));

      const { error: venueError } = await supabase
        .from("event_venues")
        .insert(eventVenues);

      if (venueError) {
        // Rollback: delete the event if venue association fails
        await supabase.from("events").delete().eq("id", event.id);
        throw new DatabaseError(
          `Failed to associate venues: ${venueError.message}`,
          venueError
        );
      }
    }

    // Fetch the complete event with venues
    const result = await getEvent(event.id);
    if (!result.success) {
      // Event was created but we can't fetch it - return the basic event
      return {
        ...event,
        venues: [],
      };
    }

    return result.data;
  });
}

/**
 * Update an existing event
 */
export async function updateEvent(
  eventId: string,
  eventData: EventFormData
): Promise<Result<EventWithVenues, AppError>> {
  const supabase = await createClient();
  return withAuth(supabase, async (userId) => {
    if (!eventId) {
      throw new ValidationError("Event ID is required");
    }

    // Validation
    if (!eventData.name || eventData.name.trim().length === 0) {
      throw new ValidationError("Event name is required", "name");
    }

    if (!eventData.sport_type || eventData.sport_type.trim().length === 0) {
      throw new ValidationError("Sport type is required", "sport_type");
    }

    if (!eventData.date_time) {
      throw new ValidationError("Date and time is required", "date_time");
    }

    // Check if event exists and user owns it
    const { data: existingEvent, error: fetchError } = await supabase
      .from("events")
      .select("created_by")
      .eq("id", eventId)
      .single();

    if (fetchError || !existingEvent) {
      throw new NotFoundError("Event");
    }

    if (existingEvent.created_by !== userId) {
      throw new AuthorizationError("You can only edit your own events");
    }

    // Update the event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .update({
        name: eventData.name.trim(),
        sport_type: eventData.sport_type,
        date_time: eventData.date_time,
        description: eventData.description?.trim() || null,
      })
      .eq("id", eventId)
      .select()
      .single();

    if (eventError) {
      throw new DatabaseError(eventError.message, eventError);
    }

    if (!event) {
      throw new DatabaseError("Failed to update event");
    }

    // Update venue associations
    // Delete existing associations
    const { error: deleteError } = await supabase
      .from("event_venues")
      .delete()
      .eq("event_id", eventId);

    if (deleteError) {
      throw new DatabaseError(deleteError.message, deleteError);
    }

    // Create new associations if provided
    if (eventData.venue_ids && eventData.venue_ids.length > 0) {
      const eventVenues = eventData.venue_ids.map((venueId) => ({
        event_id: eventId,
        venue_id: venueId,
      }));

      const { error: venueError } = await supabase
        .from("event_venues")
        .insert(eventVenues);

      if (venueError) {
        throw new DatabaseError(
          `Failed to associate venues: ${venueError.message}`,
          venueError
        );
      }
    }

    // Fetch the complete updated event with venues
    const result = await getEvent(eventId);
    if (!result.success) {
      throw result.error;
    }

    return result.data;
  });
}

/**
 * Delete an event
 */
export async function deleteEvent(
  eventId: string
): Promise<Result<void, AppError>> {
  const supabase = await createClient();
  return withAuth(supabase, async (userId) => {
    if (!eventId) {
      throw new ValidationError("Event ID is required");
    }

    // Check if event exists and user owns it
    const { data: existingEvent, error: fetchError } = await supabase
      .from("events")
      .select("created_by")
      .eq("id", eventId)
      .single();

    if (fetchError || !existingEvent) {
      throw new NotFoundError("Event");
    }

    if (existingEvent.created_by !== userId) {
      throw new AuthorizationError("You can only delete your own events");
    }

    // Delete event (cascade will handle event_venues)
    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (deleteError) {
      throw new DatabaseError(deleteError.message, deleteError);
    }
  });
}
