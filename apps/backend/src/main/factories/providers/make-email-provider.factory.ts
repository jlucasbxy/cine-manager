import { ResendEmailProvider } from "@/infrastructure/providers";
import { singleton } from "@/main/factories/singleton.util";

export const makeEmailProvider = singleton(() => new ResendEmailProvider());
