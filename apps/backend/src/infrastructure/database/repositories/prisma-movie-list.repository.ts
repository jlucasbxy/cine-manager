import type {
  MovieListRepository,
  MovieListWithMovies
} from "@/application/interfaces/repositories";
import type { MovieList } from "@/domain/entities";
import type { Uuid } from "@/domain/value-objects";
import {
  PrismaMovieListMapper,
  PrismaMovieMapper
} from "@/infrastructure/database/mappers";
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
      orderBy: { id: "desc" }
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

  async addMovie(
    listId: Uuid,
    userId: Uuid,
    movieId: Uuid
  ): Promise<"ok" | "list_not_found" | "movie_not_found"> {
    try {
      await this.db.movieList.update({
        where: { id: listId.toString(), userId: userId.toString() },
        data: {
          movies: { connect: { id: movieId.toString() } },
          updatedAt: new Date()
        }
      });
      return "ok";
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        const meta = (error as { meta?: { cause?: string } }).meta;
        const cause = meta?.cause ?? "";
        if (cause.toLowerCase().includes("record to update not found")) {
          return "list_not_found";
        }
        return "movie_not_found";
      }
      throw error;
    }
  }

  async removeMovieByListIdAndMovieId(
    listId: Uuid,
    userId: Uuid,
    movieId: Uuid
  ): Promise<boolean> {
    try {
      await this.db.movieList.update({
        where: { id: listId.toString(), userId: userId.toString() },
        data: {
          movies: { disconnect: { id: movieId.toString() } },
          updatedAt: new Date()
        }
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
