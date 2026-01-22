'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bookmark, Building, Info, MapPin, Phone } from 'lucide-react';

import { findRelevantResources } from '@/ai/flows/find-relevant-resources';
import type { Resource } from '@/lib/types';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';

const formSchema = z.object({
  needs: z.string().min(3, 'Please describe your needs.'),
  location: z.string().min(2, 'Please enter a location.'),
});

export default function ResourceLocator() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addBookmark, isBookmarked } = useBookmarks();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      needs: '',
      location: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResources([]);
    try {
      const result = await findRelevantResources(values);
      if (result.resources && result.resources.length > 0) {
        setResources(result.resources);
      } else {
        toast({
          title: 'No Resources Found',
          description: 'We couldn\'t find any resources matching your criteria. Please try a different search.',
        });
      }
    } catch (error) {
      console.error('Error finding resources:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: 'Failed to fetch resources. Please try again later.',
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="needs"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Your Needs</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., food pantry, housing assistance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco, CA or 94102" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-3 text-right">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <LoadingSpinner className="mr-2 h-4 w-4" />}
                  Find Resources
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner className="h-8 w-8 text-primary"/>
          <p className="ml-4 text-muted-foreground">Searching for resources...</p>
        </div>
      )}

      <div className="grid gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span className="font-headline text-2xl">{resource.name}</span>
                 <Button variant={isBookmarked(resource) ? "secondary" : "outline"} size="sm" onClick={() => addBookmark(resource)} disabled={isBookmarked(resource)}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  {isBookmarked(resource) ? "Bookmarked" : "Bookmark"}
                </Button>
              </CardTitle>
              <CardDescription className="flex items-center pt-2">
                <Building className="mr-2 h-4 w-4" />
                {resource.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-accent" /> {resource.address}</p>
                    <p className="flex items-center"><Phone className="mr-2 h-4 w-4 text-accent" /> {resource.contact}</p>
                </div>
            </CardContent>
            <CardFooter>
                 <p className="flex items-start text-sm text-muted-foreground"><Info className="mr-2 h-4 w-4 text-accent flex-shrink-0 mt-1" /> <strong>Eligibility:</strong> <span className="ml-2">{resource.eligibility}</span></p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
