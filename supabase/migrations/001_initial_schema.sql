-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create venues table
-- Venues are shared across all users (anyone can use any venue)
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create event_venues junction table (many-to-many relationship)
CREATE TABLE event_venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(event_id, venue_id) -- Prevent duplicate venue assignments to the same event
);

-- Create indexes for better query performance
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_sport_type ON events(sport_type);
CREATE INDEX idx_events_date_time ON events(date_time);
CREATE INDEX idx_event_venues_event_id ON event_venues(event_id);
CREATE INDEX idx_event_venues_venue_id ON event_venues(venue_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at on row updates
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_venues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for venues (shared, everyone can read, authenticated users can insert/update)
CREATE POLICY "Venues are viewable by everyone"
  ON venues FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create venues"
  ON venues FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update venues"
  ON venues FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS Policies for events (users can only see/edit their own events)
CREATE POLICY "Users can view all events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = created_by);
-- RLS Policies for event_venues (users can manage venues for their own events)
CREATE POLICY "Users can view event_venues for all events"
  ON event_venues FOR SELECT
  USING (true);

CREATE POLICY "Users can create event_venues for their own events"
  ON event_venues FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_venues.event_id
      AND events.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete event_venues for their own events"
  ON event_venues FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_venues.event_id
      AND events.created_by = auth.uid()
    )
  );

