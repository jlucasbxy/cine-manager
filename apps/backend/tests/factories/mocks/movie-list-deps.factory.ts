export function makeMovieListDeps() {
  const mockRepos = {
    movieListRepository: {
      addMovie: vi.fn(),
      create: vi.fn(),
      deleteByIdAndUserId: vi.fn(),
      findByIdAndUserIdWithMovies: vi.fn(),
      findAllByUserId: vi.fn(),
      removeMovieByListIdAndMovieId: vi.fn(),
      updateByIdAndUserId: vi.fn()
    },
    movieRepository: {
      hardDeleteIfSoftDeletedAndOrphan: vi.fn()
    }
  };

  const transactionManager = {
    execute: vi.fn((fn: (repos: typeof mockRepos) => unknown) => fn(mockRepos))
  };

  return {
    mockRepos,
    transactionManager
  };
}
