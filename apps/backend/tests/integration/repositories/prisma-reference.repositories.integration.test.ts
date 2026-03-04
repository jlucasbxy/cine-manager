import {
  PrismaGenreRepository,
  PrismaLanguageRepository
} from "@/infrastructure/database/repositories";
import { insertGenre, insertLanguage } from "../helpers/fixtures";
import { getIntegrationPrismaClient } from "../helpers/integration-context";

describe("PrismaLanguageRepository integration", () => {
  const prisma = getIntegrationPrismaClient();
  const repository = new PrismaLanguageRepository(prisma);

  it("returns persisted languages", async () => {
    const inserted = await insertLanguage(prisma, {
      code: "en",
      name: "English"
    });

    const all = await repository.findAll();

    expect(all).toEqual([inserted]);
  });
});

describe("PrismaGenreRepository integration", () => {
  const prisma = getIntegrationPrismaClient();
  const repository = new PrismaGenreRepository(prisma);

  it("returns persisted genres", async () => {
    const inserted = await insertGenre(prisma, {
      name: "Action"
    });

    const all = await repository.findAll();

    expect(all).toEqual([inserted]);
  });
});
