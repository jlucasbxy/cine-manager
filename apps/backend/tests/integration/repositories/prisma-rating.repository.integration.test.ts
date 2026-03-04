import { Rating } from "@/domain/entities";
import { RatingValue, Uuid } from "@/domain/value-objects";
import { PrismaRatingRepository } from "@/infrastructure/database/repositories";
import { insertLanguage, insertMovie, insertUser } from "../helpers/fixtures";
import { getIntegrationPrismaClient } from "../helpers/integration-context";

describe("PrismaRatingRepository integration", () => {
  const prisma = getIntegrationPrismaClient();
  const repository = new PrismaRatingRepository(prisma);

  it("upserts ratings and aggregates average/count", async () => {
    const userA = await insertUser(prisma);
    const userB = await insertUser(prisma);
    const language = await insertLanguage(prisma, {
      code: "en",
      name: "English"
    });
    const movie = await insertMovie(prisma, {
      languageId: language.id,
      userId: userA.id
    });

    const ratingA = Rating.create({
      userId: Uuid.create(userA.id),
      movieId: Uuid.create(movie.id),
      value: RatingValue.create(8)
    });
    const ratingB = Rating.create({
      userId: Uuid.create(userB.id),
      movieId: Uuid.create(movie.id),
      value: RatingValue.create(6)
    });

    await repository.upsert(ratingA);
    await repository.upsert(ratingB);

    const updatedA = Rating.create({
      userId: Uuid.create(userA.id),
      movieId: Uuid.create(movie.id),
      value: RatingValue.create(10)
    });
    const upserted = await repository.upsert(updatedA);
    const aggregate = await repository.getAverageAndCount(
      Uuid.create(movie.id)
    );

    expect(upserted?.value.toNumber()).toBe(10);
    expect(aggregate.count).toBe(2);
    expect(aggregate.average).toBe(8);
  });

  it("returns null when movie does not exist", async () => {
    const user = await insertUser(prisma);
    const rating = Rating.create({
      userId: Uuid.create(user.id),
      movieId: Uuid.generate(),
      value: RatingValue.create(7)
    });

    const result = await repository.upsert(rating);
    expect(result).toBeNull();
  });
});
