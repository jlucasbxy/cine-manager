export {};

const commands: Record<string, () => Promise<void>> = {
  server: async () => {
    const { start } = await import("@/main/server");
    await start();
  },
  worker: async () => {
    const { startWorker } = await import("@/main/worker");
    startWorker();
  },
  seed: async () => {
    const { seedGenres } = await import(
      "@/infrastructure/database/seeds/genre.seed"
    );
    const { seedLanguages } = await import(
      "@/infrastructure/database/seeds/language.seed"
    );
    await seedGenres();
    await seedLanguages();
  },
  "seed:dev": async () => {
    const { seedGenres } = await import(
      "@/infrastructure/database/seeds/genre.seed"
    );
    const { seedLanguages } = await import(
      "@/infrastructure/database/seeds/language.seed"
    );
    const { seedDev } = await import(
      "@/infrastructure/database/seeds/dev.seed"
    );
    await seedGenres();
    await seedLanguages();
    await seedDev();
  }
};

const mode = process.argv[2];
const run = commands[mode];

if (run) {
  await run();
} else {
  const available = Object.keys(commands).join("|");
  // eslint-disable-next-line no-console
  console.error(`Usage: ${process.argv[1]} <${available}>`);
  process.exit(1);
}
