export interface MovieDTO {
  id: string;
  title: string;
  originalTitle: string;
  tagline: string;
  synopsis: string;
  releaseDate: string;
  runtime: number;
  status: string;
  ageRating: string;
  languageId: string;
  budget: number;
  revenue: number;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  votes: number;
  score: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}
