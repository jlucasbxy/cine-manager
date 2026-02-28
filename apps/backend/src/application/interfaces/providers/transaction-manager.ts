import type {
  GenreRepository,
  LanguageRepository,
  MovieListRepository,
  MovieRepository,
  OutboxEventRepository,
  PasswordResetTokenRepository,
  RatingRepository,
  RefreshTokenRepository,
  UserRepository
} from "@/application/interfaces/repositories";

export interface TransactionRepositories {
  movieListRepository: MovieListRepository;
  movieRepository: MovieRepository;
  userRepository: UserRepository;
  refreshTokenRepository: RefreshTokenRepository;
  passwordResetTokenRepository: PasswordResetTokenRepository;
  outboxEventRepository: OutboxEventRepository;
  languageRepository: LanguageRepository;
  genreRepository: GenreRepository;
  ratingRepository: RatingRepository;
}

export interface TransactionManager {
  execute<T>(fn: (repos: TransactionRepositories) => Promise<T>): Promise<T>;
}
