import "dotenv/config";
import z from "zod";

const s3EnvSchema = z.object({
  S3_BUCKET: z.string(),
  S3_REGION: z.string().default("us-east-1"),
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_FORCE_PATH_STYLE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  UPLOAD_URL_EXPIRES_IN: z.coerce.number().default(900)
});

export const s3Env = s3EnvSchema.parse(process.env);
