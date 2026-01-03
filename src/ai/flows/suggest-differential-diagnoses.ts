'use server';

/**
 * @fileOverview Suggests a list of potential diagnoses, ranked by likelihood, based on the analyzed patient data.
 *
 * - suggestDifferentialDiagnoses - A function that suggests potential diagnoses.
 * - SuggestDifferentialDiagnosesInput - The input type for the suggestDifferentialDiagnoses function.
 * - SuggestDifferentialDiagnosesOutput - The return type for the suggestDifferentialDiagnoses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDifferentialDiagnosesInputSchema = z.object({
  medicalHistory: z.string().describe("The patient's medical history."),
  symptoms: z.string().describe("The patient's reported symptoms."),
  labResults: z.string().describe("The patient's laboratory results."),
  question: z.string().optional().describe("A clarifying question about a potential diagnosis."),
});
export type SuggestDifferentialDiagnosesInput =
  z.infer<typeof SuggestDifferentialDiagnosesInputSchema>;

const SuggestDifferentialDiagnosesOutputSchema = z.array(z.object({
  diagnosis: z.string().describe('A potential diagnosis.'),
  likelihood: z.number().describe('The likelihood of the diagnosis (0-1).'),
  rationale: z.string().describe('The rationale for the diagnosis.'),
})).describe('A list of potential diagnoses, ranked by likelihood.');
export type SuggestDifferentialDiagnosesOutput =
  z.infer<typeof SuggestDifferentialDiagnosesOutputSchema>;

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

  If the information provided is insufficient for a proper diagnosis, ask clarifying questions to get more information. For example, if a patient mentions headaches, you could ask about the frequency, intensity, and location of the headaches.

  Medical History: {{{medicalHistory}}}
  Symptoms: {{{symptoms}}}
  LabResults: {{{labResults}}}
  {{#if question}}
  When refining your diagnosis, consider the following question: {{{question}}}. Do not change the original diagnosis, but provide a more detailed rationale based on the question.
  {{/if}}

  Format your response as a JSON array of objects with the following fields:
  - diagnosis: A potential diagnosis.
  - likelihood: The likelihood of the diagnosis (0-1).
  - rationale: The rationale for the diagnosis.
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
