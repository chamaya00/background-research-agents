import { z } from "zod";

export const InterestSubjectSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  status: z.enum(["active", "muted"]),
  weight: z.number().int().min(1).max(5),
});

export const InterestSchema = z.object({
  subjects: z.array(InterestSubjectSchema),
});

export type InterestSubject = z.infer<typeof InterestSubjectSchema>;
export type Interest = z.infer<typeof InterestSchema>;
