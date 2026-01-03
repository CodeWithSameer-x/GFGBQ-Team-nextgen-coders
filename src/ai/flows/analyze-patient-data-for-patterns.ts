'use server';
/**
 * @fileOverview Analyzes patient data to identify potential disease patterns and anomalies.
 *
 * - analyzePatientDataForPatterns - A function that handles the analysis of patient data.
 * - AnalyzePatientDataInput - The input type for the analyzePatientDataForPatterns function.
 * - AnalyzePatientDataOutput - The return type for the analyzePatientDataForPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePatientDataInputSchema = z.object({
  medicalHistory: z.string().describe('The patient\'s medical history.'),
  symptoms: z.string().describe('The patient\'s reported symptoms.'),
  labResults: z.string().describe('The patient\'s laboratory results.'),
});
export type AnalyzePatientDataInput = z.infer<typeof AnalyzePatientDataInputSchema>;

const AnalyzePatientDataOutputSchema = z.object({
  diseasePatterns: z.string().describe('Identified disease patterns and potential conditions.'),
  anomalies: z.string().describe('Highlighted anomalies in the patient data.'),
});
export type AnalyzePatientDataOutput = z.infer<typeof AnalyzePatientDataOutputSchema>;

export async function analyzePatientDataForPatterns(input: AnalyzePatientDataInput): Promise<AnalyzePatientDataOutput> {
  return analyzePatientDataForPatternsFlow(input);
}

const analyzePatientDataForPatternsPrompt = ai.definePrompt({
  name: 'analyzePatientDataForPatternsPrompt',
  input: {schema: AnalyzePatientDataInputSchema},
  output: {schema: AnalyzePatientDataOutputSchema},
  prompt: `You are an AI assistant designed to analyze patient data and identify potential disease patterns and anomalies.

  Analyze the following patient data:

  Medical History: {{{medicalHistory}}}
  Symptoms: {{{symptoms}}}
  Lab Results: {{{labResults}}}

  Identify any relevant disease patterns and highlight any anomalies that may be of concern.
  Please provide a concise summary of your findings.
  `,
});

const analyzePatientDataForPatternsFlow = ai.defineFlow(
  {
    name: 'analyzePatientDataForPatternsFlow',
    inputSchema: AnalyzePatientDataInputSchema,
    outputSchema: AnalyzePatientDataOutputSchema,
  },
  async input => {
    const {output} = await analyzePatientDataForPatternsPrompt(input);
    return output!;
  }
);
