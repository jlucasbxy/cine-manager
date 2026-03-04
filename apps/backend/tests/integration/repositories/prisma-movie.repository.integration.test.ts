import { MovieQuery, Uuid } from "@/domain/value-objects";
import { PrismaMovieRepository } from "@/infrastructure/database/repositories";
import { makeMovie } from "../../factories";
import {
  insertGenre,
  insertLanguage,
  insertMovie,
  insertUser
} from "../helpers/fixtures";
import { getIntegrationPrismaClient } from "../helpers/integration-context";

describe("PrismaMovieRepository integration", () => {
  const prisma = getIntegrationPrismaClient();
  const repository = new PrismaMovieRepository(prisma);

  it("enforces visibility in findPublicOrOwnedByIdWithCreator", async () => {
    const owner = await insertUser(prisma);
    const viewer = await insertUser(prisma);
    const language = await insertLanguage(prisma, {
      code: "en",
      name: "English"
    });

    const movie = makeMovie({
      userId: Uuid.create(owner.id),
      languageId: Uuid.create(language.id),
      isPublic: false
    });
    await repository.create(movie);

    const ownerView = await repository.findPublicOrOwnedByIdWithCreator(
      movie.id,
      Uuid.create(owner.id)
    );
    const viewerView = await repository.findPublicOrOwnedByIdWithCreator(
      movie.id,
      Uuid.create(viewer.id)
    );

    expect(ownerView?.movie.id.toString()).toBe(movie.id.toString());
    expect(ownerView?.user?.id).toBe(owner.id);
    expect(viewerView).toBeNull();

    await repository.updateByIdAndUserId(movie.id, Uuid.create(owner.id), {
      isPublic: true
    });

    const viewerAfterPublic = await repository.findPublicOrOwnedByIdWithCreator(
      movie.id,
      Uuid.create(viewer.id)
    );
    expect(viewerAfterPublic).not.toBeNull();
  });

  it("filters and paginates in findAll", async () => {
    const owner = await insertUser(prisma);
    const otherUser = await insertUser(prisma);
    const language = await insertLanguage(prisma, {
      code: "en",
      name: "English"
    });
    const genre = await insertGenre(prisma, { name: "Action" });

    const visibleA = await insertMovie(prisma, {
      title: "Visible A",
      runtime: 90,
      languageId: language.id,
      userId: owner.id,
      genreIds: [genre.id]
    });
    await insertMovie(prisma, {
      title: "Visible B",
      runtime: 130,
      languageId: language.id,
      userId: owner.id
    });
    await insertMovie(prisma, {
      title: "Other Private",
      runtime: 80,
      isPublic: false,
      languageId: language.id,
      userId: otherUser.id
    });
    await insertMovie(prisma, {
      title: "Own Private",
      runtime: 70,
      isPublic: false,
      languageId: language.id,
      userId: owner.id
    });
    await insertMovie(prisma, {
      title: "Soft Deleted",
      runtime: 60,
      languageId: language.id,
      userId: owner.id,
      deletedAt: new Date()
    });

    const filtered = await repository.findAll(
      MovieQuery.create({
        runtime: 100,
        genreIds: [genre.id],
        limit: 10,
        currentUserId: owner.id
      })
    );

    expect(filtered.items.map((movie) => movie.id.toString())).toEqual([
      visibleA.id
    ]);

    const firstPage = await repository.findAll(
      MovieQuery.create({
        limit: 1,
        currentUserId: owner.id
      })
    );
    const secondPage = await repository.findAll(
      MovieQuery.create({
        limit: 1,
        cursor: firstPage.nextCursor ?? undefined,
        currentUserId: owner.id
      })
    );

    expect(firstPage.items).toHaveLength(1);
    expect(firstPage.hasNextPage).toBe(true);
    expect(firstPage.nextCursor).not.toBeNull();
    expect(secondPage.items).toHaveLength(1);
    expect(secondPage.items[0]?.id.toString()).not.toBe(
      firstPage.items[0]?.id.toString()
    );
  });

  it("updates by owner and handles soft/hard delete", async () => {
    const owner = await insertUser(prisma);
    const viewer = await insertUser(prisma);
    const language = await insertLanguage(prisma, {
      code: "en",
      name: "English"
    });
    const movie = makeMovie({
      userId: Uuid.create(owner.id),
      languageId: Uuid.create(language.id)
    });
    await repository.create(movie);

    const unauthorizedUpdate = await repository.updateByIdAndUserId(
      movie.id,
      Uuid.create(viewer.id),
      { title: "Should Not Update" }
    );
    const genericUpdate = await repository.update(movie.id, {
      tagline: "Updated Tagline"
    });
    const authorizedUpdate = await repository.updateByIdAndUserId(
      movie.id,
      Uuid.create(owner.id),
      { title: "Updated Title" }
    );

    expect(unauthorizedUpdate).toBeNull();
    expect(genericUpdate?.tagline).toBe("Updated Tagline");
    expect(authorizedUpdate?.title).toBe("Updated Title");

    const unauthorizedDelete = await repository.deleteByIdAndUserId(
      movie.id,
      Uuid.create(viewer.id)
    );
    const deleted = await repository.deleteByIdAndUserId(
      movie.id,
      Uuid.create(owner.id)
    );
    const afterSoftDelete = await repository.findByIdForUpdate(movie.id);
    const hardDeleted = await repository.hardDeleteIfSoftDeletedAndOrphan(
      movie.id
    );
    const raw = await prisma.movie.findUnique({
      where: { id: movie.id.toString() }
    });

    expect(unauthorizedDelete).toBe(false);
    expect(deleted).toBe(true);
    expect(afterSoftDelete).toBeNull();
    expect(hardDeleted).toBe(true);
    expect(raw).toBeNull();
  });
});
