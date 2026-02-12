import type {
  MovieRepository,
  UserRepository,
  RefreshTokenRepository,
  PasswordResetTokenRepository,
  NotificationOutboxRepository,
  LanguageRepository,
  GenreRepository
} from "@/application/interfaces/repositories";

export interface TransactionRepositories {
  movieRepository: MovieRepository;
  userRepository: UserRepository;
  refreshTokenRepository: RefreshTokenRepository;
  passwordResetTokenRepository: PasswordResetTokenRepository;
  notificationOutboxRepository: NotificationOutboxRepository;
  languageRepository: LanguageRepository;
  genreRepository: GenreRepository;
}

export interface TransactionManager {
  execute<T>(fn: (repos: TransactionRepositories) => Promise<T>): Promise<T>;
}
