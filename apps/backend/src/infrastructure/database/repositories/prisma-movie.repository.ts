import type {
  MovieRepository,
  UpdateMovieData
} from "@/application/interfaces/repositories";
import type { MovieWithUser } from "@/application/read-models";
import type { Movie } from "@/domain/entities";
import type { MovieQuery, Uuid } from "@/domain/value-objects";
import { PaginatedResult } from "@/domain/value-objects";
import { PrismaMovieMapper } from "@/infrastructure/database/mappers";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";

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
        isPublic: movie.isPublic,
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

  async exists(id: Uuid): Promise<boolean> {
    const count = await this.db.movie.count({ where: { id: id.toString() } });
    return count > 0;
  }

  async findPublicOrOwnedByIdWithCreator(
    id: Uuid,
    userId: Uuid
  ): Promise<MovieWithUser | null> {
    const raw = await this.db.movie.findFirst({
      where: {
        id: id.toString(),
        OR: [{ isPublic: true }, { userId: userId.toString() }]
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    });
    if (!raw) return null;
    return {
      movie: PrismaMovieMapper.toDomain(raw),
      user: raw.user
    };
  }

  async findAll(query: MovieQuery): Promise<PaginatedResult<Movie>> {
    const where: Record<string, unknown> = {};

    if (query.runtime !== undefined) {
      where.runtime = { lte: query.runtime.toNumber() };
    }
    if (query.releaseDateStart || query.releaseDateEnd) {
      const releaseDate: Record<string, Date> = {};
      if (query.releaseDateStart) releaseDate.gte = query.releaseDateStart;
      if (query.releaseDateEnd) releaseDate.lte = query.releaseDateEnd;
      where.releaseDate = releaseDate;
    }
    if (query.status !== undefined) {
      where.status = query.status;
    }
    if (query.ageRating !== undefined) {
      where.ageRating = query.ageRating;
    }
    if (query.search !== undefined) {
      where.title = { contains: query.search, mode: "insensitive" };
    }
    if (query.userId !== undefined) {
      where.userId = query.userId.toString();
    }
    if (query.genreIds !== undefined && query.genreIds.length > 0) {
      where.genres = { some: { id: { in: query.genreIds } } };
    }
    where.AND = [
      { OR: [{ isPublic: true }, { userId: query.currentUserId.toString() }] }
    ];

    const [rawList, total] = await Promise.all([
      this.db.movie.findMany({
        where,
        skip: (query.page.toNumber() - 1) * query.perPage.toNumber(),
        take: query.perPage.toNumber()
      }),
      this.db.movie.count({ where })
    ]);

    return PaginatedResult.create(
      rawList.map(PrismaMovieMapper.toDomain),
      total
    );
  }

  async update(id: Uuid, data: UpdateMovieData): Promise<Movie | null> {
    const prismaData: Record<string, unknown> = {
      updatedAt: new Date()
    };
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
    if (data.isPublic !== undefined) prismaData.isPublic = data.isPublic;

    try {
      const raw = await this.db.movie.update({
        where: { id: id.toString() },
        data: prismaData
      });
      return PrismaMovieMapper.toDomain(raw);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  }

  async delete(id: Uuid): Promise<boolean> {
    try {
      await this.db.movie.delete({
        where: { id: id.toString() }
      });
      return true;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return false;
      }
      throw error;
    }
  }
}
