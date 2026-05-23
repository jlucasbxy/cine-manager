import { PgBoss } from "pg-boss";
import { env } from "@/infrastructure/config/env.config";
import { setupQueues } from "@/infrastructure/queue";
import { singleton } from "@/main/factories/singleton.util";

export const makePgBoss = singleton(
  () => new PgBoss({ connectionString: env.DATABASE_URL })
);

let startPromise: Promise<PgBoss> | null = null;

export function startPgBoss(): Promise<PgBoss> {
  if (!startPromise) {
    startPromise = (async () => {
      const boss = makePgBoss();
      await boss.start();
      await setupQueues(boss);
      return boss;
    })();
  }
  return startPromise;
}

export async function stopPgBoss(): Promise<void> {
  if (!startPromise) {
    return;
  }
  const boss = await startPromise;
  await boss.stop({ graceful: true });
  startPromise = null;
}
