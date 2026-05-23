import { type Db, fromPrisma, type PgBoss } from "pg-boss";
import type {
  EnqueueOptions,
  QueueName,
  QueueProvider
} from "@/application/interfaces/providers";
import type { PrismaDatabase } from "@/infrastructure/database/prisma";

export class PgBossQueueProvider implements QueueProvider {
  constructor(
    private readonly boss: PgBoss,
    private readonly tx?: PrismaDatabase
  ) {}

  private connection(): { db?: Db } {
    return this.tx ? { db: fromPrisma(this.tx) } : {};
  }

  async send(
    name: QueueName,
    data: Record<string, unknown>,
    options?: EnqueueOptions
  ): Promise<void> {
    await this.boss.send(name, data, {
      ...this.connection(),
      ...(options?.id ? { id: options.id } : {}),
      ...(options?.startAfter ? { startAfter: options.startAfter } : {})
    });
  }

  async cancel(name: QueueName, id: string): Promise<void> {
    await this.boss.cancel(name, id, this.connection());
  }
}
