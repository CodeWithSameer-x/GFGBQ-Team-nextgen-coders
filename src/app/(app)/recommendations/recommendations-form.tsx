'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getPersonalizedRecommendations } from '@/ai/flows/get-personalized-recommendations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  userProfile: z.string().min(10, 'Please provide some details about your profile.'),
  needs: z.string().min(3, 'Please describe your needs.'),
});

export default function RecommendationsForm() {
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: '',
      needs: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations('');
    try {
      const result = await getPersonalizedRecommendations(values);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to get recommendations. Please try again later.',
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
                name="userProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Profile (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Single parent with two children, recently unemployed, living in a rural area." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="needs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Needs</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Childcare, job training, mental health support" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                  Get Recommendations
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner className="h-8 w-8 text-primary"/>
          <p className="ml-4 text-muted-foreground">Finding recommendations for you...</p>
        </div>
      )}

      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-blue max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: recommendations.replace(/\n/g, '<br />') }} />
          </CardContent>
        </Card>
      )}
    </>
  );
}
