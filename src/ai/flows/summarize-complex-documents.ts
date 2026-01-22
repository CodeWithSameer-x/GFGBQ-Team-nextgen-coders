'use server';

/**
 * @fileOverview A document summarization AI agent.
 *
 * - summarizeComplexDocument - A function that handles the document summarization process.
 * - SummarizeComplexDocumentInput - The input type for the summarizeComplexDocument function.
 * - SummarizeComplexDocumentOutput - The return type for the summarizeComplexDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeComplexDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the complex document to be summarized.'),
});
export type SummarizeComplexDocumentInput = z.infer<typeof SummarizeComplexDocumentInputSchema>;

const SummarizeComplexDocumentOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise and easy-to-understand summary of the complex document.'),
});
export type SummarizeComplexDocumentOutput = z.infer<typeof SummarizeComplexDocumentOutputSchema>;

export async function summarizeComplexDocument(
  input: SummarizeComplexDocumentInput
): Promise<SummarizeComplexDocumentOutput> {
  return summarizeComplexDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeComplexDocumentPrompt',
  input: {schema: SummarizeComplexDocumentInputSchema},
  output: {schema: SummarizeComplexDocumentOutputSchema},
  prompt: `You are an expert summarizer, skilled at condensing complex documents into easy-to-understand language.

  Please provide a summary of the following document, focusing on the key information and making it accessible to a general audience.

  Document:
  {{documentText}}`,
});

const summarizeComplexDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeComplexDocumentFlow',
    inputSchema: SummarizeComplexDocumentInputSchema,
    outputSchema: SummarizeComplexDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
