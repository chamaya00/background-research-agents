import { z } from "zod";

export const SourceSchema = z.object({
  id: z.string().min(1),
  kind: z.string().min(1),
  url: z.string().min(1),
  enabled: z.boolean(),
});

export const SourceListSchema = z.object({
  sources: z.array(SourceSchema),
});

export type Source = z.infer<typeof SourceSchema>;
export type SourceList = z.infer<typeof SourceListSchema>;
