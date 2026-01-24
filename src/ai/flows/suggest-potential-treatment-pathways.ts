'use server';
/**
 * @fileOverview Suggests potential treatment pathways based on the diagnosis and patient data.
 *
 * - suggestPotentialTreatmentPathways - A function that suggests potential treatment pathways.
 */

import {ai} from '@/ai/genkit';
import { SuggestPotentialTreatmentPathwaysInputSchema, type SuggestPotentialTreatmentPathwaysInput, SuggestPotentialTreatmentPathwaysOutputSchema, type SuggestPotentialTreatmentPathwaysOutput } from '@/lib/schemas/ai-schemas';

export async function suggestPotentialTreatmentPathways(input: SuggestPotentialTreatmentPathwaysInput): Promise<SuggestPotentialTreatmentPathwaysOutput> {
  return suggestPotentialTreatmentPathwaysFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPotentialTreatmentPathwaysPrompt',
  input: {schema: SuggestPotentialTreatmentPathwaysInputSchema},
  output: {format: 'json', schema: SuggestPotentialTreatmentPathwaysOutputSchema},
  prompt: `You are an expert medical advisor specializing in suggesting treatment pathways.

  Based on the diagnosis and patient data provided, suggest potential treatment pathways, including relevant medications and therapies.

  Diagnosis: {{{diagnosis}}}
  Patient Data: {{{patientData}}}

  Suggest treatment pathways.
  
  Respond with a valid JSON object that conforms to this Zod schema:
  '''json
  {{jsonSchema output}}
  '''
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
