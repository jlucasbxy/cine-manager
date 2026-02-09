import type { GenreRepository } from "@/application/interfaces/repositories";
import type { GenreDTO } from "@repo/dtos";
import type { PrismaDatabase } from "@/infra/database/prisma";

export class PrismaGenreRepository implements GenreRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async findAll(): Promise<GenreDTO[]> {
    return this.db.genre.findMany();
  }
}
