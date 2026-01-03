'use server';

/**
 * @fileOverview Suggests a list of potential diagnoses, ranked by likelihood, based on the analyzed patient data.
 *
 * - suggestDifferentialDiagnoses - A function that suggests potential diagnoses.
 */

import {ai} from '@/ai/genkit';
import { SuggestDifferentialDiagnosesInputSchema, type SuggestDifferentialDiagnosesInput, SuggestDifferentialDiagnosesOutputSchema, type SuggestDifferentialDiagnosesOutput } from '@/lib/schemas/ai-schemas';

export async function suggestDifferentialDiagnoses(
  input: SuggestDifferentialDiagnosesInput
): Promise<SuggestDifferentialDiagnosesOutput> {
  return suggestDifferentialDiagnosesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDifferentialDiagnosesPrompt',
  input: {schema: SuggestDifferentialDiagnosesInputSchema},
  output: {schema: SuggestDifferentialDiagnosesOutputSchema},
  prompt: `You are an AI assistant that helps doctors by suggesting potential diagnoses based on patient data.

  Analyze the following patient data and suggest a list of potential diagnoses, ranked by likelihood.
  For each diagnosis, provide a rationale.

  If the information provided is insufficient for a proper diagnosis, ask a clarifying counter-question to get more information. For example, if a patient mentions headaches, you could ask about the frequency, intensity, and location of the headaches. Set this question in the 'aiQuestion' field.

  Medical History: {{{medicalHistory}}}
  Symptoms: {{{symptoms}}}
  LabResults: {{{labResults}}}
  {{#if question}}
  When refining your diagnosis, consider the following question from the user: {{{question}}}. Do not change the original diagnosis, but provide a more detailed rationale and if needed, ask a follow-up counter-question in the 'aiQuestion' field.
  {{/if}}

  Format your response as a JSON array of objects with the following fields:
  - diagnosis: A potential diagnosis.
  - likelihood: The likelihood of the diagnosis (0-1).
  - rationale: The rationale for the diagnosis.
  - aiQuestion: (Optional) A clarifying question to ask the user.
  `,
});

const suggestDifferentialDiagnosesFlow = ai.defineFlow(
  {
    name: 'suggestDifferentialDiagnosesFlow',
    inputSchema: SuggestDifferentialDiagnosesInputSchema,
    outputSchema: SuggestDifferentialDiagnosesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
