export function makeAuthDeps() {
  const mockRepos = {
    userRepository: {
      findByEmail: vi.fn(),
      existsByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findByIdForUpdate: vi.fn()
    },
    refreshTokenRepository: {
      create: vi.fn(),
      findByTokenForUpdate: vi.fn(),
      updateByToken: vi.fn(),
      deleteExpiredByUserId: vi.fn(),
      updateManyByUserId: vi.fn()
    },
    passwordResetTokenRepository: {
      deleteByUserId: vi.fn(),
      create: vi.fn(),
      findByTokenForUpdate: vi.fn(),
      update: vi.fn()
    },
    outboxEventRepository: {
      create: vi.fn()
    }
  };

  const transactionManager = {
    execute: vi.fn((fn: (repos: typeof mockRepos) => unknown) => fn(mockRepos))
  };

  const hashProvider = {
    hash: vi.fn(),
    compare: vi.fn()
  };

  const tokenProvider = {
    generate: vi.fn(),
    verify: vi.fn()
  };

  const config = {
    accessTokenExpiresIn: "15m" as const,
    refreshTokenExpiresIn: "7d" as const,
    passwordResetTokenExpiresIn: "1h" as const
  };

  return {
    mockRepos,
    transactionManager,
    hashProvider,
    tokenProvider,
    config
  };
}
