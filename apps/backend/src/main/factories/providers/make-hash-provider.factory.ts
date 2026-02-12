import { BcryptHashProvider } from "@/infrastructure/providers";
import { singleton } from "@/main/factories/singleton.util";

export const makeHashProvider = singleton(() => new BcryptHashProvider());
