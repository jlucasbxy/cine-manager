export interface MovieDTO {
  id: string;
  title: string;
  originalTitle: string;
  tagline: string;
  synopsis: string;
  releaseDate: Date;
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
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
