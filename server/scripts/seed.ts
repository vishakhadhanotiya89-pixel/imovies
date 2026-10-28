import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../models/User.ts';
import { MovieModel } from '../models/Movie.ts';
import { TheatreModel } from '../models/Theatre.ts';
import { ShowtimeModel } from '../models/Showtime.ts';
import { initialMovies, initialTheatres, generateInitialShowtimes, getInitialUsers } from '../data/seedData.ts';

dotenv.config();

async function seedMongoDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imovies';
  console.log(`Connecting to MongoDB at: ${mongoUri}...`);

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');

    // Clear existing collections
    console.log('Clearing old collections...');
    await Promise.all([
      UserModel.deleteMany({}),
      MovieModel.deleteMany({}),
      TheatreModel.deleteMany({}),
      ShowtimeModel.deleteMany({}),
    ]);

    // Insert Users
    console.log('Inserting seed users...');
    const users = getInitialUsers();
    await UserModel.insertMany(users);
    console.log(`- Inserted ${users.length} users (Demo: demo@imovies.com / password123, Admin: admin@imovies.com / admin123)`);

    // Insert Movies
    console.log('Inserting seed movies...');
    const createdMovies = await MovieModel.insertMany(initialMovies.map(({ _id, ...rest }) => rest));
    console.log(`- Inserted ${createdMovies.length} movies.`);

    // Insert Theatres
    console.log('Inserting seed theatres...');
    const createdTheatres = await TheatreModel.insertMany(initialTheatres.map(({ _id, ...rest }) => rest));
    console.log(`- Inserted ${createdTheatres.length} theatres.`);

    // Insert Showtimes mapped to created IDs
    console.log('Generating and inserting showtimes...');
    const generatedShowtimes = generateInitialShowtimes();
    const showtimesToInsert = generatedShowtimes.map((st) => {
      // Find corresponding created movie & theatre
      const originalMovie = initialMovies.find((m) => m._id === st.movieId);
      const originalTheatre = initialTheatres.find((t) => t._id === st.theatreId);

      const matchedMovie = createdMovies.find((m) => m.title === originalMovie?.title) || createdMovies[0];
      const matchedTheatre = createdTheatres.find((t) => t.name === originalTheatre?.name) || createdTheatres[0];

      return {
        movieId: matchedMovie._id,
        theatreId: matchedTheatre._id,
        screen: st.screen,
        screenType: st.screenType,
        date: st.date,
        time: st.time,
        ticketPrice: st.ticketPrice,
        tierPricing: st.tierPricing,
        bookedSeats: st.bookedSeats,
      };
    });

    await ShowtimeModel.insertMany(showtimesToInsert);
    console.log(`- Inserted ${showtimesToInsert.length} showtimes.`);

    console.log('=== Database seeding completed successfully! ===');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding MongoDB database:', error);
    process.exit(1);
  }
}

seedMongoDB();
