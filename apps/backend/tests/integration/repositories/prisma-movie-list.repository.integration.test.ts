import { Uuid } from "@/domain/value-objects";
import { PrismaMovieListRepository } from "@/infrastructure/database/repositories";
import { makeMovieList } from "../../factories";
import { insertLanguage, insertMovie, insertUser } from "../helpers/fixtures";
import { getIntegrationPrismaClient } from "../helpers/integration-context";

describe("PrismaMovieListRepository integration", () => {
  const prisma = getIntegrationPrismaClient();
  const repository = new PrismaMovieListRepository(prisma);

  it("creates, lists, updates and deletes movie lists by owner", async () => {
    const owner = await insertUser(prisma);
    const ownerId = Uuid.create(owner.id);
    const list = makeMovieList({ userId: ownerId, name: "Watchlist" });

    const created = await repository.create(list);
    const all = await repository.findAllByUserId(ownerId);
    const updated = await repository.updateByIdAndUserId(
      list.id,
      ownerId,
      "Updated Watchlist"
    );
    const deleted = await repository.deleteByIdAndUserId(list.id, ownerId);

    expect(created.id.toString()).toBe(list.id.toString());
    expect(all).toHaveLength(1);
    expect(updated?.name).toBe("Updated Watchlist");
    expect(deleted).toBe(true);
  });

  it("adds and removes a movie from a list", async () => {
    const owner = await insertUser(prisma);
    const language = await insertLanguage(prisma, {
      code: "en",
      name: "English"
    });
    const movie = await insertMovie(prisma, {
      languageId: language.id,
      userId: owner.id
    });

    const ownerId = Uuid.create(owner.id);
    const movieId = Uuid.create(movie.id);
    const list = await repository.create(makeMovieList({ userId: ownerId }));

    const addResult = await repository.addMovie(list.id, ownerId, movieId);
    const withMovies = await repository.findByIdAndUserIdWithMovies(
      list.id,
      ownerId
    );
    const removed = await repository.removeMovieByListIdAndMovieId(
      list.id,
      ownerId,
      movieId
    );
    const afterRemove = await repository.findByIdAndUserIdWithMovies(
      list.id,
      ownerId
    );

    expect(addResult).toBe("ok");
    expect(withMovies?.movies).toHaveLength(1);
    expect(removed).toBe(true);
    expect(afterRemove?.movies).toHaveLength(0);
  });

  it("returns domain-specific not found results for add/remove operations", async () => {
    const owner = await insertUser(prisma);
    const ownerId = Uuid.create(owner.id);
    const randomListId = Uuid.generate();
    const randomMovieId = Uuid.generate();
    const list = await repository.create(makeMovieList({ userId: ownerId }));

    const missingList = await repository.addMovie(
      randomListId,
      ownerId,
      randomMovieId
    );
    const missingMovie = await repository.addMovie(
      list.id,
      ownerId,
      randomMovieId
    );
    const removeMissingList = await repository.removeMovieByListIdAndMovieId(
      randomListId,
      ownerId,
      randomMovieId
    );

    expect(missingList).toBe("list_not_found");
    expect(missingMovie).toBe("movie_not_found");
    expect(removeMissingList).toBe(false);
  });
});
