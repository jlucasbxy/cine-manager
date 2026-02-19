import type { GenreDTO } from "@repo/dtos";
import type { GenreRepository } from "@/application/interfaces/repositories";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";

export class PrismaGenreRepository implements GenreRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async findAll(): Promise<GenreDTO[]> {
    return this.db.genre.findMany();
  }
}
