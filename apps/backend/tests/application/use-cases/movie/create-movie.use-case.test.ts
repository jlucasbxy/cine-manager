import { CreateMovie } from "@/application/use-cases/movie/create-movie.use-case";
import { User } from "@/domain/entities/user.entity";
import { Email, Password, Uuid } from "@/domain/value-objects";
import { Movie } from "@/domain/entities/movie.entity";
import {
  AgeRating,
  MovieStatus,
  NonNegativeInt,
  NonNegativeNumber,
  Url
} from "@/domain/value-objects";
import { AgeRatingEnum } from "@/domain/enums/age-rating.enum";
import { MovieStatusEnum } from "@/domain/enums/movie-status.enum";

describe("CreateMovie", () => {
  const mockRepos = {
    movieRepository: { create: vi.fn() },
    userRepository: { findById: vi.fn() },
    outboxEventRepository: { create: vi.fn() }
  };
  const transactionManager = {
    execute: vi.fn((fn: any) => fn(mockRepos))
  };
  const useCase = new CreateMovie(transactionManager as any);
  const userId = Uuid.generate();

  const input = {
    title: "Test Movie",
    originalTitle: "Test Movie",
    tagline: "Tagline",
    synopsis: "Synopsis",
    releaseDate: new Date("2020-06-01"),
    runtime: 120,
    status: MovieStatusEnum.RELEASED,
    ageRating: AgeRatingEnum.L,
    languageId: Uuid.generate().toString(),
    budget: 1000000,
    revenue: 5000000,
    posterUrl: "https://example.com/poster.jpg",
    backdropUrl: "https://example.com/backdrop.jpg",
    trailerUrl: "https://example.com/trailer.mp4"
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a movie and returns DTO", async () => {
    const movie = Movie.reconstitute({
      id: Uuid.generate(),
      ...input,
      releaseDate: new Date("2020-06-01"),
      runtime: NonNegativeInt.create(120),
      status: MovieStatus.create(MovieStatusEnum.RELEASED),
      ageRating: AgeRating.create(AgeRatingEnum.L),
      languageId: Uuid.reconstitute(input.languageId),
      budget: NonNegativeNumber.create(1000000),
      revenue: NonNegativeNumber.create(5000000),
      posterUrl: Url.create("https://example.com/poster.jpg"),
      backdropUrl: Url.create("https://example.com/backdrop.jpg"),
      trailerUrl: Url.create("https://example.com/trailer.mp4"),
      votes: NonNegativeInt.create(0),
      score: NonNegativeNumber.create(0),
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId
    });
    mockRepos.movieRepository.create.mockResolvedValue(movie);

    const result = await useCase.execute(userId.toString(), input);

    expect(result.title).toBe("Test Movie");
    expect(mockRepos.movieRepository.create).toHaveBeenCalled();
  });

  it("creates outbox event when release date is in the future", async () => {
    const futureInput = { ...input, releaseDate: new Date("4000-01-01") };
    const movie = Movie.reconstitute({
      id: Uuid.generate(),
      ...futureInput,
      runtime: NonNegativeInt.create(120),
      status: MovieStatus.create(MovieStatusEnum.RELEASED),
      ageRating: AgeRating.create(AgeRatingEnum.L),
      languageId: Uuid.reconstitute(input.languageId),
      budget: NonNegativeNumber.create(1000000),
      revenue: NonNegativeNumber.create(5000000),
      posterUrl: Url.create("https://example.com/poster.jpg"),
      backdropUrl: Url.create("https://example.com/backdrop.jpg"),
      trailerUrl: Url.create("https://example.com/trailer.mp4"),
      votes: NonNegativeInt.create(0),
      score: NonNegativeNumber.create(0),
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId
    });
    mockRepos.movieRepository.create.mockResolvedValue(movie);

    const user = User.reconstitute({
      id: userId,
      name: "John",
      email: Email.reconstitute("john@example.com"),
      password: Password.reconstitute("hashed"),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    mockRepos.userRepository.findById.mockResolvedValue(user);
    mockRepos.outboxEventRepository.create.mockResolvedValue(undefined);

    await useCase.execute(userId.toString(), futureInput);

    expect(mockRepos.outboxEventRepository.create).toHaveBeenCalled();
  });
});
