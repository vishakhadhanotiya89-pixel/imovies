export type UserRole = 'customer' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type MovieStatus = 'now_showing' | 'coming_soon';

export interface Movie {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  genre: string[];
  language: string;
  duration: number; // in minutes
  rating: number; // e.g. 8.6
  releaseDate: string; // ISO date
  cast: string[];
  director: string;
  status: MovieStatus;
  certificate?: string; // PG-13, R, etc.
  trailerUrl?: string;
}

export interface Screen {
  name: string;
  type: 'IMAX Laser' | 'Dolby Cinema' | '4DX' | 'Standard';
  totalSeats: number;
}

export interface Theatre {
  _id: string;
  name: string;
  city: string;
  address: string;
  screens: Screen[];
}

export type SeatTier = 'Standard' | 'Premium' | 'VIP';

export interface SeatInfo {
  seatNumber: string; // e.g. "C5"
  row: string; // e.g. "C"
  col: number; // e.g. 5
  tier: SeatTier;
  price: number;
  isBooked: boolean;
  isSelected?: boolean;
}

export interface Showtime {
  _id: string;
  movieId: string;
  theatreId: string;
  screen: string;
  screenType: 'IMAX Laser' | 'Dolby Cinema' | '4DX' | 'Standard';
  date: string; // YYYY-MM-DD
  time: string; // e.g. "18:30"
  ticketPrice: number; // base price
  tierPricing: {
    Standard: number;
    Premium: number;
    VIP: number;
  };
  bookedSeats: string[]; // array of seat numbers e.g. ["A1", "A2"]
  movie?: Movie;
  theatre?: Theatre;
}

export type BookingStatus = 'confirmed' | 'cancelled';
export type PaymentStatus = 'completed' | 'pending' | 'refunded';

export interface Booking {
  _id: string;
  bookingReference: string;
  userId: string;
  showtimeId: string;
  movieId: string;
  theatreId: string;
  selectedSeats: string[];
  ticketCount: number;
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  paymentMethod: string;
  createdAt: string;
  // Populated fields:
  user?: Pick<User, '_id' | 'name' | 'email'>;
  movie?: Movie;
  theatre?: Theatre;
  showtime?: Showtime;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalTicketsSold: number;
  totalMovies: number;
  totalTheatres: number;
  recentBookings: Booking[];
  occupancyRate: number;
}
