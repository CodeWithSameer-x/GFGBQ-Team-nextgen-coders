import { z } from "zod";

export const patientDataSchema = z.object({
  medicalHistory: z
    .string()
    .min(10, { message: "Medical history must be at least 10 characters." }),
  symptoms: z
    .string()
    .min(10, { message: "Symptoms must be at least 10 characters." }),
  labResults: z.string().min(10, {
    message: "Lab results must be at least 10 characters.",
  }),
});
