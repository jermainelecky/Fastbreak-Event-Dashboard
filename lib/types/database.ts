/**
 * Database types matching the Supabase schema
 * These types represent the raw database structure
 */

// Event types
export interface Event {
  id: string;
  name: string;
  sport_type: string;
  date_time: string; // ISO timestamp
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Venue types
export interface Venue {
  id: string;
  name: string;
  address: string | null;
  capacity: number | null;
  created_at: string;
  updated_at: string;
}

export interface VenueInsert {
  id?: string;
  name: string;
  address?: string | null;
  capacity?: number | null;
  created_at?: string;
  updated_at?: string;
}

// Event-Venue junction types
export interface EventVenue {
  id: string;
  event_id: string;
  venue_id: string;
  created_at: string;
}
