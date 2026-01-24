import { z } from "zod";

export const patientDataSchema = z.object({
  medicalHistory: z.string().optional(),
  medicalHistoryFile: z.string().optional(),
  symptoms: z.string(),
  labResults: z.string().optional(),
}).refine(data => data.medicalHistoryFile || (data.symptoms && data.symptoms.length >= 10), {
  message: "Symptoms must be at least 10 characters if no file is provided.",
  path: ["symptoms"],
});
