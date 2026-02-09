import type {
  MovieRepository,
  UpdateMovieData
} from "@/application/interfaces/repositories";
import { Movie } from "@/domain/entities";
import { Uuid, MovieQuery } from "@/domain/value-objects";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";
import { PrismaMovieMapper } from "@/infrastructure/database/mappers";

export class PrismaMovieRepository implements MovieRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async create(movie: Movie): Promise<Movie> {
    const raw = await this.db.movie.create({
      data: {
        id: movie.id.toString(),
        title: movie.title,
        originalTitle: movie.originalTitle,
        tagline: movie.tagline,
        synopsis: movie.synopsis,
        releaseDate: movie.releaseDate,
        runtime: movie.runtime.toNumber(),
        status: movie.status.getValue(),
        ageRating: movie.ageRating.getValue(),
        languageId: movie.languageId.toString(),
        budget: movie.budget.toNumber(),
        revenue: movie.revenue.toNumber(),
        posterUrl: movie.posterUrl.toString(),
        backdropUrl: movie.backdropUrl.toString(),
        trailerUrl: movie.trailerUrl.toString(),
        votes: movie.votes.toNumber(),
        score: movie.score.toNumber(),
        userId: movie.userId.toString(),
        createdAt: movie.createdAt,
        updatedAt: movie.updatedAt
      }
    });
    return PrismaMovieMapper.toDomain(raw);
  }

  async findById(id: Uuid): Promise<Movie | null> {
    const raw = await this.db.movie.findUnique({
      where: { id: id.toString() }
    });
    if (!raw) return null;
    return PrismaMovieMapper.toDomain(raw);
  }

  async findAll(query: MovieQuery): Promise<Movie[]> {
    const rawList = await this.db.movie.findMany({
      where: {
        runtime: { lte: query.runtime.toNumber() },
        releaseDate: {
          gte: query.releaseDateStart,
          lte: query.releaseDateEnd
        }
      }
    });
    return rawList.map(PrismaMovieMapper.toDomain);
  }

  async update(id: Uuid, data: UpdateMovieData): Promise<Movie> {
    const prismaData: Record<string, unknown> = {};
    if (data.title !== undefined) prismaData.title = data.title;
    if (data.originalTitle !== undefined)
      prismaData.originalTitle = data.originalTitle;
    if (data.tagline !== undefined) prismaData.tagline = data.tagline;
    if (data.synopsis !== undefined) prismaData.synopsis = data.synopsis;
    if (data.releaseDate !== undefined)
      prismaData.releaseDate = data.releaseDate;
    if (data.runtime !== undefined)
      prismaData.runtime = data.runtime.toNumber();
    if (data.status !== undefined) prismaData.status = data.status.getValue();
    if (data.ageRating !== undefined)
      prismaData.ageRating = data.ageRating.getValue();
    if (data.languageId !== undefined)
      prismaData.languageId = data.languageId.toString();
    if (data.budget !== undefined) prismaData.budget = data.budget.toNumber();
    if (data.revenue !== undefined)
      prismaData.revenue = data.revenue.toNumber();
    if (data.posterUrl !== undefined)
      prismaData.posterUrl = data.posterUrl.toString();
    if (data.backdropUrl !== undefined)
      prismaData.backdropUrl = data.backdropUrl.toString();
    if (data.trailerUrl !== undefined)
      prismaData.trailerUrl = data.trailerUrl.toString();
    if (data.votes !== undefined) prismaData.votes = data.votes.toNumber();
    if (data.score !== undefined) prismaData.score = data.score.toNumber();
    if (data.userId !== undefined) prismaData.userId = data.userId.toString();
    if (data.updatedAt !== undefined) prismaData.updatedAt = data.updatedAt;

    const raw = await this.db.movie.update({
      where: { id: id.toString() },
      data: prismaData
    });
    return PrismaMovieMapper.toDomain(raw);
  }

  async delete(id: Uuid): Promise<void> {
    await this.db.movie.delete({
      where: { id: id.toString() }
    });
  }
}
