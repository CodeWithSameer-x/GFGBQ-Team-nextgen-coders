'use server';
/**
 * @fileOverview Analyzes patient data to identify potential disease patterns and anomalies.
 *
 * - analyzePatientDataForPatterns - A function that handles the analysis of patient data.
 */

import {ai} from '@/ai/genkit';
import { type AnalyzePatientDataInput, AnalyzePatientDataInputSchema, type AnalyzePatientDataOutput, AnalyzePatientDataOutputSchema } from '@/lib/schemas/ai-schemas';


export async function analyzePatientDataForPatterns(input: AnalyzePatientDataInput): Promise<AnalyzePatientDataOutput> {
  return analyzePatientDataForPatternsFlow(input);
}

const analyzePatientDataForPatternsPrompt = ai.definePrompt({
  name: 'analyzePatientDataForPatternsPrompt',
  input: {schema: AnalyzePatientDataInputSchema},
  output: {schema: AnalyzePatientDataOutputSchema},
  prompt: `You are an AI assistant designed to analyze patient data and identify potential disease patterns and anomalies.

  Analyze the following patient data:
  
  {{#if medicalHistoryFile}}
  Medical History File: {{media url=medicalHistoryFile}}
  Please extract and consider the medical history from this file.
  {{/if}}
  Medical History (Text): {{{medicalHistory}}}
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
