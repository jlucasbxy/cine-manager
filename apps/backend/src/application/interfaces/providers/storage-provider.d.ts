export type GenerateUploadUrlData = {
  key: string;
  contentType: string;
  expiresInSeconds: number;
};

export type GenerateUploadUrlResult = {
  uploadUrl: string;
  fileUrl: string;
};

export interface StorageProvider {
  generateUploadUrl(
    data: GenerateUploadUrlData
  ): Promise<GenerateUploadUrlResult>;
}
