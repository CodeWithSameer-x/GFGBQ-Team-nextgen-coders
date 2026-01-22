'use server';

/**
 * @fileOverview An AI agent that helps users draft responses to application questions.
 *
 * - draftApplicationResponse - A function that handles drafting the response.
 * - DraftApplicationResponseInput - The input type for the function.
 * - DraftApplicationResponseOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftApplicationResponseInputSchema = z.object({
  applicationQuestion: z.string().describe('The question from the application form.'),
  userContext: z.string().describe('Optional background information provided by the user about their situation.').optional(),
});
export type DraftApplicationResponseInput = z.infer<typeof DraftApplicationResponseInputSchema>;

const DraftApplicationResponseOutputSchema = z.object({
  draftResponse: z.string().describe('A well-written, helpful draft response to the application question.'),
});
export type DraftApplicationResponseOutput = z.infer<typeof DraftApplicationResponseOutputSchema>;

export async function draftApplicationResponse(input: DraftApplicationResponseInput): Promise<DraftApplicationResponseOutput> {
  return draftApplicationResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftApplicationResponsePrompt',
  input: {schema: DraftApplicationResponseInputSchema},
  output: {schema: DraftApplicationResponseOutputSchema},
  prompt: `You are an AI assistant designed to help people write compelling and clear responses for applications (e.g., for social services, jobs, or other programs). Your tone should be supportive, empowering, and professional.

The user has provided a question from an application and some personal context. Your task is to draft a high-quality response for them.

Application Question:
"{{{applicationQuestion}}}"

User's Background Information:
{{#if userContext}}
"{{{userContext}}}"
{{else}}
(No additional context provided)
{{/if}}

Based on this, draft a response to the application question. The response should be clear, concise, and directly address the question. If no user context is provided, create a strong, general-purpose response that the user can easily edit. Frame the response positively where possible, focusing on strengths, goals, and needs without sounding desperate.

The output should be only the text for the response. Do not add any introductory phrases like "Here is a draft:" or "Here is your response:".
`,
});

const draftApplicationResponseFlow = ai.defineFlow(
  {
    name: 'draftApplicationResponseFlow',
    inputSchema: DraftApplicationResponseInputSchema,
    outputSchema: DraftApplicationResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
