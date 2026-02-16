import { makePrismaClient } from "@/main/factories/prisma";
import { uuidv7 } from "uuidv7";
import argon2 from "argon2";

const DEV_USERS = [
  { name: "Alice Silva", email: "alice@example.com", password: "password123" },
  { name: "Bob Santos", email: "bob@example.com", password: "password123" },
];

const DEV_MOVIES = [
  {
    title: "The Matrix",
    originalTitle: "The Matrix",
    tagline: "Welcome to the Real World",
    synopsis:
      "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    releaseDate: new Date("1999-03-31"),
    runtime: 136,
    status: "RELEASED" as const,
    ageRating: "FOURTEEN" as const,
    budget: 63000000,
    revenue: 463517383,
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    votes: 24531,
    score: 8.7,
    languageCode: "en",
    genres: ["Action", "Science Fiction"],
  },
  {
    title: "Cidade de Deus",
    originalTitle: "City of God",
    tagline: "If you run, the beast catches you. If you stay, the beast eats you.",
    synopsis:
      "In the slums of Rio, two kids paths diverge as one struggles to become a photographer and the other a crime lord.",
    releaseDate: new Date("2002-08-30"),
    runtime: 130,
    status: "RELEASED" as const,
    ageRating: "EIGHTEEN" as const,
    budget: 3300000,
    revenue: 30680000,
    posterUrl: "https://image.tmdb.org/t/p/w500/gfnXixcGC060QcG6JPxN6AMdVsq.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/uvitbjFU4JqvMwIkMWHp69bmUzG.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=dcUOO4Itgmw",
    votes: 11456,
    score: 8.6,
    languageCode: "pt",
    genres: ["Drama", "Crime"],
  },
  {
    title: "A Viagem de Chihiro",
    originalTitle: "千と千尋の神隠し",
    tagline: "Everyone has a destiny.",
    synopsis:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
    releaseDate: new Date("2001-07-20"),
    runtime: 125,
    status: "RELEASED" as const,
    ageRating: "L" as const,
    budget: 19000000,
    revenue: 395802070,
    posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/ukfI9QkU1aIhOhKXYWE9n3z1mFR.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=ByXuk9QqQkk",
    votes: 15234,
    score: 8.6,
    languageCode: "ja",
    genres: ["Animation", "Family", "Fantasy"],
  },
  {
    title: "Parasita",
    originalTitle: "기생충",
    tagline: "Act like you own the place.",
    synopsis:
      "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    releaseDate: new Date("2019-05-30"),
    runtime: 132,
    status: "RELEASED" as const,
    ageRating: "SIXTEEN" as const,
    budget: 11400000,
    revenue: 266900000,
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    votes: 16890,
    score: 8.5,
    languageCode: "ko",
    genres: ["Comedy", "Thriller", "Drama"],
  },
  {
    title: "Interestelar",
    originalTitle: "Interstellar",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    synopsis:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseDate: new Date("2014-11-07"),
    runtime: 169,
    status: "RELEASED" as const,
    ageRating: "TEN" as const,
    budget: 165000000,
    revenue: 701729206,
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/2ssWTSVklAEc98frZUQhgtGHx7s.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    votes: 33210,
    score: 8.7,
    languageCode: "en",
    genres: ["Adventure", "Drama", "Science Fiction"],
  },
];

export async function seedDev() {
  const prisma = makePrismaClient();
  const now = new Date();

  // Seed users
  const userIds: string[] = [];
  for (const { name, email, password } of DEV_USERS) {
    const id = uuidv7();
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id,
        name,
        email,
        password: await argon2.hash(password, { type: argon2.argon2id }),
        createdAt: now,
        updatedAt: now,
      },
    });
    const user = await prisma.user.findUnique({ where: { email } });
    userIds.push(user!.id);
  }

  console.log(`Seeded ${DEV_USERS.length} dev users`);

  // Seed movies
  let movieCount = 0;
  for (const movie of DEV_MOVIES) {
    const { languageCode, genres: genreNames, ...movieData } = movie;

    const language = await prisma.language.findUnique({ where: { code: languageCode } });
    if (!language) {
      console.warn(`Language "${languageCode}" not found, skipping movie "${movie.title}"`);
      continue;
    }

    const genres = await prisma.genre.findMany({
      where: { name: { in: genreNames } },
    });

    const userId = userIds[movieCount % userIds.length];

    await prisma.movie.create({
      data: {
        id: uuidv7(),
        ...movieData,
        languageId: language.id,
        userId,
        createdAt: now,
        updatedAt: now,
        genres: { connect: genres.map((g) => ({ id: g.id })) },
      },
    });

    movieCount++;
  }

  console.log(`Seeded ${movieCount} dev movies`);

  await prisma.$disconnect();
}
