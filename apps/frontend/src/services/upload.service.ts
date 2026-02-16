import type { GenerateUploadUrlResultDTO } from "@repo/dtos";
import axios from "axios";
import { apiClient } from "@/lib/api-client";

export async function getSignedUrl(fileName: string, contentType: string) {
  const response = await apiClient.post<GenerateUploadUrlResultDTO>(
    "/uploads/signed-url",
    { fileName, contentType }
  );
  return response.data;
}

export async function uploadFile(uploadUrl: string, file: File) {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type
    }
  });
}
