import z from "zod";

export const passwordZodSchema = z.string().min(8).max(64);
