import bcrypt from 'bcryptjs';

export const initialMovies = [
  {
    _id: 'mov_1',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    language: 'English',
    duration: 166,
    rating: 8.6,
    releaseDate: '2024-03-01',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    director: 'Denis Villeneuve',
    status: 'now_showing' as const,
    certificate: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
  },
  {
    _id: 'mov_2',
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during the Manhattan Project, exploring the moral and geopolitical weight of ultimate scientific discovery.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    genre: ['Biography', 'Drama', 'History'],
    language: 'English',
    duration: 180,
    rating: 8.9,
    releaseDate: '2023-07-21',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
    status: 'now_showing' as const,
    certificate: 'R',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
  },
  {
    _id: 'mov_3',
    title: 'Interstellar: 10th Anniversary IMAX',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    language: 'English',
    duration: 169,
    rating: 8.7,
    releaseDate: '2024-09-27',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    status: 'now_showing' as const,
    certificate: 'PG-13',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
  },
  {
    _id: 'mov_4',
    title: 'Spider-Man: Beyond the Spider-Verse',
    description: 'Miles Morales journeys across the multiverse alongside Gwen Stacy and a brave crew of alternate spider-heroes to stop the reality-shattering Spot and rewrite destiny on his own terms.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
    genre: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    duration: 140,
    rating: 9.0,
    releaseDate: '2025-05-15',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    status: 'coming_soon' as const,
    certificate: 'PG',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
  },
  {
    _id: 'mov_5',
    title: 'Gladiator II',
    description: 'Years after witnessing the death of revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Drama', 'Adventure'],
    language: 'English',
    duration: 148,
    rating: 8.1,
    releaseDate: '2024-11-22',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    director: 'Ridley Scott',
    status: 'now_showing' as const,
    certificate: 'R',
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
  },
  {
    _id: 'mov_6',
    title: 'Avatar: Fire and Ash',
    description: 'Jake Sully and Neytiri encounter a new, aggressive tribe of Na\'vi known as the "Ash People" who live near active volcanoes, pushing the conflicts across Pandora into incendiary new territory.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    genre: ['Sci-Fi', 'Action', 'Fantasy'],
    language: 'English',
    duration: 190,
    rating: 8.8,
    releaseDate: '2025-12-19',
    cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver', 'Stephen Lang'],
    director: 'James Cameron',
    status: 'coming_soon' as const,
    certificate: 'PG-13',
  },
  {
    _id: 'mov_7',
    title: 'The Batman: Part II',
    description: 'Bruce Wayne delves deeper into Gotham\'s sprawling criminal underworld and confronting corrupt institutions, battling psychological warfare from dangerous new villains emerging from the shadows.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1600&q=80',
    genre: ['Crime', 'Action', 'Mystery'],
    language: 'English',
    duration: 165,
    rating: 8.4,
    releaseDate: '2025-10-02',
    cast: ['Robert Pattinson', 'Andy Serkis', 'Colin Farrell', 'Jeffrey Wright'],
    director: 'Matt Reeves',
    status: 'coming_soon' as const,
    certificate: 'PG-13',
  },
  {
    _id: 'mov_8',
    title: 'Kalki 2898 AD',
    description: 'A modern avatar of Vishnu descends to Earth in a dystopian post-apocalyptic future to protect humankind from totalitarian forces ruling over the ancient city of Kasi.',
    posterUrl: 'https://images.unsplash.com/photo-1533613236708-3478238838b5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
    genre: ['Sci-Fi', 'Action', 'Mythology'],
    language: 'Hindi',
    duration: 181,
    rating: 7.9,
    releaseDate: '2024-06-27',
    cast: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone'],
    director: 'Nag Ashwin',
    status: 'now_showing' as const,
    certificate: 'PG-13',
  },
  {
    _id: 'mov_9',
    title: 'Wicked',
    description: 'The untold story of the witches of Oz: Elphaba, a misunderstood young woman born with green skin, and Glinda, a popular blonde girl, whose extraordinary friendship changes the course of their lives and land.',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    genre: ['Fantasy', 'Musical', 'Romance'],
    language: 'English',
    duration: 160,
    rating: 8.2,
    releaseDate: '2024-11-22',
    cast: ['Cynthia Erivo', 'Ariana Grande', 'Jeff Goldblum', 'Michelle Yeoh'],
    director: 'Jon M. Chu',
    status: 'now_showing' as const,
    certificate: 'PG',
  },
  {
    _id: 'mov_10',
    title: 'Challengers',
    description: 'Tashi, a tennis prodigy turned coach, transformed her husband into a world-famous grand slam champion. To jolt him out of his recent losing streak, she enters him into a challenger event against his former best friend and her ex-lover.',
    posterUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1600&q=80',
    genre: ['Drama', 'Romance', 'Sport'],
    language: 'English',
    duration: 131,
    rating: 7.7,
    releaseDate: '2024-04-26',
    cast: ['Zendaya', 'Josh O\'Connor', 'Mike Faist'],
    director: 'Luca Guadagnino',
    status: 'now_showing' as const,
    certificate: 'R',
  },
  {
    _id: 'mov_11',
    title: 'La La Land: In Concert',
    description: 'A jazz pianist falls for an aspiring actress in Los Angeles as both pursue their dreams in a bittersweet musical celebration of art, passion, and fate.',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    genre: ['Musical', 'Romance', 'Drama'],
    language: 'English',
    duration: 128,
    rating: 8.0,
    releaseDate: '2024-02-14',
    cast: ['Ryan Gosling', 'Emma Stone', 'John Legend'],
    director: 'Damien Chazelle',
    status: 'now_showing' as const,
    certificate: 'PG-13',
  },
  {
    _id: 'mov_12',
    title: 'Deadpool & Wolverine',
    description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, fourth-wall breaking Deadpool. They team up to defeat a common enemy and rescue the universe from annihilation.',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    language: 'English',
    duration: 128,
    rating: 7.8,
    releaseDate: '2024-07-26',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
    director: 'Shawn Levy',
    status: 'now_showing' as const,
    certificate: 'R',
  }
];

export const initialTheatres = [
  {
    _id: 'th_1',
    name: 'IMAX Grand Cinema Lincoln Square',
    city: 'New York',
    address: '1998 Broadway, New York, NY 10023',
    screens: [
      { name: 'Auditorium 1 (IMAX 70mm)', type: 'IMAX Laser' as const, totalSeats: 80 },
      { name: 'Auditorium 2 (Dolby Atmos)', type: 'Dolby Cinema' as const, totalSeats: 80 },
      { name: 'Auditorium 3 (Standard)', type: 'Standard' as const, totalSeats: 70 },
    ],
  },
  {
    _id: 'th_2',
    name: 'TCL Chinese Theatres & Luxe Cinema',
    city: 'Los Angeles',
    address: '6925 Hollywood Blvd, Hollywood, CA 90028',
    screens: [
      { name: 'Main Palace Screen', type: 'IMAX Laser' as const, totalSeats: 80 },
      { name: 'VIP Luxe Suite', type: 'Dolby Cinema' as const, totalSeats: 80 },
      { name: 'Screen 3 Dynamic', type: '4DX' as const, totalSeats: 60 },
    ],
  },
  {
    _id: 'th_3',
    name: 'Metropolis Millennium Megaplex',
    city: 'Chicago',
    address: '600 N Michigan Ave, Chicago, IL 60611',
    screens: [
      { name: 'Screen 1 IMAX Experience', type: 'IMAX Laser' as const, totalSeats: 80 },
      { name: 'Screen 2 Dolby Premier', type: 'Dolby Cinema' as const, totalSeats: 80 },
      { name: 'Screen 3 Standard', type: 'Standard' as const, totalSeats: 70 },
    ],
  },
  {
    _id: 'th_4',
    name: 'Embarcadero Cinema & Dine',
    city: 'San Francisco',
    address: '1 Embarcadero Center, San Francisco, CA 94111',
    screens: [
      { name: 'Screen A Dolby Vision', type: 'Dolby Cinema' as const, totalSeats: 80 },
      { name: 'Screen B 4DX Sensory', type: '4DX' as const, totalSeats: 60 },
      { name: 'Screen C Classic', type: 'Standard' as const, totalSeats: 70 },
    ],
  },
  {
    _id: 'th_5',
    name: 'Alamo Cinema Palace Downtown',
    city: 'Austin',
    address: '320 E 6th St, Austin, TX 78701',
    screens: [
      { name: 'The Big Screen IMAX', type: 'IMAX Laser' as const, totalSeats: 80 },
      { name: 'Vintage 35mm Room', type: 'Dolby Cinema' as const, totalSeats: 80 },
      { name: 'Screen 3', type: 'Standard' as const, totalSeats: 70 },
    ],
  },
];

export function getTodayDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function generateInitialShowtimes() {
  const showtimes = [];
  const times = ['11:30', '14:45', '17:30', '20:15', '22:45'];
  let idCounter = 1;

  // Generate showtimes for Now Showing movies across theatres for today, tomorrow, and next 2 days
  const activeMovies = initialMovies.filter((m) => m.status === 'now_showing');

  for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
    const dateStr = getTodayDateString(dayOffset);

    for (let tIndex = 0; tIndex < initialTheatres.length; tIndex++) {
      const theatre = initialTheatres[tIndex];

      // Assign 3 movies per theatre per day
      for (let mIndex = 0; mIndex < 3; mIndex++) {
        const movie = activeMovies[(tIndex + mIndex) % activeMovies.length];
        const screen = theatre.screens[mIndex % theatre.screens.length];

        // Pick 2-3 showtimes for this movie
        const chosenTimes = [times[mIndex % times.length], times[(mIndex + 2) % times.length]];

        for (const time of chosenTimes) {
          // Pre-populate realistic booked seats for variety
          const preBooked = [];
          if (idCounter % 2 === 0) preBooked.push('D4', 'D5', 'D6');
          if (idCounter % 3 === 0) preBooked.push('E5', 'E6', 'F7', 'F8');
          if (idCounter % 5 === 0) preBooked.push('C3', 'C4', 'G1', 'G2');

          showtimes.push({
            _id: `st_${idCounter++}`,
            movieId: movie._id,
            theatreId: theatre._id,
            screen: screen.name,
            screenType: screen.type,
            date: dateStr,
            time,
            ticketPrice: screen.type === 'IMAX Laser' ? 18 : screen.type === 'Dolby Cinema' ? 17 : 14,
            tierPricing: {
              Standard: screen.type === 'IMAX Laser' ? 18 : 14,
              Premium: screen.type === 'IMAX Laser' ? 22 : 18,
              VIP: screen.type === 'IMAX Laser' ? 28 : 24,
            },
            bookedSeats: preBooked,
          });
        }
      }
    }
  }

  return showtimes;
}

export function getInitialUsers() {
  const salt = bcrypt.genSaltSync(10);
  return [
    {
      _id: 'usr_customer_1',
      name: 'Alex Rivera',
      email: 'demo@imovies.com',
      passwordHash: bcrypt.hashSync('password123', salt),
      role: 'customer' as const,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'usr_admin_1',
      name: 'Sarah Chen (Admin)',
      email: 'admin@imovies.com',
      passwordHash: bcrypt.hashSync('admin123', salt),
      role: 'admin' as const,
      createdAt: new Date().toISOString(),
    },
  ];
}
