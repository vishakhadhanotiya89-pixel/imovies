import { Response } from 'express';
import { dbStore } from '../db/store.ts';
import { AuthRequest } from '../middleware/auth.ts';

export function getDashboardStats(req: AuthRequest, res: Response) {
  try {
    const stats = dbStore.getDashboardStats();
    return res.status(200).json({ stats });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch dashboard statistics.' });
  }
}

export function getAllBookings(req: AuthRequest, res: Response) {
  try {
    const { search, status } = req.query as { search?: string; status?: string };
    let bookings = [...dbStore.bookings];

    if (status && status !== 'all') {
      bookings = bookings.filter((b) => b.bookingStatus === status);
    }

    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter((b) =>
        b.bookingReference.toLowerCase().includes(q) ||
        (b.movie?.title && b.movie.title.toLowerCase().includes(q)) ||
        (b.theatre?.name && b.theatre.name.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      bookings: bookings.map((b) => ({
        ...b,
        user: dbStore.findUserById(b.userId),
        movie: dbStore.getMovieById(b.movieId),
        theatre: dbStore.getTheatreById(b.theatreId),
      })),
      total: bookings.length,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch bookings.' });
  }
}
