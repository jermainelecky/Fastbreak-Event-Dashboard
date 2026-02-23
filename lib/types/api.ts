/**
 * API response types and domain models
 * These types represent the application layer (not raw database)
 */

import type { Event, Venue, EventVenue } from "./database";

// Event with related data (venues)
export interface EventWithVenues extends Event {
  venues: Venue[];
}

// Event with venue IDs only (for forms)
export interface EventFormData {
  name: string;
  sport_type: string;
  date_time: string; // ISO string or Date
  description?: string;
  venue_ids: string[];
}

// Sport types enum
export const SPORT_TYPES = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Football",
  "Baseball",
  "Hockey",
  "Volleyball",
  "Golf",
  "Swimming",
  "Track and Field",
] as const;

export type SportType = (typeof SPORT_TYPES)[number];

// Search and filter types
export interface EventFilters {
  search?: string;
  sport_type?: SportType;
}

// Pagination types (for future use)
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
