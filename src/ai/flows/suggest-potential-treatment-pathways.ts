'use server';
/**
 * @fileOverview Suggests potential treatment pathways based on the diagnosis and patient data.
 *
 * - suggestPotentialTreatmentPathways - A function that suggests potential treatment pathways.
 * - SuggestPotentialTreatmentPathwaysInput - The input type for the suggestPotentialTreatmentPathways function.
 * - SuggestPotentialTreatmentPathwaysOutput - The return type for the suggestPotentialTreatmentPathways function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPotentialTreatmentPathwaysInputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the patient.'),
  patientData: z.string().describe('The patient data including medical history, symptoms, and lab results.'),
});
export type SuggestPotentialTreatmentPathwaysInput = z.infer<typeof SuggestPotentialTreatmentPathwaysInputSchema>;

const SuggestPotentialTreatmentPathwaysOutputSchema = z.object({
  treatmentPathways: z.array(z.string()).describe('An array of potential treatment pathways including relevant medications and therapies.'),
});
export type SuggestPotentialTreatmentPathwaysOutput = z.infer<typeof SuggestPotentialTreatmentPathwaysOutputSchema>;

export async function suggestPotentialTreatmentPathways(input: SuggestPotentialTreatmentPathwaysInput): Promise<SuggestPotentialTreatmentPathwaysOutput> {
  return suggestPotentialTreatmentPathwaysFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPotentialTreatmentPathwaysPrompt',
  input: {schema: SuggestPotentialTreatmentPathwaysInputSchema},
  output: {schema: SuggestPotentialTreatmentPathwaysOutputSchema},
  prompt: `You are an expert medical advisor specializing in suggesting treatment pathways.

  Based on the diagnosis and patient data provided, suggest potential treatment pathways, including relevant medications and therapies.

  Diagnosis: {{{diagnosis}}}
  Patient Data: {{{patientData}}}

  Suggest treatment pathways:
  `,
});

const suggestPotentialTreatmentPathwaysFlow = ai.defineFlow(
  {
    name: 'suggestPotentialTreatmentPathwaysFlow',
    inputSchema: SuggestPotentialTreatmentPathwaysInputSchema,
    outputSchema: SuggestPotentialTreatmentPathwaysOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
