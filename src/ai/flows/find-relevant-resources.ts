'use server';

/**
 * @fileOverview An AI agent that finds relevant resources based on user needs and location.
 *
 * - findRelevantResources - A function that handles the resource finding process.
 * - FindRelevantResourcesInput - The input type for the findRelevantResources function.
 * - FindRelevantResourcesOutput - The return type for the findRelevantResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindRelevantResourcesInputSchema = z.object({
  needs: z.string().describe('The specific needs of the user (e.g., food assistance, job training).'),
  location: z.string().describe('The location of the user (e.g., city, state, zip code).'),
});
export type FindRelevantResourcesInput = z.infer<typeof FindRelevantResourcesInputSchema>;

const FindRelevantResourcesOutputSchema = z.object({
  resources: z.array(
    z.object({
      name: z.string().describe('The name of the resource or program.'),
      description: z.string().describe('A brief description of the resource.'),
      address: z.string().describe('The address of the resource.'),
      contact: z.string().describe('Contact information for the resource (e.g., phone number, email).'),
      eligibility: z.string().describe('Eligibility criteria for the resource.'),
    })
  ).describe('A list of relevant resources in the user\u0027s community.'),
});
export type FindRelevantResourcesOutput = z.infer<typeof FindRelevantResourcesOutputSchema>;

export async function findRelevantResources(input: FindRelevantResourcesInput): Promise<FindRelevantResourcesOutput> {
  return findRelevantResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findRelevantResourcesPrompt',
  input: {schema: FindRelevantResourcesInputSchema},
  output: {schema: FindRelevantResourcesOutputSchema},
  prompt: `You are a helpful assistant that finds resources for people in need. The user will provide their needs and location, and you should find relevant resources in their community.

  Needs: {{{needs}}}
  Location: {{{location}}}

  Format your response as a JSON array of resources, where each resource has the following fields:
  - name: The name of the resource or program.
  - description: A brief description of the resource.
  - address: The address of the resource.
  - contact: Contact information for the resource (e.g., phone number, email).
  - eligibility: Eligibility criteria for the resource.
  `,
});

const findRelevantResourcesFlow = ai.defineFlow(
  {
    name: 'findRelevantResourcesFlow',
    inputSchema: FindRelevantResourcesInputSchema,
    outputSchema: FindRelevantResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
