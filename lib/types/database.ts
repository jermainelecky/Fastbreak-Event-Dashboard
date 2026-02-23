/**
 * Database types matching the Supabase schema
 * These types represent the raw database structure
 */

export type Database = {
  public: {
    Tables: {
      events: {
        Row: Event;
        Insert: EventInsert;
        Update: EventUpdate;
      };
      venues: {
        Row: Venue;
        Insert: VenueInsert;
        Update: VenueUpdate;
      };
      event_venues: {
        Row: EventVenue;
        Insert: EventVenueInsert;
        Update: EventVenueUpdate;
      };
    };
  };
};

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

export interface EventInsert {
  id?: string;
  name: string;
  sport_type: string;
  date_time: string;
  description?: string | null;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventUpdate {
  id?: string;
  name?: string;
  sport_type?: string;
  date_time?: string;
  description?: string | null;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
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

export interface VenueUpdate {
  id?: string;
  name?: string;
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

export interface EventVenueInsert {
  id?: string;
  event_id: string;
  venue_id: string;
  created_at?: string;
}

export interface EventVenueUpdate {
  id?: string;
  event_id?: string;
  venue_id?: string;
  created_at?: string;
}
