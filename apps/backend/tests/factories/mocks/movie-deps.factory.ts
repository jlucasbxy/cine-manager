export function makeMovieDeps() {
  const mockRepos = {
    movieRepository: {
      create: vi.fn(),
      deleteByIdAndUserId: vi.fn(),
      hardDeleteIfSoftDeletedAndOrphan: vi.fn(),
      findByIdForUpdate: vi.fn(),
      update: vi.fn()
    },
    outboxEventRepository: {
      create: vi.fn(),
      deletePendingByResourceId: vi.fn()
    },
    userRepository: {
      findById: vi.fn()
    },
    ratingRepository: {
      upsert: vi.fn(),
      getAverageAndCount: vi.fn()
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
