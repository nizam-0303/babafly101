import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FlightSearch, Flight, BookedFlight, Airport } from '../../utils/types';
import { supabase } from '../../utils/supabase';
import { AIRPORTS } from '../../utils/mockData';

interface DbFlightRow {
  id: string;
  airline: string;
  flight_no: string;
  from_code: string;
  to_code: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  original_price: number;
  seats_left: number;
  class: 'economy' | 'business' | 'first';
  stops: number;
  aircraft: string;
  from_airport: { code: string; city: string; name: string; country: string };
  to_airport: { code: string; city: string; name: string; country: string };
}

interface DbBookingRow {
  id: string;
  flight_id: string;
  passengers: number;
  total_price: number;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  status: 'confirmed' | 'cancelled';
  booking_ref: string;
  created_at: string;
  flight: DbFlightRow;
}

const mapFlight = (row: DbFlightRow): Flight => ({
  id: row.id,
  airline: row.airline,
  flightNo: row.flight_no,
  from: row.from_airport,
  to: row.to_airport,
  departure: row.departure,
  arrival: row.arrival,
  duration: row.duration,
  price: row.price,
  originalPrice: row.original_price,
  seatsLeft: row.seats_left,
  class: row.class,
  stops: row.stops,
  aircraft: row.aircraft,
});

const mapBooking = (row: DbBookingRow): BookedFlight => ({
  id: row.id,
  flight: mapFlight(row.flight),
  passengers: row.passengers,
  totalPrice: row.total_price,
  bookingDate: row.created_at,
  status: row.status,
  passengerName: row.passenger_name,
  passengerEmail: row.passenger_email,
  passengerPhone: row.passenger_phone,
  bookingRef: row.booking_ref,
});

const SAMPLE_AIRLINES = [
  { name: 'Emirates', code: 'EK' },
  { name: 'Qatar Airways', code: 'QR' },
  { name: 'British Airways', code: 'BA' },
  { name: 'Delta Air Lines', code: 'DL' },
  { name: 'United Airlines', code: 'UA' },
  { name: 'Lufthansa', code: 'LH' },
  { name: 'Singapore Airlines', code: 'SQ' },
  { name: 'Air France', code: 'AF' },
  { name: 'Turkish Airlines', code: 'TK' },
  { name: 'Cathay Pacific', code: 'CX' },
];

const SAMPLE_AIRCRAFT = ['A380', 'B787-9', 'A350-900', 'B777-300ER', 'A321neo', 'B737 MAX 9', 'A330-300', 'B767-300ER', 'A320neo', 'B777X'];

const CABIN_CLASSES: Array<'economy' | 'business' | 'first'> = ['economy', 'economy', 'economy', 'economy', 'business', 'business', 'business', 'first', 'first', 'first'];

function generateSampleFlights(search: FlightSearch): Flight[] {
  const fromAirport = AIRPORTS.find(a => a.code === search.from) || { code: search.from, city: search.from, name: search.from + ' Airport', country: '' };
  const toAirport = AIRPORTS.find(a => a.code === search.to) || { code: search.to, city: search.to, name: search.to + ' Airport', country: '' };

  const baseDate = search.departDate ? search.departDate : new Date().toISOString().split('T')[0];

  const departureTimes = ['05:30', '07:00', '08:45', '10:15', '12:30', '14:00', '15:45', '17:20', '19:10', '21:45'];
  const durationsHours = [2, 3, 4, 5, 7, 8, 9, 11, 13, 14];

  const flights: Flight[] = SAMPLE_AIRLINES.map((airline, i) => {
    const cabinClass = CABIN_CLASSES[i];
    const durationHrs = durationsHours[i];
    const durationMins = [0, 15, 30, 45, 10, 20, 5, 50, 35, 55][i];
    const departureStr = `${baseDate}T${departureTimes[i]}`;
    const departureDate = new Date(departureStr);
    const arrivalDate = new Date(departureDate.getTime() + (durationHrs * 60 + durationMins) * 60 * 1000);
    const arrivalStr = arrivalDate.toISOString().slice(0, 16);
    const durationLabel = `${durationHrs}h ${durationMins > 0 ? durationMins + 'm' : '00m'}`;
    const stops = i < 6 ? 0 : i < 8 ? 1 : 0;

    const basePrices: Record<string, number[]> = {
      economy: [189, 229, 249, 279, 199, 219, 239, 269, 209, 259],
      business: [649, 749, 829, 899, 699, 779, 849, 949, 719, 799],
      first: [1299, 1499, 1649, 1799, 1349, 1549, 1699, 1899, 1399, 1599],
    };
    const price = basePrices[cabinClass][i];
    const originalPrice = Math.round(price * (1 + [0.2, 0.25, 0.18, 0.3, 0.22, 0.15, 0.28, 0.2, 0.24, 0.19][i]));
    const seatsLeft = [8, 45, 3, 62, 12, 30, 7, 55, 19, 4][i];

    return {
      id: `mock-${search.from}-${search.to}-${i}`,
      airline: airline.name,
      flightNo: `${airline.code}-${String(100 + i * 37 + (search.from.charCodeAt(0) % 100)).padStart(3, '0')}`,
      from: fromAirport,
      to: toAirport,
      departure: departureStr,
      arrival: arrivalStr,
      duration: durationLabel,
      price,
      originalPrice,
      seatsLeft,
      class: cabinClass,
      stops,
      aircraft: SAMPLE_AIRCRAFT[i],
    };
  });

  return flights;
}

export const fetchAirports = createAsyncThunk<Airport[]>('flight/fetchAirports', async () => {
  try {
    const { data, error } = await supabase.from('airports').select('*').order('city');
    if (error || !data || data.length === 0) return AIRPORTS;
    return (data as Airport[]).map(a => ({ code: a.code, city: a.city, name: a.name, country: a.country }));
  } catch {
    return AIRPORTS;
  }
});

export const searchFlights = createAsyncThunk<Flight[], FlightSearch>('flight/search', async (search) => {
  try {
    const { data, error } = await supabase
      .from('flights')
      .select(`*, from_airport:airports!flights_from_code_fkey(code, city, name, country), to_airport:airports!flights_to_code_fkey(code, city, name, country)`)
      .eq('from_code', search.from)
      .eq('to_code', search.to);
    if (!error && data && data.length > 0) {
      return (data as unknown as DbFlightRow[]).map(mapFlight);
    }
  } catch {
  }
  return generateSampleFlights(search);
});

export const fetchBookings = createAsyncThunk<BookedFlight[]>('flight/fetchBookings', async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`*, flight:flights(*, from_airport:airports!flights_from_code_fkey(code, city, name, country), to_airport:airports!flights_to_code_fkey(code, city, name, country))`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as DbBookingRow[]).map(mapBooking);
});

export const createBooking = createAsyncThunk<BookedFlight, {
  flight: Flight; passengers: number; passengerName: string; passengerEmail: string; passengerPhone: string;
}>('flight/createBooking', async ({ flight, passengers, passengerName, passengerEmail, passengerPhone }) => {
  const bookingRef = 'BK-' + Date.now().toString().slice(-6);
  const totalPrice = flight.price * passengers;
  const { data, error } = await supabase
    .from('bookings')
    .insert({ flight_id: flight.id, passengers, total_price: totalPrice, passenger_name: passengerName, passenger_email: passengerEmail, passenger_phone: passengerPhone, booking_ref: bookingRef })
    .select(`*, flight:flights(*, from_airport:airports!flights_from_code_fkey(code, city, name, country), to_airport:airports!flights_to_code_fkey(code, city, name, country))`)
    .maybeSingle();
  if (error) throw error;
  return mapBooking(data as unknown as DbBookingRow);
});

export const cancelBooking = createAsyncThunk<string, string>('flight/cancelBooking', async (bookingId) => {
  const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
  if (error) throw error;
  return bookingId;
});

interface FlightState {
  search: FlightSearch;
  airports: Airport[];
  results: Flight[];
  bookedFlights: BookedFlight[];
  isSearching: boolean;
  isLoadingBookings: boolean;
}

const initialState: FlightState = {
  search: { from: '', to: '', departDate: '', returnDate: '', passengers: 1, tripType: 'roundTrip', cabinClass: 'economy' },
  airports: AIRPORTS,
  results: [],
  bookedFlights: [],
  isSearching: false,
  isLoadingBookings: false,
};

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<Partial<FlightSearch>>) {
      state.search = { ...state.search, ...action.payload };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAirports.fulfilled, (state, action) => { state.airports = action.payload; })
      .addCase(searchFlights.pending, state => { state.isSearching = true; })
      .addCase(searchFlights.fulfilled, (state, action) => { state.results = action.payload; state.isSearching = false; })
      .addCase(searchFlights.rejected, state => { state.isSearching = false; })
      .addCase(fetchBookings.pending, state => { state.isLoadingBookings = true; })
      .addCase(fetchBookings.fulfilled, (state, action) => { state.bookedFlights = action.payload; state.isLoadingBookings = false; })
      .addCase(fetchBookings.rejected, state => { state.isLoadingBookings = false; })
      .addCase(createBooking.fulfilled, (state, action) => { state.bookedFlights.unshift(action.payload); })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const b = state.bookedFlights.find(b => b.id === action.payload);
        if (b) b.status = 'cancelled';
      });
  },
});

export const { setSearch } = flightSlice.actions;
export default flightSlice.reducer;
