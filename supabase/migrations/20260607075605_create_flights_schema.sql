/*
# Create Flights Booking Schema

1. New Tables
- `airports`
  - `code` (text, primary key) — IATA airport code (e.g. DXB, JFK)
  - `city` (text) — City name
  - `name` (text) — Full airport name
  - `country` (text) — Country name
  - `created_at` (timestamptz)

- `flights`
  - `id` (uuid, primary key)
  - `airline` (text) — Airline name
  - `flight_no` (text) — Flight number (e.g. BF-101)
  - `from_code` (text, FK → airports.code) — Origin airport
  - `to_code` (text, FK → airports.code) — Destination airport
  - `departure` (timestamptz) — Departure time
  - `arrival` (timestamptz) — Arrival time
  - `duration` (text) — Flight duration label (e.g. 14h 00m)
  - `price` (numeric) — Current price per seat
  - `original_price` (numeric) — Original price before discount
  - `seats_left` (integer) — Available seats
  - `class` (text) — Cabin class: economy, business, or first
  - `stops` (integer) — Number of stops (0 = non-stop)
  - `aircraft` (text) — Aircraft type (e.g. A380)
  - `created_at` (timestamptz)

- `bookings`
  - `id` (uuid, primary key)
  - `user_id` (uuid, NOT NULL, DEFAULT auth.uid(), FK → auth.users) — Owner
  - `flight_id` (uuid, NOT NULL, FK → flights.id) — Booked flight
  - `passengers` (integer) — Number of passengers
  - `total_price` (numeric) — Total amount paid
  - `passenger_name` (text) — Lead passenger name
  - `passenger_email` (text) — Contact email
  - `passenger_phone` (text) — Contact phone
  - `status` (text, DEFAULT 'confirmed') — Booking status: confirmed or cancelled
  - `booking_ref` (text, UNIQUE) — Human-readable booking reference
  - `created_at` (timestamptz)

2. Indexes
- Index on `flights.from_code` and `flights.to_code` for route searches
- Index on `flights.class` for class filtering
- Index on `bookings.user_id` for user booking lookups
- Index on `bookings.status` for status filtering

3. Security
- RLS enabled on all tables.
- `airports` and `flights`: public read (anon + authenticated), no writes from client.
- `bookings`: owner-scoped CRUD — authenticated users can only access their own bookings.
  - `user_id` has DEFAULT auth.uid() so inserts omitting user_id still satisfy RLS.
*/

-- Airports table
CREATE TABLE IF NOT EXISTS airports (
  code text PRIMARY KEY,
  city text NOT NULL,
  name text NOT NULL,
  country text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE airports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_airports" ON airports;
CREATE POLICY "public_read_airports" ON airports FOR SELECT
  TO anon, authenticated USING (true);

-- Flights table
CREATE TABLE IF NOT EXISTS flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  airline text NOT NULL,
  flight_no text NOT NULL,
  from_code text NOT NULL REFERENCES airports(code) ON DELETE RESTRICT,
  to_code text NOT NULL REFERENCES airports(code) ON DELETE RESTRICT,
  departure timestamptz NOT NULL,
  arrival timestamptz NOT NULL,
  duration text NOT NULL,
  price numeric NOT NULL,
  original_price numeric NOT NULL,
  seats_left integer NOT NULL DEFAULT 0,
  class text NOT NULL CHECK (class IN ('economy', 'business', 'first')),
  stops integer NOT NULL DEFAULT 0,
  aircraft text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_flights_from_code ON flights(from_code);
CREATE INDEX IF NOT EXISTS idx_flights_to_code ON flights(to_code);
CREATE INDEX IF NOT EXISTS idx_flights_class ON flights(class);

ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_flights" ON flights;
CREATE POLICY "public_read_flights" ON flights FOR SELECT
  TO anon, authenticated USING (true);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  flight_id uuid NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
  passengers integer NOT NULL,
  total_price numeric NOT NULL,
  passenger_name text NOT NULL,
  passenger_email text NOT NULL,
  passenger_phone text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  booking_ref text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON bookings;
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookings" ON bookings;
CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookings" ON bookings;
CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON bookings;
CREATE POLICY "delete_own_bookings" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
