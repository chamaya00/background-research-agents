import { z } from "zod";

export const FetchedItemSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  title: z.string().min(1),
  url: z.string().min(1),
  publishedAt: z.string().min(1),
  subjects: z.array(z.string()),
  concepts: z.array(z.string()),
  rawText: z.string(),
});

export const FetchedItemListSchema = z.array(FetchedItemSchema);

export type FetchedItem = z.infer<typeof FetchedItemSchema>;
