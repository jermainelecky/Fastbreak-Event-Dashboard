/**
 * Venue server actions
 * All database operations happen server-side
 */

"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { withErrorHandling, withAuth } from "@/lib/utils/actions";
import type { Result } from "@/lib/utils/result";
import type { AppError } from "@/lib/types/errors";
import { ValidationError, DatabaseError } from "@/lib/types/errors";
import type { Venue, VenueInsert } from "@/lib/types";

/**
 * Get all venues
 * Used for dropdowns/selects when creating/editing events
 */
export async function getVenues(): Promise<Result<Venue[], AppError>> {
  return withErrorHandling(async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw new DatabaseError(error.message, error);
    }

    return data || [];
  });
}

/**
 * Create a new venue
 * Authenticated users can create venues (shared across all users)
 */
export async function createVenue(
  venueData: Omit<VenueInsert, "id" | "created_at" | "updated_at">
): Promise<Result<Venue, AppError>> {
  const supabase = await createClient();
  return withAuth(supabase, async () => {
    // Validation
    if (!venueData.name || venueData.name.trim().length === 0) {
      throw new ValidationError("Venue name is required", "name");
    }

    const { data, error } = await supabase
      .from("venues")
      .insert({
        name: venueData.name.trim(),
        address: venueData.address?.trim() || null,
        capacity: venueData.capacity || null,
      })
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message, error);
    }

    if (!data) {
      throw new DatabaseError("Failed to create venue");
    }

    return data;
  });
}
