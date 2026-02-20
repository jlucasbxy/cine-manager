import type { Movie } from "@/domain/entities";

export type MoviePublisher = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

export type MovieWithUser = {
  movie: Movie;
  user: MoviePublisher | null;
};
