export interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNo: string;
  from: Airport;
  to: Airport;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice: number;
  seatsLeft: number;
  class: 'economy' | 'business' | 'first';
  stops: number;
  aircraft: string;
}

export interface FlightSearch {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
  cabinClass: 'economy' | 'business' | 'first';
}

export interface BookedFlight {
  id: string;
  flight: Flight;
  passengers: number;
  totalPrice: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled';
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  bookingRef: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  badge: string | null;
  description: string;
  metalType: string;
  polishType: string;
  stock: number;
}

export interface CartItem extends Product {
  qty: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  image: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  metalType: string;
  polishType: string;
  sortBy: string;
  page: number;
}
