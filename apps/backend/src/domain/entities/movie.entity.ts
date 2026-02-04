import { AgeRating } from "@/domain/enums/age-rating.enum";
import { MovieStatus } from "@/domain/enums/movie-status.enum";
import { Url } from "@/domain/value-objects/url.value-object";
import { Uuid } from "@/domain/value-objects/uuid.value-object";

interface CreateMovieProps {
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
  posterUrl: Url;
  backdropUrl: Url;
  trailerUrl: Url;
  userId: Uuid;
}

interface ReconstituteMovieProps extends CreateMovieProps {
  id: Uuid;
  votes: number;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Movie {
  readonly id: Uuid;
  readonly title: string;
  readonly originalTitle: string;
  readonly tagline: string;
  readonly synopsis: string;
  readonly releaseDate: Date;
  readonly runtime: number;
  readonly status: MovieStatus;
  readonly ageRating: AgeRating;
  readonly languageId: Uuid;
  readonly budget: number;
  readonly revenue: number;
  readonly posterUrl: Url;
  readonly backdropUrl: Url;
  readonly trailerUrl: Url;
  readonly votes: number;
  readonly score: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly userId: Uuid;

  private constructor(data: {
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
    posterUrl: Url;
    backdropUrl: Url;
    trailerUrl: Url;
    votes: number;
    score: number;
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
    this.votes = data.votes;
    this.score = data.score;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.userId = data.userId;
  }

  static create(props: CreateMovieProps): Movie {
    const now = new Date();
    return new Movie({
      id: Uuid.generate(),
      title: props.title,
      originalTitle: props.originalTitle,
      tagline: props.tagline,
      synopsis: props.synopsis,
      releaseDate: props.releaseDate,
      runtime: props.runtime,
      status: props.status,
      ageRating: props.ageRating,
      languageId: props.languageId,
      budget: props.budget,
      revenue: props.revenue,
      posterUrl: props.posterUrl,
      backdropUrl: props.backdropUrl,
      trailerUrl: props.trailerUrl,
      votes: 0,
      score: 0,
      createdAt: now,
      updatedAt: now,
      userId: props.userId
    });
  }

  static reconstitute(props: ReconstituteMovieProps): Movie {
    return new Movie({
      id: props.id,
      title: props.title,
      originalTitle: props.originalTitle,
      tagline: props.tagline,
      synopsis: props.synopsis,
      releaseDate: props.releaseDate,
      runtime: props.runtime,
      status: props.status,
      ageRating: props.ageRating,
      languageId: props.languageId,
      budget: props.budget,
      revenue: props.revenue,
      posterUrl: props.posterUrl,
      backdropUrl: props.backdropUrl,
      trailerUrl: props.trailerUrl,
      votes: props.votes,
      score: props.score,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      userId: props.userId
    });
  }
}
