import { AgeRating } from "@/domain/enums/age-rating.enum";
import { MovieStatus } from "@/domain/enums/movie-status.enum";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

export class Movie {
  id: Uuid;
  title: string;
  originalTitle: string;
  tagline: string;
  synopsis: string;
  releaseDate: Date;
  runtime: number;
  status: MovieStatus;
  ageRating: AgeRating;
  languageId: Uuid;
  budget: number;
  revenue: number;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  votes: number;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  userId: Uuid;

  constructor(data: {
    id: Uuid;
    title: string;
    originalTitle: string;
    tagline: string;
    synopsis: string;
    releaseDate: Date;
    runtime: number;
    status: MovieStatus;
    ageRating: AgeRating;
    languageId: Uuid;
    budget: number;
    revenue: number;
    posterUrl: string;
    backdropUrl: string;
    trailerUrl: string;
    votes?: number;
    score?: number;
    createdAt: Date;
    updatedAt: Date;
    userId: Uuid;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.originalTitle = data.originalTitle;
    this.tagline = data.tagline;
    this.synopsis = data.synopsis;
    this.releaseDate = data.releaseDate;
    this.runtime = data.runtime;
    this.status = data.status;
    this.ageRating = data.ageRating;
    this.languageId = data.languageId;
    this.budget = data.budget;
    this.revenue = data.revenue;
    this.posterUrl = data.posterUrl;
    this.backdropUrl = data.backdropUrl;
    this.trailerUrl = data.trailerUrl;
    this.votes = data.votes ?? 0;
    this.score = data.score ?? 0;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.userId = data.userId;
  }
}
