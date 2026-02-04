import { CreateMovieData, MovieFilters, MovieRepository, UpdateMovieData } from "@/application/interfaces/repositories/movie-repository";
import { Movie } from "@/domain/entities";
import { Uuid } from "@/domain/value-objects/uuid.value-object";
import { prisma } from "@/infra/database/prisma";
import { PrismaMovieMapper } from "@/infra/database/mappers/prisma-movie-mapper";

export class PrismaMovieRepository implements MovieRepository {
  async create(data: CreateMovieData): Promise<Movie> {
    const raw = await prisma.movie.create({
      data: {
        title: data.title,
        originalTitle: data.originalTitle,
        tagline: data.tagline,
        synopsis: data.synopsis,
        releaseDate: data.releaseDate,
        runtime: data.runtime.toNumber(),
        status: data.status,
        ageRating: data.ageRating,
        languageId: data.languageId.toString(),
        budget: data.budget.toNumber(),
        revenue: data.revenue.toNumber(),
        posterUrl: data.posterUrl.toString(),
        backdropUrl: data.backdropUrl.toString(),
        trailerUrl: data.trailerUrl.toString(),
        userId: data.userId.toString()
      }
    });
    return PrismaMovieMapper.toDomain(raw);
  }

  async findById(id: Uuid): Promise<Movie | null> {
    const raw = await prisma.movie.findUnique({
      where: { id: id.toString() }
    });
    if (!raw) return null;
    return PrismaMovieMapper.toDomain(raw);
  }

  async findAll(filters: MovieFilters): Promise<Movie[]> {
    const rawList = await prisma.movie.findMany({
      where: {
        runtime: { lte: filters.runtime },
        releaseDate: {
          gte: filters.releaseDateStart,
          lte: filters.releaseDateEnd
        }
      }
    });
    return rawList.map(PrismaMovieMapper.toDomain);
  }

  async update(id: Uuid, data: UpdateMovieData): Promise<Movie> {
    const prismaData: Record<string, unknown> = {};
    if (data.title !== undefined) prismaData.title = data.title;
    if (data.originalTitle !== undefined) prismaData.originalTitle = data.originalTitle;
    if (data.tagline !== undefined) prismaData.tagline = data.tagline;
    if (data.synopsis !== undefined) prismaData.synopsis = data.synopsis;
    if (data.releaseDate !== undefined) prismaData.releaseDate = data.releaseDate;
    if (data.runtime !== undefined) prismaData.runtime = data.runtime.toNumber();
    if (data.status !== undefined) prismaData.status = data.status;
    if (data.ageRating !== undefined) prismaData.ageRating = data.ageRating;
    if (data.languageId !== undefined) prismaData.languageId = data.languageId.toString();
    if (data.budget !== undefined) prismaData.budget = data.budget.toNumber();
    if (data.revenue !== undefined) prismaData.revenue = data.revenue.toNumber();
    if (data.posterUrl !== undefined) prismaData.posterUrl = data.posterUrl.toString();
    if (data.backdropUrl !== undefined) prismaData.backdropUrl = data.backdropUrl.toString();
    if (data.trailerUrl !== undefined) prismaData.trailerUrl = data.trailerUrl.toString();
    if (data.votes !== undefined) prismaData.votes = data.votes.toNumber();
    if (data.score !== undefined) prismaData.score = data.score.toNumber();
    if (data.userId !== undefined) prismaData.userId = data.userId.toString();

    const raw = await prisma.movie.update({
      where: { id: id.toString() },
      data: prismaData
    });
    return PrismaMovieMapper.toDomain(raw);
  }

  async delete(id: Uuid): Promise<void> {
    await prisma.movie.delete({
      where: { id: id.toString() }
    });
  }
}
