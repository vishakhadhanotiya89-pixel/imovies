import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.ts';
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.ts';
import {
  getTheatres,
  getShowtimes,
  getShowtimeSeats,
  createTheatre,
  updateTheatre,
  deleteTheatre,
  createShowtime,
  deleteShowtime,
} from '../controllers/theatreController.ts';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/bookingController.ts';
import { getDashboardStats, getAllBookings } from '../controllers/adminController.ts';
import { authenticate, requireAdmin } from '../middleware/auth.ts';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'IMovies', timestamp: new Date().toISOString() });
});

// Authentication
apiRouter.post('/auth/register', register);
apiRouter.post('/auth/login', login);
apiRouter.get('/auth/me', authenticate, getMe);

// Movies
apiRouter.get('/movies', getMovies);
apiRouter.get('/movies/:id', getMovieById);
apiRouter.post('/movies', requireAdmin, createMovie);
apiRouter.put('/movies/:id', requireAdmin, updateMovie);
apiRouter.delete('/movies/:id', requireAdmin, deleteMovie);

// Theatres & Showtimes
apiRouter.get('/theatres', getTheatres);
apiRouter.post('/theatres', requireAdmin, createTheatre);
apiRouter.put('/theatres/:id', requireAdmin, updateTheatre);
apiRouter.delete('/theatres/:id', requireAdmin, deleteTheatre);

apiRouter.get('/showtimes', getShowtimes);
apiRouter.post('/showtimes', requireAdmin, createShowtime);
apiRouter.delete('/showtimes/:id', requireAdmin, deleteShowtime);
apiRouter.get('/showtimes/:id/seats', getShowtimeSeats);

// Bookings
apiRouter.post('/bookings', authenticate, createBooking);
apiRouter.get('/bookings/my', authenticate, getUserBookings);
apiRouter.get('/bookings/:id', authenticate, getBookingById);
apiRouter.post('/bookings/:id/cancel', authenticate, cancelBooking);

// Admin
apiRouter.get('/admin/dashboard', requireAdmin, getDashboardStats);
apiRouter.get('/admin/bookings', requireAdmin, getAllBookings);
