import type { QueryMoviesDTO } from "@repo/dtos";

export const queryKeys = {
  movies: {
    all: ["movies"] as const,
    list: (filters: Partial<QueryMoviesDTO>) =>
      ["movies", "list", filters] as const,
    detail: (id: string) => ["movies", "detail", id] as const
  },
  lists: {
    all: ["lists"] as const,
    detail: (id: string) => ["lists", "detail", id] as const
  },
  genres: {
    all: ["genres"] as const
  },
  languages: {
    all: ["languages"] as const
  }
};
