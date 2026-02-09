import type { GenreRepository } from "@/application/interfaces/repositories";
import type { GenreDTO } from "@repo/dtos";
import { prisma } from "@/infra/database/prisma";

export class PrismaGenreRepository implements GenreRepository {
  async findAll(): Promise<GenreDTO[]> {
    return prisma.genre.findMany();
  }
}
