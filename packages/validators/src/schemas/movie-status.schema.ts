import z from "zod";
import { MovieStatus } from "../enums";

const movieStatusValues = Object.values(MovieStatus) as [string, ...string[]];

export const movieStatusSchema = z.enum(movieStatusValues);
