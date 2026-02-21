import { Uuid } from "@/domain/value-objects/uuid.value-object";

interface CreateMovieListProps {
  name: string;
  userId: Uuid;
}

interface ReconstituteMovieListProps extends CreateMovieListProps {
  id: Uuid;
  createdAt: Date;
  updatedAt: Date;
}

export class MovieList {
  readonly id: Uuid;
  readonly name: string;
  readonly userId: Uuid;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(data: ReconstituteMovieListProps) {
    this.id = data.id;
    this.name = data.name;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(props: CreateMovieListProps): MovieList {
    const now = new Date();
    return new MovieList({
      id: Uuid.generate(),
      name: props.name,
      userId: props.userId,
      createdAt: now,
      updatedAt: now
    });
  }

  static reconstitute(props: ReconstituteMovieListProps): MovieList {
    return new MovieList(props);
  }
}
