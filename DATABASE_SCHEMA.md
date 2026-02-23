# Database Schema

## Overview

The database consists of three main tables to support sports event management with multiple venues per event.

## Tables

### `venues`
Stores venue information. Venues are **shared across all users** - anyone can use any venue when creating events.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Venue name (required) |
| `address` | TEXT | Venue address (optional) |
| `capacity` | INTEGER | Maximum capacity (optional) |
| `created_at` | TIMESTAMP | Auto-set on creation |
| `updated_at` | TIMESTAMP | Auto-updated on modification |

### `events`
Stores sports event information. Each event belongs to the user who created it.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Event name (required) |
| `sport_type` | TEXT | Type of sport (e.g., "Soccer", "Basketball", "Tennis") (required) |
| `date_time` | TIMESTAMP | Event date and time (required) |
| `description` | TEXT | Event description (optional) |
| `created_by` | UUID | Foreign key to `auth.users(id)` - the user who created the event |
| `created_at` | TIMESTAMP | Auto-set on creation |
| `updated_at` | TIMESTAMP | Auto-updated on modification |

### `event_venues`
Junction table for the many-to-many relationship between events and venues. An event can have multiple venues, and a venue can be used by multiple events.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `event_id` | UUID | Foreign key to `events(id)` |
| `venue_id` | UUID | Foreign key to `venues(id)` |
| `created_at` | TIMESTAMP | Auto-set on creation |

**Constraint**: Unique constraint on `(event_id, venue_id)` prevents duplicate venue assignments.

## Relationships

- **Events → Users**: Many-to-one (many events belong to one user)
- **Events ↔ Venues**: Many-to-many (via `event_venues` junction table)

## Row Level Security (RLS) Policies

### Venues
- **View**: Everyone can view all venues
- **Create/Update**: Authenticated users only

### Events
- **View**: Everyone can view all events
- **Create**: Users can only create events for themselves (enforced via `created_by`)
- **Update/Delete**: Users can only modify their own events

### Event Venues
- **View**: Everyone can view all event-venue relationships
- **Create/Delete**: Users can only manage venues for events they own

## Indexes

The following indexes are created for query performance:
- `idx_events_created_by` - Fast lookup of events by creator
- `idx_events_sport_type` - Fast filtering by sport type
- `idx_events_date_time` - Fast sorting/filtering by date
- `idx_event_venues_event_id` - Fast lookup of venues for an event
- `idx_event_venues_venue_id` - Fast lookup of events for a venue

## Setup Instructions

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Run the migration file `supabase/migrations/001_initial_schema.sql`
4. (Optional) Run `supabase/migrations/002_seed_data.sql` to add sample venues

## Design Decisions

### Venues are Shared
Venues are shared across all users rather than user-specific. This allows:
- Reusability of venue data
- Consistency in venue information
- Simpler data model

### Users Can Only Edit Their Own Events
RLS policies ensure users can only create, update, and delete events they own. This provides data isolation while allowing all users to view all events (as per requirements).

### Many-to-Many Relationship
Events can have multiple venues, supporting complex scenarios like tournaments or multi-location events.
