import { z } from "zod";

export const patientDataSchema = z.object({
  medicalHistory: z.string().optional(),
  symptoms: z
    .string()
    .min(10, { message: "Symptoms must be at least 10 characters." }),
  labResults: z.string().optional(),
});
