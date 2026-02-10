import { BcryptHashProvider } from "@/infrastructure/providers";
import { singleton } from "@/main/factories/singleton";

export const makeHashProvider = singleton(() => new BcryptHashProvider());
