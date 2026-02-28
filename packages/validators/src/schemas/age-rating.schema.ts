import z from "zod";
import { AgeRating } from "../enums";

const ageRatingValues = Object.values(AgeRating) as [string, ...string[]];

export const ageRatingSchema = z.enum(ageRatingValues);
