'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { draftApplicationResponse } from '@/ai/flows/draft-application-response';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';

const formSchema = z.object({
  applicationQuestion: z.string().min(10, 'Please enter the application question (at least 10 characters).'),
  userContext: z.string().optional(),
});

export default function AssistantForm() {
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationQuestion: '',
      userContext: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setDraft('');
    try {
      const result = await draftApplicationResponse(values);
      setDraft(result.draftResponse);
    } catch (error) {
      console.error('Error drafting response:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to draft the response. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className="mb-8">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="applicationQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Question</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the question from the application form here." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="userContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Background (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide some context about your situation to help the AI tailor the response. e.g., 'I am a single mother of two looking for affordable housing...'" className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                  Draft Response
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner className="h-8 w-8 text-primary"/>
          <p className="ml-4 text-muted-foreground">Drafting your response...</p>
        </div>
      )}

      {draft && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Drafted Response</CardTitle>
            <CardDescription>You can copy and edit this response before using it in your application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none rounded-lg bg-muted/30 p-6 whitespace-pre-wrap">
                <p>{draft}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
