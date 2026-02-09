import type { LanguageRepository } from "@/application/interfaces/repositories";
import type { LanguageDTO } from "@repo/dtos";
import { prisma } from "@/infra/database/prisma";

export class PrismaLanguageRepository implements LanguageRepository {
  async findAll(): Promise<LanguageDTO[]> {
    return prisma.language.findMany();
  }
}
