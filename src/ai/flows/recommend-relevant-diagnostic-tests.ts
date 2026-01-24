'use server';

/**
 * @fileOverview Recommends a prioritized list of relevant diagnostic tests based on the identified potential conditions.
 *
 * - recommendRelevantDiagnosticTests - A function that handles the diagnostic test recommendation process.
 */

import {ai} from '@/ai/genkit';
import { RecommendRelevantDiagnosticTestsInputSchema, type RecommendRelevantDiagnosticTestsInput, RecommendRelevantDiagnosticTestsOutputSchema, type RecommendRelevantDiagnosticTestsOutput } from '@/lib/schemas/ai-schemas';

export async function recommendRelevantDiagnosticTests(input: RecommendRelevantDiagnosticTestsInput): Promise<RecommendRelevantDiagnosticTestsOutput> {
  return recommendRelevantDiagnosticTestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendRelevantDiagnosticTestsPrompt',
  input: {schema: RecommendRelevantDiagnosticTestsInputSchema},
  output: {format: 'json', schema: RecommendRelevantDiagnosticTestsOutputSchema},
  prompt: `You are an AI assistant that helps doctors by recommending a prioritized list of relevant diagnostic tests based on the patient's medical history, symptoms, lab results, and potential conditions.
  
  {{#if medicalHistoryFile}}
  Medical History File: {{media url=medicalHistoryFile}}
  Please extract and consider the medical history from this file.
  {{/if}}
  Medical History: {{{medicalHistory}}}
  Symptoms: {{{symptoms}}}
  Lab Results: {{{labResults}}}
  Potential Conditions: {{{potentialConditions}}}

  Please provide a prioritized list of relevant diagnostic tests, including the test name, rationale, and priority (1 being highest).
  
  Respond with a valid JSON object that conforms to this Zod schema:
  '''json
  {{jsonSchema output}}
  '''
  `,
});

const recommendRelevantDiagnosticTestsFlow = ai.defineFlow(
  {
    name: 'recommendRelevantDiagnosticTestsFlow',
    inputSchema: RecommendRelevantDiagnosticTestsInputSchema,
    outputSchema: RecommendRelevantDiagnosticTestsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
