import type {
  MovieListRepository,
  MovieListWithMovies
} from "@/application/interfaces/repositories";
import type { MovieList } from "@/domain/entities";
import type { Uuid } from "@/domain/value-objects";
import { PrismaMovieListMapper } from "@/infrastructure/database/mappers";
import { PrismaMovieMapper } from "@/infrastructure/database/mappers";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";

export class PrismaMovieListRepository implements MovieListRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async create(list: MovieList): Promise<MovieList> {
    const raw = await this.db.movieList.create({
      data: {
        id: list.id.toString(),
        name: list.name,
        userId: list.userId.toString(),
        createdAt: list.createdAt,
        updatedAt: list.updatedAt
      }
    });
    return PrismaMovieListMapper.toDomain(raw);
  }

  async existsByIdAndUserIdForUpdate(id: Uuid, userId: Uuid): Promise<boolean> {
    const results = await this.db.$queryRaw<{ id: string }[]>`
      SELECT id FROM "MovieList" WHERE id = ${id.toString()}::uuid AND "userId" = ${userId.toString()}::uuid FOR UPDATE
    `;
    return results.length > 0;
  }

  async findByIdAndUserIdWithMovies(
    id: Uuid,
    userId: Uuid
  ): Promise<MovieListWithMovies | null> {
    const raw = await this.db.movieList.findUnique({
      where: { id: id.toString(), userId: userId.toString() },
      include: { movies: true }
    });
    if (!raw) return null;
    const list = PrismaMovieListMapper.toDomain(raw);
    return {
      ...list,
      movies: raw.movies.map(PrismaMovieMapper.toDomain)
    };
  }

  async findAllByUserId(userId: Uuid): Promise<MovieList[]> {
    const raws = await this.db.movieList.findMany({
      where: { userId: userId.toString() },
      orderBy: { createdAt: "desc" }
    });
    return raws.map(PrismaMovieListMapper.toDomain);
  }

  async updateByIdAndUserId(
    id: Uuid,
    userId: Uuid,
    name: string
  ): Promise<MovieList | null> {
    try {
      const raw = await this.db.movieList.update({
        where: { id: id.toString(), userId: userId.toString() },
        data: { name, updatedAt: new Date() }
      });
      return PrismaMovieListMapper.toDomain(raw);
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

  async deleteByIdAndUserId(id: Uuid, userId: Uuid): Promise<boolean> {
    const { count } = await this.db.movieList.deleteMany({
      where: { id: id.toString(), userId: userId.toString() }
    });
    return count > 0;
  }

  async addMovie(listId: Uuid, movieId: Uuid): Promise<void> {
    await this.db.movieList.update({
      where: { id: listId.toString() },
      data: {
        movies: { connect: { id: movieId.toString() } },
        updatedAt: new Date()
      }
    });
  }

  async removeMovieByListIdAndMovieId(
    listId: Uuid,
    movieId: Uuid
  ): Promise<void> {
    await this.db.movieList.update({
      where: { id: listId.toString() },
      data: {
        movies: { disconnect: { id: movieId.toString() } },
        updatedAt: new Date()
      }
    });
  }
}
