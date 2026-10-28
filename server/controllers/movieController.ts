import { Request, Response } from 'express';
import { dbStore } from '../db/store.ts';

export function getMovies(req: Request, res: Response) {
  try {
    const { status, genre, language, search, sortBy } = req.query as Record<string, string>;

    let movies = dbStore.getMovies({ status, genre, language, search });

    // Sorting
    if (sortBy === 'rating_desc') {
      movies.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'release_desc') {
      movies.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    } else if (sortBy === 'title_asc') {
      movies.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'duration_desc') {
      movies.sort((a, b) => b.duration - a.duration);
    }

    // Collect available unique genres and languages for filters
    const allMovies = dbStore.movies;
    const allGenres = Array.from(new Set(allMovies.flatMap((m) => m.genre))).sort();
    const allLanguages = Array.from(new Set(allMovies.map((m) => m.language))).sort();

    return res.status(200).json({
      movies,
      filters: {
        genres: allGenres,
        languages: allLanguages,
      },
      total: movies.length,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch movies.' });
  }
}

export function getMovieById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const movie = dbStore.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    return res.status(200).json({ movie });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch movie.' });
  }
}

export function createMovie(req: Request, res: Response) {
  try {
    const { title, description, posterUrl, backdropUrl, genre, language, duration, rating, releaseDate, cast, director, status, certificate } = req.body;

    if (!title || !description || !posterUrl || !duration) {
      return res.status(400).json({ error: 'Missing required movie fields (title, description, posterUrl, duration).' });
    }

    const newMovie = dbStore.createMovie({
      title,
      description,
      posterUrl,
      backdropUrl: backdropUrl || posterUrl,
      genre: Array.isArray(genre) ? genre : (genre || 'Action').split(',').map((s: string) => s.trim()),
      language: language || 'English',
      duration: Number(duration),
      rating: Number(rating) || 7.5,
      releaseDate: releaseDate || new Date().toISOString().split('T')[0],
      cast: Array.isArray(cast) ? cast : (cast || '').split(',').map((s: string) => s.trim()),
      director: director || 'Unknown Director',
      status: status === 'coming_soon' ? 'coming_soon' : 'now_showing',
      certificate: certificate || 'PG-13',
    });

    return res.status(201).json({ message: 'Movie created successfully.', movie: newMovie });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to create movie.' });
  }
}

export function updateMovie(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updated = dbStore.updateMovie(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    return res.status(200).json({ message: 'Movie updated successfully.', movie: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update movie.' });
  }
}

export function deleteMovie(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = dbStore.deleteMovie(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    return res.status(200).json({ message: 'Movie deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to delete movie.' });
  }
}
