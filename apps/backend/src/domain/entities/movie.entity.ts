import {
  type AgeRating,
  type MovieStatus,
  NonNegativeInt,
  NonNegativeNumber,
  type Url,
  Uuid
} from "@/domain/value-objects";

interface CreateMovieProps {
  title: string;
  originalTitle: string;
  tagline: string;
  synopsis: string;
  releaseDate: Date;
  runtime: NonNegativeInt;
  status: MovieStatus;
  ageRating: AgeRating;
  languageId: Uuid;
  budget: NonNegativeNumber;
  revenue: NonNegativeNumber;
  posterUrl: Url;
  backdropUrl: Url;
  trailerUrl: Url;
  userId: Uuid;
  isPublic?: boolean;
}

interface ReconstituteMovieProps extends CreateMovieProps {
  id: Uuid;
  votes: NonNegativeInt;
  score: NonNegativeNumber;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export class Movie {
  readonly id: Uuid;
  readonly title: string;
  readonly originalTitle: string;
  readonly tagline: string;
  readonly synopsis: string;
  readonly releaseDate: Date;
  readonly runtime: NonNegativeInt;
  readonly status: MovieStatus;
  readonly ageRating: AgeRating;
  readonly languageId: Uuid;
  readonly budget: NonNegativeNumber;
  readonly revenue: NonNegativeNumber;
  readonly posterUrl: Url;
  readonly backdropUrl: Url;
  readonly trailerUrl: Url;
  readonly votes: NonNegativeInt;
  readonly score: NonNegativeNumber;
  readonly isPublic: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly userId: Uuid;

  private constructor(data: ReconstituteMovieProps) {
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
    this.isPublic = data.isPublic;
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
      votes: NonNegativeInt.create(0),
      score: NonNegativeNumber.create(0),
      isPublic: props.isPublic ?? true,
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
      isPublic: props.isPublic,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      userId: props.userId
    });
  }
}
