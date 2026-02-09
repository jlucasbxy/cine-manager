import type { LanguageRepository } from "@/application/interfaces/repositories";
import type { LanguageDTO } from "@repo/dtos";
import type { PrismaDatabase } from "@/infra/database/prisma";

export class PrismaLanguageRepository implements LanguageRepository {
  private readonly db: PrismaDatabase;

  constructor(client: PrismaDatabase) {
    this.db = client;
  }

  async findAll(): Promise<LanguageDTO[]> {
    return this.db.language.findMany();
  }
}
