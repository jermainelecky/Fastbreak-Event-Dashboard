-- Optional: Seed some initial venues for testing
-- You can remove this file if you don't want seed data

-- Insert venues (only if they don't already exist)
INSERT INTO venues (name, address, capacity)
SELECT * FROM (VALUES
  ('Madison Square Garden', '4 Pennsylvania Plaza, New York, NY 10001', 20000),
  ('Staples Center', '1111 S Figueroa St, Los Angeles, CA 90015', 19000),
  ('Wembley Stadium', 'London HA9 0WS, United Kingdom', 90000),
  ('TD Garden', '100 Legends Way, Boston, MA 02114', 19580),
  ('United Center', '1901 W Madison St, Chicago, IL 60612', 23500),
  ('Fenway Park', '4 Yawkey Way, Boston, MA 02215', 37755),
  ('Yankee Stadium', '1 E 161st St, Bronx, NY 10451', 54251),
  ('Dodger Stadium', '1000 Vin Scully Ave, Los Angeles, CA 90012', 56000),
  ('Oracle Park', '24 Willie Mays Plaza, San Francisco, CA 94107', 41503),
  ('Crypto.com Arena', '1111 S Figueroa St, Los Angeles, CA 90015', 19060),
  ('Barclays Center', '620 Atlantic Ave, Brooklyn, NY 11217', 17732),
  ('Chase Center', '1 Warriors Way, San Francisco, CA 94158', 18064),
  ('Fiserv Forum', '1111 Vel R. Phillips Ave, Milwaukee, WI 53203', 17500),
  ('Capital One Arena', '601 F St NW, Washington, DC 20004', 20356),
  ('American Airlines Center', '2500 Victory Ave, Dallas, TX 75219', 19200),
  ('Ball Arena', '1000 Chopper Cir, Denver, CO 80204', 19520),
  ('Rogers Place', '10220 104 Ave NW, Edmonton, AB T5J 4Y8, Canada', 18347),
  ('Scotiabank Arena', '40 Bay St, Toronto, ON M5J 2X2, Canada', 19800),
  ('Allianz Arena', 'Werner-Heisenberg-Allee 25, 80939 München, Germany', 75024),
  ('Camp Nou', 'C. d''Aristides Maillol, 12, 08028 Barcelona, Spain', 99354)
) AS v(name, address, capacity)
WHERE NOT EXISTS (
  SELECT 1 FROM venues WHERE venues.name = v.name
);

-- Function to seed events for the first authenticated user
-- Call this function after creating at least one user account
CREATE OR REPLACE FUNCTION seed_events_for_first_user()
RETURNS void AS $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Get the first authenticated user
  SELECT id INTO first_user_id
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1;

  -- Only proceed if a user exists
  IF first_user_id IS NOT NULL THEN
    -- Insert sample events (only if they don't already exist for this user)
    INSERT INTO events (name, sport_type, date_time, description, created_by)
    SELECT * FROM (VALUES
      ('NBA Finals Game 1', 'Basketball', NOW() + INTERVAL '30 days', 'Championship series opening game featuring the top two teams.', first_user_id),
      ('MLB World Series', 'Baseball', NOW() + INTERVAL '45 days', 'The ultimate baseball championship series.', first_user_id),
      ('Premier League Match', 'Soccer', NOW() + INTERVAL '15 days', 'Top-tier English football match between rival teams.', first_user_id),
      ('Tennis Grand Slam', 'Tennis', NOW() + INTERVAL '60 days', 'Major tennis tournament featuring world-class players.', first_user_id),
      ('NFL Championship', 'Football', NOW() + INTERVAL '90 days', 'The biggest game of the football season.', first_user_id),
      ('Stanley Cup Finals', 'Hockey', NOW() + INTERVAL '75 days', 'NHL championship series for the Stanley Cup.', first_user_id),
      ('Olympic Qualifiers', 'Track and Field', NOW() + INTERVAL '120 days', 'Qualifying events for the upcoming Olympic Games.', first_user_id),
      ('Golf Masters Tournament', 'Golf', NOW() + INTERVAL '100 days', 'One of the most prestigious golf tournaments in the world.', first_user_id),
      ('Volleyball Championship', 'Volleyball', NOW() + INTERVAL '50 days', 'International volleyball championship match.', first_user_id),
      ('Swimming Championships', 'Swimming', NOW() + INTERVAL '80 days', 'World-class swimming competition featuring Olympic athletes.', first_user_id)
    ) AS v(name, sport_type, date_time, description, created_by)
    WHERE NOT EXISTS (
      SELECT 1 FROM events 
      WHERE events.name = v.name 
        AND events.created_by = first_user_id
    );

    -- Associate venues with events (using the first few venues)
    -- Match events to venues and create associations
    INSERT INTO event_venues (event_id, venue_id)
    SELECT DISTINCT e.id, v.id
    FROM events e
    CROSS JOIN venues v
    WHERE e.created_by = first_user_id
      AND e.name IN ('NBA Finals Game 1', 'MLB World Series', 'Premier League Match', 'Tennis Grand Slam', 'NFL Championship')
      AND v.name IN ('Madison Square Garden', 'Staples Center', 'Wembley Stadium', 'TD Garden', 'United Center')
      AND NOT EXISTS (
        SELECT 1 FROM event_venues ev
        WHERE ev.event_id = e.id AND ev.venue_id = v.id
      )
    LIMIT 10;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Automatically seed events if a user exists
-- If no users exist yet, this will do nothing (no error)
-- You can also run this manually later: SELECT seed_events_for_first_user();
SELECT seed_events_for_first_user();
