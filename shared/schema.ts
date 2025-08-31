import { z } from "zod";

// Fact response schema
export const factResponseSchema = z.object({
  date: z.string(),
  fact: z.string(),
  source: z.string(),
  generated_at: z.string(),
});

export type FactResponse = z.infer<typeof factResponseSchema>;

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  retry: z.boolean().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Health check response schema
export const healthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  cacheSize: z.number(),
  usedFactsCount: z.number().optional(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
