'use server';

/**
 * @fileOverview A flow to generate personalized recommendations for programs and resources based on user profile and needs.
 *
 * - getPersonalizedRecommendations - A function that handles the generation of personalized recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  userProfile: z.string().describe('A description of the user profile, including their demographics, needs, and goals.'),
  needs: z.string().describe('A description of the user needs and requirements.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('A list of personalized recommendations for programs and resources.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  return getPersonalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an AI assistant that provides personalized recommendations for programs and resources based on user profile and needs.\n\nUser Profile: {{{userProfile}}}\nNeeds: {{{needs}}}\n\nBased on the user profile and needs, provide a list of personalized recommendations for programs and resources.  The list must be valid markdown.`, // add markdown constraints
});

const getPersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'getPersonalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
