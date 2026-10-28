# IMovies – Movie Ticket Booking Made Simple

A full-stack, responsive movie ticket booking web application inspired by premier cinema chains. Browse blockbuster movies, explore auditoriums across metropolitan cities, pick interactive cinema seats, checkout via simulated payment, and receive verified digital boarding passes with QR codes. 

## 🎥 Project Demo

Watch the screen recording of the project:

[▶ Watch Project Demo on Google Drive](https://drive.google.com/file/d/1zgquil2sUCzBQLZmxiZCbUSpxCdGpQs4/view?usp=sharing)


---

## 🌟 Key Features

### 🎬 1. Movie Discovery & Exploration
- **Hero Spotlight**: Featured blockbuster banner with trailer modal, IMDb-style ratings, duration, certificate, and direct booking CTA.
- **Categorized Sections**: "Now Showing in Cinemas" and "Coming Soon" with genre pills and live filtering.
- **Advanced Movies Catalogue**: Search by movie title, director, or cast; filter by availability status, genre, and language; sort by highest rated, release date, and title.

### 🏛️ 2. Theatres & Multi-City Showtimes
- **Metropolitan Network**: Multi-city selector (New York, Los Angeles, Chicago, San Francisco, Austin).
- **Auditorium Formats**: IMAX with Laser, Dolby Cinema with Atmos, 4DX Dynamic Motion, and Standard Auditoriums.
- **Real-Time Schedules**: Date navigator (Today, Tomorrow, and upcoming dates) with screen formats and starting prices.

### 💺 3. Interactive Cinema Seating System
- **Curved Cinema Perspective**: Realistic perspective screen indicator showing hall orientation.
- **Tiered Seating Grid**:
  - **Standard Rows (A–D)**: $14 base ticket.
  - **Premium Rows (E–G)**: $18 ticket.
  - **VIP Recliner Lounges (H–J)**: $24 ticket.
- **Live Seat States**: Distinct visual feedback for Available, Selected, and Sold Out / Booked seats.
- **Safety Validations**:
  - Strictly prevents booking already reserved seats via server-side atomic locking.
  - Enforces 1 to 8 seats maximum per booking.
  - Live server-authoritative price recalculation (subtotal, convenience fee $1.75/ticket, 8% tax).

### 💳 4. Simulated Checkout & Digital Tickets
- **College Project Demo Notice**: Clear disclaimer with zero card information collected.
- **Flexible Simulated Payments**: Demo Credit/Debit Card, Demo Instant UPI / PIN, and Demo Apple/Google Pay.
- **Digital Cinema Boarding Pass**: Realistic ticket pass with unique booking reference (e.g. `IMOV-XXXX-XXXX`), barcode, and entry turnstile QR code.
- **Print & Download Friendly**: Clean print view layout for saving or physical printing.

### 🔐 5. User Authentication & Accounts
- **JWT & Bcrypt**: Secure token-based authentication with bcrypt password hashing.
- **One-Click Demo Logins**:
  - **Demo Customer**: `demo@imovies.com` / `password123`
  - **Demo Administrator**: `admin@imovies.com` / `admin123`
- **My Bookings Dashboard**: History of upcoming and past tickets with pass inspection and cancellation/refund capability.

### 🛡️ 6. Role-Protected Admin Console
- **Live Analytics**: Total bookings count, simulated demo revenue, tickets sold, active movies, total theatres, and auditorium occupancy rates.
- **Catalogue CRUD**: Add new movies, edit descriptions, toggle Now Showing / Coming Soon, and delete movies.
- **Venue & Showtime Scheduler**: Add theatres and schedule new screenings across dates, screens, and pricing tiers.
- **Auditorium Oversight**: Complete customer bookings table with instant status visibility.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, React Router v7, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js v20+, Express.js, TypeScript via TSX.
- **Database Layer**:
  - Native Mongoose models (`User`, `Movie`, `Theatre`, `Showtime`, `Booking`).
  - Embedded high-performance ACID in-memory reactive store with atomic seat reservation (runs out of the box with zero external dependencies).
  - MongoDB & MongoDB Atlas connection support via `MONGODB_URI`.
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt.js password hashing.

---

## 🚀 Getting Started

### 1. Installation
Install all dependencies for frontend and backend:
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Optional settings in `.env`:
```env
PORT=3000
JWT_SECRET=imovies_super_secret_cinema_jwt_key_2025
# Optional: Set this to connect to a local MongoDB or MongoDB Atlas instance
MONGODB_URI=mongodb://localhost:27017/imovies
```

### 3. Run Development Server
Start the unified full-stack server (Express API + Vite frontend on port 3000):
```bash
npm run dev
```

Visit **http://localhost:3000** in your web browser.

### 4. Standalone MongoDB Seeding (Optional)
If you have MongoDB running locally or on Atlas and set `MONGODB_URI`, populate the database:
```bash
npx tsx server/scripts/seed.ts
```

### 5. Run Automated Unit Tests
Verify pricing calculations, seat limit checks, and conflict detection:
```bash
npm test
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Login and receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |
| `GET` | `/api/movies` | Get movies (filters: genre, language, status, search, sort) | Public |
| `GET` | `/api/movies/:id` | Get movie details by ID | Public |
| `POST` | `/api/movies` | Create new movie in catalogue | Admin |
| `PUT` | `/api/movies/:id` | Update existing movie | Admin |
| `DELETE` | `/api/movies/:id` | Delete movie and associated showtimes | Admin |
| `GET` | `/api/theatres` | Get theatres (filter by city) | Public |
| `POST` | `/api/theatres` | Create new theatre | Admin |
| `DELETE` | `/api/theatres/:id` | Delete theatre | Admin |
| `GET` | `/api/showtimes` | Get showtimes (filter by movie, theatre, date, city) | Public |
| `GET` | `/api/showtimes/:id/seats` | Get seat map, tiers, and availability | Public |
| `POST` | `/api/showtimes` | Schedule new showtime | Admin |
| `DELETE` | `/api/showtimes/:id` | Cancel/delete showtime | Admin |
| `POST` | `/api/bookings` | Atomically reserve seats & book tickets | Authenticated |
| `GET` | `/api/bookings/my` | View authenticated user's tickets | Authenticated |
| `GET` | `/api/bookings/:id` | View ticket details | Authenticated / Admin |
| `POST` | `/api/bookings/:id/cancel` | Cancel booking and release seats | Authenticated |
| `GET` | `/api/admin/dashboard` | View metrics, occupancy, and sales | Admin |
| `GET` | `/api/admin/bookings` | View all customer bookings | Admin |

---

## 🧪 Pre-Configured Test Accounts

- **Demo Customer**:
  - Email: `demo@imovies.com`
  - Password: `password123`
- **Demo Administrator**:
  - Email: `admin@imovies.com`
  - Password: `admin123`
