'use server';

/**
 * @fileOverview Recommends a prioritized list of relevant diagnostic tests based on the identified potential conditions.
 *
 * - recommendRelevantDiagnosticTests - A function that handles the diagnostic test recommendation process.
 * - RecommendRelevantDiagnosticTestsInput - The input type for the recommendRelevantDiagnosticTests function.
 * - RecommendRelevantDiagnosticTestsOutput - The return type for the recommendRelevantDiagnosticTests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendRelevantDiagnosticTestsInputSchema = z.object({
  medicalHistory: z.string().describe('The patient\'s medical history.'),
  symptoms: z.string().describe('The patient\'s reported symptoms.'),
  labResults: z.string().describe('The patient\'s laboratory results.'),
  potentialConditions: z.string().describe('The identified potential conditions.'),
});
export type RecommendRelevantDiagnosticTestsInput = z.infer<typeof RecommendRelevantDiagnosticTestsInputSchema>;

const RecommendRelevantDiagnosticTestsOutputSchema = z.object({
  recommendedTests: z.array(
    z.object({
      testName: z.string().describe('The name of the recommended diagnostic test.'),
      rationale: z.string().describe('The rationale for recommending this test.'),
      priority: z.number().describe('The priority of the test (1 being highest).'),
    })
  ).describe('A prioritized list of relevant diagnostic tests.'),
});
export type RecommendRelevantDiagnosticTestsOutput = z.infer<typeof RecommendRelevantDiagnosticTestsOutputSchema>;

export async function recommendRelevantDiagnosticTests(input: RecommendRelevantDiagnosticTestsInput): Promise<RecommendRelevantDiagnosticTestsOutput> {
  return recommendRelevantDiagnosticTestsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendRelevantDiagnosticTestsPrompt',
  input: {schema: RecommendRelevantDiagnosticTestsInputSchema},
  output: {schema: RecommendRelevantDiagnosticTestsOutputSchema},
  prompt: `You are an AI assistant that helps doctors by recommending a prioritized list of relevant diagnostic tests based on the patient's medical history, symptoms, lab results, and potential conditions.

  Medical History: {{{medicalHistory}}}
  Symptoms: {{{symptoms}}}
  Lab Results: {{{labResults}}}
  Potential Conditions: {{{potentialConditions}}}

  Please provide a prioritized list of relevant diagnostic tests, including the test name, rationale, and priority (1 being highest).`,
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
