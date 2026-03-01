import type { LogProvider } from "@/application/interfaces/providers";

interface PinoLike {
  info(obj: Record<string, unknown>, msg: string): void;
  info(msg: string): void;
  warn(obj: Record<string, unknown>, msg: string): void;
  warn(msg: string): void;
  error(obj: Record<string, unknown>, msg: string): void;
  error(msg: string): void;
  debug(obj: Record<string, unknown>, msg: string): void;
  debug(msg: string): void;
  child(bindings: Record<string, unknown>): PinoLike;
}

export class PinoLogProvider implements LogProvider {
  constructor(private readonly logger: PinoLike) {}

  static fromLogger(logger: PinoLike): PinoLogProvider {
    return new PinoLogProvider(logger);
  }

  info(message: string, data?: Record<string, unknown>): void {
    data ? this.logger.info(data, message) : this.logger.info(message);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    data ? this.logger.warn(data, message) : this.logger.warn(message);
  }

  error(message: string, data?: Record<string, unknown>): void {
    data ? this.logger.error(data, message) : this.logger.error(message);
  }

  debug(message: string, data?: Record<string, unknown>): void {
    data ? this.logger.debug(data, message) : this.logger.debug(message);
  }

  child(bindings: Record<string, unknown>): PinoLogProvider {
    return new PinoLogProvider(this.logger.child(bindings));
  }
}
