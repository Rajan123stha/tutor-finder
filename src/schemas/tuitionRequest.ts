import * as z from 'zod';

export const tuitionRequestSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  preferredDays: z.array(z.string()).min(1, 'Select at least one preferred day'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  duration: z.number().min(1, 'Duration must be at least 1 month'),
  startDate: z.date(),
  notes: z.string().optional()
});

export type TuitionRequestFormData = z.infer<typeof tuitionRequestSchema>;
