import { Request, Response } from 'express';
import { dbStore } from '../db/store.ts';

export function getTheatres(req: Request, res: Response) {
  try {
    const { city } = req.query as { city?: string };
    const theatres = dbStore.getTheatres(city);
    const allTheatres = dbStore.theatres;
    const cities = Array.from(new Set(allTheatres.map((t) => t.city))).sort();

    return res.status(200).json({ theatres, cities, total: theatres.length });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch theatres.' });
  }
}

export function getShowtimes(req: Request, res: Response) {
  try {
    const { movieId, theatreId, date, city } = req.query as {
      movieId?: string;
      theatreId?: string;
      date?: string;
      city?: string;
    };

    const showtimes = dbStore.getShowtimes({ movieId, theatreId, date, city });
    return res.status(200).json({ showtimes, total: showtimes.length });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch showtimes.' });
  }
}

export function getShowtimeSeats(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = dbStore.getShowtimeSeats(id);
    if (!data) {
      return res.status(404).json({ error: 'Showtime not found.' });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch seat layout.' });
  }
}

export function createTheatre(req: Request, res: Response) {
  try {
    const { name, city, address, screens } = req.body;
    if (!name || !city || !address) {
      return res.status(400).json({ error: 'Name, city, and address are required.' });
    }

    const newTheatre = dbStore.createTheatre({
      name,
      city,
      address,
      screens: screens && screens.length ? screens : [
        { name: 'Auditorium 1 (IMAX)', type: 'IMAX Laser', totalSeats: 80 },
        { name: 'Auditorium 2 (Standard)', type: 'Standard', totalSeats: 70 },
      ],
    });

    return res.status(201).json({ message: 'Theatre created successfully.', theatre: newTheatre });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create theatre.' });
  }
}

export function updateTheatre(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = dbStore.updateTheatre(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Theatre not found.' });
    }
    return res.status(200).json({ message: 'Theatre updated successfully.', theatre: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update theatre.' });
  }
}

export function deleteTheatre(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = dbStore.deleteTheatre(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Theatre not found.' });
    }
    return res.status(200).json({ message: 'Theatre deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete theatre.' });
  }
}

export function createShowtime(req: Request, res: Response) {
  try {
    const { movieId, theatreId, screen, screenType, date, time, ticketPrice, tierPricing } = req.body;

    if (!movieId || !theatreId || !date || !time) {
      return res.status(400).json({ error: 'Movie, theatre, date, and time are required.' });
    }

    const basePrice = Number(ticketPrice) || 15;
    const newShowtime = dbStore.createShowtime({
      movieId,
      theatreId,
      screen: screen || 'Auditorium 1',
      screenType: screenType || 'Standard',
      date,
      time,
      ticketPrice: basePrice,
      tierPricing: tierPricing || {
        Standard: basePrice,
        Premium: basePrice + 4,
        VIP: basePrice + 10,
      },
    });

    return res.status(201).json({ message: 'Showtime created successfully.', showtime: newShowtime });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create showtime.' });
  }
}

export function deleteShowtime(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = dbStore.deleteShowtime(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Showtime not found.' });
    }
    return res.status(200).json({ message: 'Showtime deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete showtime.' });
  }
}
