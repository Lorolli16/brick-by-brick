import { z } from "zod";

// Free-text fields: trimmed, length-limited, no angle brackets (blocks HTML/script injection).
export const commentSchema = z
  .string()
  .trim()
  .min(1, "Please add a short note")
  .max(140, "Keep it under 140 characters")
  .refine((v) => !/[<>]/.test(v), "Please avoid < and > characters");

/** Allows at most `max` actions per `windowMs`. Returns a checker that says if an action may proceed. */
export function createRateLimiter(max: number, windowMs: number, now: () => number = Date.now) {
  let hits: number[] = [];
  return () => {
    const t = now();
    hits = hits.filter((h) => t - h < windowMs);
    if (hits.length >= max) return false;
    hits.push(t);
    return true;
  };
}

// Household join code: exactly 6 letters/digits, case-insensitive.
export const joinCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{6}$/, "Codes are 6 letters or numbers");

export const emailSchema = z.string().trim().email("That email looks off").max(255);
export const passwordSchema = z.string().min(8, "At least 8 characters").max(72);
