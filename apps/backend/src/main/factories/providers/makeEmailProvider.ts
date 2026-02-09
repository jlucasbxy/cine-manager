import { ResendEmailProvider } from "@/infrastructure/providers";
import { singleton } from "@/main/factories/singleton";

export const makeEmailProvider = singleton(() => new ResendEmailProvider());
