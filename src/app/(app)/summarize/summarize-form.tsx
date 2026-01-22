'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { summarizeComplexDocument } from '@/ai/flows/summarize-complex-documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';

const formSchema = z.object({
  documentText: z.string().min(50, 'Please enter at least 50 characters to summarize.'),
});

export default function SummarizeForm() {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentText: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizeComplexDocument(values);
      setSummary(result.summary);
    } catch (error) {
      console.error('Error summarizing document:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to summarize the document. Please try again later.',
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
                name="documentText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document to Summarize</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the complex document text here..." className="min-h-[200px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                  Generate Summary
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner className="h-8 w-8 text-primary"/>
          <p className="ml-4 text-muted-foreground">Generating summary...</p>
        </div>
      )}

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none rounded-lg bg-muted/30 p-6">
                <p>{summary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
