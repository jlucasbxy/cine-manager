export interface GenerateUploadUrlDTO {
  fileName: string;
  contentType: string;
}

export interface GenerateUploadUrlResultDTO {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}
