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
  /**
   * One of `preference.formats`' entries, or any other string a source
   * doesn't have a mapping for - `selectAndRank` treats an unmapped or
   * absent format as least-preferred rather than rejecting it. Defaults to
   * "article" so fixtures written before this field existed still parse.
   */
  format: z.string().min(1).default("article"),
});

export const FetchedItemListSchema = z.array(FetchedItemSchema);

export type FetchedItem = z.infer<typeof FetchedItemSchema>;
