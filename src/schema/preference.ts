import { z } from "zod";

export const PreferenceSchema = z.object({
  depth: z.enum(["quick", "deep"]),
  formats: z.array(z.string().min(1)),
  recency: z.object({
    min_recency_days: z.number().int().min(0),
    prefer_recent: z.boolean(),
  }),
  sources: z.record(z.string(), z.number()),
});

export type Preference = z.infer<typeof PreferenceSchema>;
