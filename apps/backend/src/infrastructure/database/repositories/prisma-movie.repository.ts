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
import type { MovieModel } from "@/infrastructure/database/prisma/generated/prisma/models/Movie";

export class PrismaMovieRepository implements MovieRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async findByIdForUpdate(id: Uuid): Promise<Movie | null> {
    const results = await this.db.$queryRaw<MovieModel[]>`
      SELECT id, title, "originalTitle", tagline, synopsis, "releaseDate",
             runtime, status, "ageRating", "languageId", budget, revenue,
             "posterUrl", "backdropUrl", "trailerUrl", votes, score,
             "isPublic", "userId", "createdAt", "updatedAt", "deletedAt"
      FROM "Movie"
      WHERE id = ${id.toString()}::uuid
        AND "deletedAt" IS NULL
      FOR UPDATE
    `;
    if (!results[0]) return null;
    return PrismaMovieMapper.toDomain(results[0]);
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
        updatedAt: movie.updatedAt,
        deletedAt: movie.deletedAt
      }
    });
    return PrismaMovieMapper.toDomain(raw);
  }

  async findPublicOrOwnedByIdWithCreator(
    id: Uuid,
    userId: Uuid
  ): Promise<MovieWithUser | null> {
    const raw = await this.db.movie.findFirst({
      where: {
        id: id.toString(),
        deletedAt: null,
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
    const where: Record<string, unknown> = { deletedAt: null };

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
      const matchingIds = await this.db.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM "Movie"
        WHERE (
          ${query.search} <% title
          OR title ILIKE ${"%" + query.search + "%"}
        )
          AND "deletedAt" IS NULL
      `;
      if (matchingIds.length === 0) {
        return PaginatedResult.create([], null, false);
      }
      where.id = { in: matchingIds.map((r) => r.id) };
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

    const limit = query.limit.toNumber();
    const findManyArgs: Parameters<typeof this.db.movie.findMany>[0] = {
      where,
      orderBy: { id: "desc" },
      take: limit + 1,
      ...(query.cursor
        ? { cursor: { id: query.cursor.toString() }, skip: 1 }
        : {})
    };

    try {
      const rawList = await this.db.movie.findMany(findManyArgs);
      const hasNextPage = rawList.length > limit;
      const pageItems = hasNextPage ? rawList.slice(0, limit) : rawList;
      const nextCursor = hasNextPage ? (pageItems.at(-1)?.id ?? null) : null;
      return PaginatedResult.create(
        pageItems.map(PrismaMovieMapper.toDomain),
        nextCursor,
        hasNextPage
      );
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return PaginatedResult.create([], null, false);
      }
      throw error;
    }
  }

  async update(id: Uuid, data: UpdateMovieData): Promise<Movie | null> {
    return this.updateWithWhere({ id: id.toString(), deletedAt: null }, data);
  }

  async updateByIdAndUserId(
    id: Uuid,
    userId: Uuid,
    data: UpdateMovieData
  ): Promise<Movie | null> {
    return this.updateWithWhere(
      { id: id.toString(), userId: userId.toString(), deletedAt: null },
      data
    );
  }

  private async updateWithWhere(
    where: { id: string; userId?: string; deletedAt?: null },
    data: UpdateMovieData
  ): Promise<Movie | null> {
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

    const { count } = await this.db.movie.updateMany({
      where,
      data: prismaData
    });
    if (count === 0) {
      return null;
    }
    const raw = await this.db.movie.findUnique({ where: { id: where.id } });
    if (!raw) return null;
    return PrismaMovieMapper.toDomain(raw);
  }

  async deleteByIdAndUserId(id: Uuid, userId: Uuid): Promise<boolean> {
    const { count } = await this.db.movie.updateMany({
      where: { id: id.toString(), userId: userId.toString(), deletedAt: null },
      data: { deletedAt: new Date(), updatedAt: new Date() }
    });
    return count > 0;
  }

  async hardDeleteIfSoftDeletedAndOrphan(id: Uuid): Promise<boolean> {
    const { count } = await this.db.movie.deleteMany({
      where: {
        id: id.toString(),
        deletedAt: { not: null },
        lists: { none: {} }
      }
    });
    return count > 0;
  }
}
