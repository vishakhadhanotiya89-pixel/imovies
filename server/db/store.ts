import mongoose from 'mongoose';
import { initialMovies, initialTheatres, generateInitialShowtimes, getInitialUsers } from '../data/seedData.ts';
import { User, Movie, Theatre, Showtime, Booking, SeatInfo, SeatTier } from '../../src/types/index.ts';

// Standard seat layout configuration
export const ROW_CONFIG: { row: string; tier: SeatTier; cols: number }[] = [
  { row: 'A', tier: 'Standard', cols: 10 },
  { row: 'B', tier: 'Standard', cols: 10 },
  { row: 'C', tier: 'Standard', cols: 10 },
  { row: 'D', tier: 'Standard', cols: 10 },
  { row: 'E', tier: 'Premium', cols: 10 },
  { row: 'F', tier: 'Premium', cols: 10 },
  { row: 'G', tier: 'Premium', cols: 10 },
  { row: 'H', tier: 'VIP', cols: 8 },
  { row: 'J', tier: 'VIP', cols: 8 },
];

class MemoryStore {
  users: User[] = [];
  movies: Movie[] = [];
  theatres: Theatre[] = [];
  showtimes: Showtime[] = [];
  bookings: Booking[] = [];
  isInitialized = false;

  constructor() {
    this.seed();
  }

  seed() {
    this.users = getInitialUsers();
    this.movies = JSON.parse(JSON.stringify(initialMovies));
    this.theatres = JSON.parse(JSON.stringify(initialTheatres));
    this.showtimes = generateInitialShowtimes();

    // Sample initial booking for Demo User
    const firstShowtime = this.showtimes[0];
    const firstMovie = this.movies.find((m) => m._id === firstShowtime.movieId)!;
    const firstTheatre = this.theatres.find((t) => t._id === firstShowtime.theatreId)!;

    this.bookings = [
      {
        _id: 'bk_sample_1',
        bookingReference: 'IMOV-4K89-Z27P',
        userId: 'usr_customer_1',
        showtimeId: firstShowtime._id,
        movieId: firstMovie._id,
        theatreId: firstTheatre._id,
        selectedSeats: ['E5', 'E6'],
        ticketCount: 2,
        subtotal: 36.00,
        convenienceFee: 3.50,
        tax: 3.16,
        totalAmount: 42.66,
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        paymentMethod: 'Simulated Card / Demo Pay',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        movie: firstMovie,
        theatre: firstTheatre,
        showtime: firstShowtime,
      },
    ];

    this.isInitialized = true;
    console.log('[IMovies Store] In-memory database initialized with seed data.');
  }

  // User queries
  findUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string) {
    return this.users.find((u) => u._id === id);
  }

  createUser(userData: Partial<User> & { passwordHash: string }) {
    const newUser: User & { passwordHash: string } = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'customer',
      createdAt: new Date().toISOString(),
      passwordHash: userData.passwordHash,
    };
    this.users.push(newUser);
    return newUser;
  }

  // Movie queries
  getMovies(filter?: { status?: string; genre?: string; language?: string; search?: string }) {
    let result = [...this.movies];
    if (filter?.status) {
      result = result.filter((m) => m.status === filter.status);
    }
    if (filter?.genre && filter.genre !== 'All') {
      result = result.filter((m) => m.genre.some((g) => g.toLowerCase() === filter.genre!.toLowerCase()));
    }
    if (filter?.language && filter.language !== 'All') {
      result = result.filter((m) => m.language.toLowerCase() === filter.language!.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.genre.some((g) => g.toLowerCase().includes(q)) ||
          m.cast.some((c) => c.toLowerCase().includes(q))
      );
    }
    return result;
  }

  getMovieById(id: string) {
    return this.movies.find((m) => m._id === id);
  }

  createMovie(movieData: Omit<Movie, '_id'>) {
    const newMovie: Movie = {
      ...movieData,
      _id: `mov_${Date.now()}`,
    };
    this.movies.unshift(newMovie);
    return newMovie;
  }

  updateMovie(id: string, movieData: Partial<Movie>) {
    const index = this.movies.findIndex((m) => m._id === id);
    if (index === -1) return null;
    this.movies[index] = { ...this.movies[index], ...movieData };
    return this.movies[index];
  }

  deleteMovie(id: string) {
    const index = this.movies.findIndex((m) => m._id === id);
    if (index === -1) return false;
    this.movies.splice(index, 1);
    // Also remove associated showtimes
    this.showtimes = this.showtimes.filter((st) => st.movieId !== id);
    return true;
  }

  // Theatre queries
  getTheatres(city?: string) {
    if (city && city !== 'All') {
      return this.theatres.filter((t) => t.city.toLowerCase() === city.toLowerCase());
    }
    return this.theatres;
  }

  getTheatreById(id: string) {
    return this.theatres.find((t) => t._id === id);
  }

  createTheatre(theatreData: Omit<Theatre, '_id'>) {
    const newTheatre: Theatre = {
      ...theatreData,
      _id: `th_${Date.now()}`,
    };
    this.theatres.push(newTheatre);
    return newTheatre;
  }

  updateTheatre(id: string, theatreData: Partial<Theatre>) {
    const index = this.theatres.findIndex((t) => t._id === id);
    if (index === -1) return null;
    this.theatres[index] = { ...this.theatres[index], ...theatreData };
    return this.theatres[index];
  }

  deleteTheatre(id: string) {
    const index = this.theatres.findIndex((t) => t._id === id);
    if (index === -1) return false;
    this.theatres.splice(index, 1);
    return true;
  }

  // Showtime queries
  getShowtimes(query: { movieId?: string; theatreId?: string; date?: string; city?: string }) {
    let result = [...this.showtimes];

    if (query.movieId) {
      result = result.filter((st) => st.movieId === query.movieId);
    }
    if (query.theatreId) {
      result = result.filter((st) => st.theatreId === query.theatreId);
    }
    if (query.date) {
      result = result.filter((st) => st.date === query.date);
    }
    if (query.city && query.city !== 'All') {
      const cityTheatreIds = new Set(
        this.theatres.filter((t) => t.city.toLowerCase() === query.city!.toLowerCase()).map((t) => t._id)
      );
      result = result.filter((st) => cityTheatreIds.has(st.theatreId));
    }

    // Populate movie and theatre
    return result.map((st) => ({
      ...st,
      movie: this.movies.find((m) => m._id === st.movieId),
      theatre: this.theatres.find((t) => t._id === st.theatreId),
    }));
  }

  getShowtimeById(id: string) {
    const st = this.showtimes.find((s) => s._id === id);
    if (!st) return null;
    return {
      ...st,
      movie: this.movies.find((m) => m._id === st.movieId),
      theatre: this.theatres.find((t) => t._id === st.theatreId),
    };
  }

  createShowtime(data: Omit<Showtime, '_id' | 'bookedSeats'>) {
    const newSt: Showtime = {
      ...data,
      _id: `st_${Date.now()}`,
      bookedSeats: [],
    };
    this.showtimes.push(newSt);
    return this.getShowtimeById(newSt._id);
  }

  deleteShowtime(id: string) {
    const index = this.showtimes.findIndex((s) => s._id === id);
    if (index === -1) return false;
    this.showtimes.splice(index, 1);
    return true;
  }

  // Generates interactive seat layout with pricing and booked status
  getShowtimeSeats(showtimeId: string): { showtime: Showtime; seats: SeatInfo[]; rowConfig: typeof ROW_CONFIG } | null {
    const showtime = this.getShowtimeById(showtimeId);
    if (!showtime) return null;

    const bookedSet = new Set((showtime.bookedSeats || []).map((s) => s.toUpperCase()));
    const seats: SeatInfo[] = [];

    ROW_CONFIG.forEach(({ row, tier, cols }) => {
      const price = showtime.tierPricing[tier] || showtime.ticketPrice;
      for (let col = 1; col <= cols; col++) {
        const seatNumber = `${row}${col}`;
        seats.push({
          seatNumber,
          row,
          col,
          tier,
          price,
          isBooked: bookedSet.has(seatNumber),
        });
      }
    });

    return {
      showtime,
      seats,
      rowConfig: ROW_CONFIG,
    };
  }

  // Atomic seat booking logic: verifies seats are not already booked and commits them
  bookSeatsAtomically(
    showtimeId: string,
    requestedSeats: string[],
    bookingDetails: Omit<Booking, '_id' | 'createdAt' | 'bookingStatus'>
  ): { success: boolean; booking?: Booking; error?: string } {
    const showtime = this.showtimes.find((s) => s._id === showtimeId);
    if (!showtime) {
      return { success: false, error: 'Showtime not found.' };
    }

    const upperRequested = requestedSeats.map((s) => s.toUpperCase());
    const bookedSet = new Set(showtime.bookedSeats.map((s) => s.toUpperCase()));

    // Check for collisions
    const collisions = upperRequested.filter((s) => bookedSet.has(s));
    if (collisions.length > 0) {
      return {
        success: false,
        error: `Seats already booked by another patron: ${collisions.join(', ')}. Please pick different seats.`,
      };
    }

    // Atomic update
    showtime.bookedSeats.push(...upperRequested);

    const newBooking: Booking = {
      ...bookingDetails,
      _id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookingStatus: 'confirmed',
      createdAt: new Date().toISOString(),
      movie: this.getMovieById(bookingDetails.movieId),
      theatre: this.getTheatreById(bookingDetails.theatreId),
      showtime: this.getShowtimeById(showtimeId) || undefined,
    };

    this.bookings.unshift(newBooking);

    return {
      success: true,
      booking: newBooking,
    };
  }

  // Bookings
  getUserBookings(userId: string) {
    return this.bookings
      .filter((b) => b.userId === userId)
      .map((b) => ({
        ...b,
        movie: this.getMovieById(b.movieId),
        theatre: this.getTheatreById(b.theatreId),
        showtime: this.getShowtimeById(b.showtimeId) || undefined,
      }));
  }

  getBookingById(id: string) {
    const b = this.bookings.find((item) => item._id === id || item.bookingReference === id);
    if (!b) return null;
    return {
      ...b,
      movie: this.getMovieById(b.movieId),
      theatre: this.getTheatreById(b.theatreId),
      showtime: this.getShowtimeById(b.showtimeId) || undefined,
      user: this.findUserById(b.userId),
    };
  }

  cancelBooking(id: string, userId: string) {
    const booking = this.bookings.find((b) => b._id === id && b.userId === userId);
    if (!booking) return null;

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';

    // Release seats in showtime
    const st = this.showtimes.find((s) => s._id === booking.showtimeId);
    if (st) {
      const seatsToFree = new Set(booking.selectedSeats.map((s) => s.toUpperCase()));
      st.bookedSeats = st.bookedSeats.filter((s) => !seatsToFree.has(s.toUpperCase()));
    }

    return booking;
  }

  // Admin dashboard stats
  getDashboardStats() {
    const totalBookings = this.bookings.filter((b) => b.bookingStatus === 'confirmed').length;
    const totalRevenue = this.bookings
      .filter((b) => b.bookingStatus === 'confirmed')
      .reduce((acc, b) => acc + b.totalAmount, 0);
    const totalTicketsSold = this.bookings
      .filter((b) => b.bookingStatus === 'confirmed')
      .reduce((acc, b) => acc + b.ticketCount, 0);

    // Calculate approximate overall seat occupancy
    const totalBookedSeatsAcrossAll = this.showtimes.reduce((acc, s) => acc + (s.bookedSeats?.length || 0), 0);
    const totalCapacityAcrossAll = this.showtimes.length * 80;
    const occupancyRate = totalCapacityAcrossAll > 0 ? Number(((totalBookedSeatsAcrossAll / totalCapacityAcrossAll) * 100).toFixed(1)) : 0;

    return {
      totalBookings,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalTicketsSold,
      totalMovies: this.movies.length,
      totalTheatres: this.theatres.length,
      occupancyRate,
      recentBookings: this.bookings.slice(0, 10).map((b) => ({
        ...b,
        movie: this.getMovieById(b.movieId),
        theatre: this.getTheatreById(b.theatreId),
        user: this.findUserById(b.userId),
      })),
    };
  }
}

export const dbStore = new MemoryStore();

// Setup optional Mongoose connection if MONGODB_URI is specified
export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB via Mongoose:', mongoUri);
    } catch (err) {
      console.warn('MongoDB connection failed, continuing with IMovies high-performance store:', err);
    }
  } else {
    console.log('IMovies database active (in-memory persistent store initialized with demo seed data).');
  }
}
