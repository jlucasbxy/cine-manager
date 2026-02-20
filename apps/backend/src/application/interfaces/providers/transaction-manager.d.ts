import type {
  MovieRepository,
  UserRepository,
  RefreshTokenRepository,
  PasswordResetTokenRepository,
  OutboxEventRepository,
  LanguageRepository,
  GenreRepository
} from "@/application/interfaces/repositories";

export interface TransactionRepositories {
  movieRepository: MovieRepository;
  userRepository: UserRepository;
  refreshTokenRepository: RefreshTokenRepository;
  passwordResetTokenRepository: PasswordResetTokenRepository;
  outboxEventRepository: OutboxEventRepository;
  languageRepository: LanguageRepository;
  genreRepository: GenreRepository;
}

export interface TransactionManager {
  execute<T>(fn: (repos: TransactionRepositories) => Promise<T>): Promise<T>;
}
