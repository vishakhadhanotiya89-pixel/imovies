import { Movie, Theatre, Showtime, Booking, DashboardStats, SeatInfo, User } from '../types/index.ts';

const BASE_URL = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('imovies_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  // Auth
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<{ token: string; user: User; message: string }>(res);
  },

  async register(userData: { name: string; email: string; password: string; role?: string }) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse<{ token: string; user: User; message: string }>(res);
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ user: User }>(res);
  },

  // Movies
  async getMovies(params?: { status?: string; genre?: string; language?: string; search?: string; sortBy?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.genre && params.genre !== 'All') query.append('genre', params.genre);
    if (params?.language && params.language !== 'All') query.append('language', params.language);
    if (params?.search) query.append('search', params.search);
    if (params?.sortBy) query.append('sortBy', params.sortBy);

    const res = await fetch(`${BASE_URL}/movies?${query.toString()}`);
    return handleResponse<{ movies: Movie[]; filters: { genres: string[]; languages: string[] }; total: number }>(res);
  },

  async getMovieById(id: string) {
    const res = await fetch(`${BASE_URL}/movies/${id}`);
    return handleResponse<{ movie: Movie }>(res);
  },

  async createMovie(movieData: Partial<Movie>) {
    const res = await fetch(`${BASE_URL}/movies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(movieData),
    });
    return handleResponse<{ movie: Movie; message: string }>(res);
  },

  async updateMovie(id: string, movieData: Partial<Movie>) {
    const res = await fetch(`${BASE_URL}/movies/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(movieData),
    });
    return handleResponse<{ movie: Movie; message: string }>(res);
  },

  async deleteMovie(id: string) {
    const res = await fetch(`${BASE_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Theatres & Showtimes
  async getTheatres(city?: string) {
    const query = city && city !== 'All' ? `?city=${encodeURIComponent(city)}` : '';
    const res = await fetch(`${BASE_URL}/theatres${query}`);
    return handleResponse<{ theatres: Theatre[]; cities: string[]; total: number }>(res);
  },

  async createTheatre(data: Partial<Theatre>) {
    const res = await fetch(`${BASE_URL}/theatres`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ theatre: Theatre; message: string }>(res);
  },

  async deleteTheatre(id: string) {
    const res = await fetch(`${BASE_URL}/theatres/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async getShowtimes(params: { movieId?: string; theatreId?: string; date?: string; city?: string }) {
    const query = new URLSearchParams();
    if (params.movieId) query.append('movieId', params.movieId);
    if (params.theatreId) query.append('theatreId', params.theatreId);
    if (params.date) query.append('date', params.date);
    if (params.city && params.city !== 'All') query.append('city', params.city);

    const res = await fetch(`${BASE_URL}/showtimes?${query.toString()}`);
    return handleResponse<{ showtimes: Showtime[]; total: number }>(res);
  },

  async createShowtime(data: any) {
    const res = await fetch(`${BASE_URL}/showtimes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<{ showtime: Showtime; message: string }>(res);
  },

  async deleteShowtime(id: string) {
    const res = await fetch(`${BASE_URL}/showtimes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  async getShowtimeSeats(showtimeId: string) {
    const res = await fetch(`${BASE_URL}/showtimes/${showtimeId}/seats`);
    return handleResponse<{ showtime: Showtime; seats: SeatInfo[]; rowConfig: any[] }>(res);
  },

  // Bookings
  async createBooking(bookingData: { showtimeId: string; selectedSeats: string[]; paymentMethod?: string }) {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse<{ booking: Booking; message: string }>(res);
  },

  async getMyBookings() {
    const res = await fetch(`${BASE_URL}/bookings/my`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ bookings: Booking[]; total: number }>(res);
  },

  async getBookingById(id: string) {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ booking: Booking }>(res);
  },

  async cancelBooking(id: string) {
    const res = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string; booking: Booking }>(res);
  },

  // Admin
  async getAdminDashboard() {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ stats: DashboardStats }>(res);
  },

  async getAdminBookings(params?: { search?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`${BASE_URL}/admin/bookings?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ bookings: Booking[]; total: number }>(res);
  },
};
