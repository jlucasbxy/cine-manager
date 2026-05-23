import type { PgBoss } from "pg-boss";
import { deadLetterName, QUEUE_DEFINITIONS } from "./queue.config";

export async function setupQueues(boss: PgBoss): Promise<void> {
  for (const queue of QUEUE_DEFINITIONS) {
    const deadLetter = deadLetterName(queue.name);

    await boss.createQueue(deadLetter);
    await boss.createQueue(queue.name, {
      retryLimit: queue.retryLimit,
      retryDelay: queue.retryDelay,
      retryBackoff: queue.retryBackoff,
      deadLetter
    });
  }
}
