import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { BookingProvider } from './context/BookingContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { ScrollToTop } from './components/layout/ScrollToTop.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { MoviesPage } from './pages/MoviesPage.tsx';
import { MovieDetailsPage } from './pages/MovieDetailsPage.tsx';
import { TheatresPage } from './pages/TheatresPage.tsx';
import { SeatSelectionPage } from './pages/SeatSelectionPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { ConfirmationPage } from './pages/ConfirmationPage.tsx';
import { MyBookingsPage } from './pages/MyBookingsPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/:id" element={<MovieDetailsPage />} />
                <Route path="/theatres" element={<TheatresPage />} />
                <Route path="/seat-selection/:showtimeId" element={<SeatSelectionPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/confirmation/:id" element={<ConfirmationPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
