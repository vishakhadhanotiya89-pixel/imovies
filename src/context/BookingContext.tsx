import React, { createContext, useContext, useState } from 'react';
import { Movie, Theatre, Showtime } from '../types/index.ts';

interface BookingContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  selectedTheatre: Theatre | null;
  setSelectedTheatre: (theatre: Theatre | null) => void;
  selectedShowtime: Showtime | null;
  setSelectedShowtime: (showtime: Showtime | null) => void;
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
  toggleSeat: (seatNumber: string) => { added: boolean; error?: string };
  clearSeats: () => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>('New York');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheatre, setSelectedTheatre] = useState<Theatre | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatNumber));
      return { added: false };
    } else {
      if (selectedSeats.length >= 8) {
        return { added: false, error: 'Maximum 8 seats allowed per booking.' };
      }
      setSelectedSeats((prev) => [...prev, seatNumber]);
      return { added: true };
    }
  };

  const clearSeats = () => setSelectedSeats([]);

  const resetBooking = () => {
    setSelectedMovie(null);
    setSelectedTheatre(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        selectedDate,
        setSelectedDate,
        selectedMovie,
        setSelectedMovie,
        selectedTheatre,
        setSelectedTheatre,
        selectedShowtime,
        setSelectedShowtime,
        selectedSeats,
        setSelectedSeats,
        toggleSeat,
        clearSeats,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
