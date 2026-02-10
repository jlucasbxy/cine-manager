import type { UploadService } from "@/application/interfaces/services";
import type { GenerateUploadUrl } from "@/application/use-cases/upload";
import type {
  GenerateUploadUrlDTO,
  GenerateUploadUrlResultDTO
} from "@repo/dtos";

export class UploadServiceImpl implements UploadService {
  constructor(
    private readonly generateUploadUrlUseCase: GenerateUploadUrl
  ) {}

  async generateUploadUrl(
    userId: string,
    input: GenerateUploadUrlDTO
  ): Promise<GenerateUploadUrlResultDTO> {
    return this.generateUploadUrlUseCase.execute(userId, input);
  }
}
