import { makePrismaClient } from "@/main/factories/prisma";
import { uuidv7 } from "uuidv7";

const TMDB_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "War",
  "Western"
];

export async function seedGenres() {
  const prisma = makePrismaClient();

  const result = await prisma.genre.createMany({
    skipDuplicates: true,
    data: TMDB_GENRES.map((name) => ({ id: uuidv7(), name }))
  });

  console.log(`Seeded ${result.count} genres`);

  await prisma.$disconnect();
}
