import { z } from "zod";

export const FamiliaritySchema = z.enum(["unfamiliar", "familiar", "expert"]);

export const KnowledgeConceptSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  familiarity: FamiliaritySchema,
  last_updated: z.string().nullable(),
  note: z.string().nullable(),
});

export const KnowledgeSchema = z.object({
  concepts: z.array(KnowledgeConceptSchema),
});

export type Familiarity = z.infer<typeof FamiliaritySchema>;
export type KnowledgeConcept = z.infer<typeof KnowledgeConceptSchema>;
export type Knowledge = z.infer<typeof KnowledgeSchema>;
