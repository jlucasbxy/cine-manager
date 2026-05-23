import type {
  GenreRepository,
  LanguageRepository,
  MovieListRepository,
  MovieRepository,
  PasswordResetTokenRepository,
  RatingRepository,
  RefreshTokenRepository,
  UserRepository
} from "@/application/interfaces/repositories";
import type { QueueProvider } from "./queue-provider";

export interface TransactionRepositories {
  movieListRepository: MovieListRepository;
  movieRepository: MovieRepository;
  userRepository: UserRepository;
  refreshTokenRepository: RefreshTokenRepository;
  passwordResetTokenRepository: PasswordResetTokenRepository;
  queue: QueueProvider;
  languageRepository: LanguageRepository;
  genreRepository: GenreRepository;
  ratingRepository: RatingRepository;
}

export interface TransactionManager {
  execute<T>(fn: (repos: TransactionRepositories) => Promise<T>): Promise<T>;
}
