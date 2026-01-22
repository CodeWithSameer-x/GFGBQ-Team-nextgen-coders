'use client';

import { Building, Info, MapPin, Phone, Trash2 } from 'lucide-react';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Bookmark } from '@/lib/types';

export default function BookmarkedResources() {
  const { bookmarks, updateBookmarkStatus, removeBookmark } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-12">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">No Bookmarked Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven't bookmarked any resources yet. Start by finding resources and clicking the "Bookmark" button.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="font-headline text-2xl">{bookmark.name}</CardTitle>
              <CardDescription className="flex items-center pt-2">
                <Building className="mr-2 h-4 w-4" />
                {bookmark.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={bookmark.status}
                onValueChange={(value: Bookmark['status']) => updateBookmarkStatus(bookmark.id, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => removeBookmark(bookmark.id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove Bookmark</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-accent" /> {bookmark.address}</p>
              <p className="flex items-center"><Phone className="mr-2 h-4 w-4 text-accent" /> {bookmark.contact}</p>
              <p className="flex items-start"><Info className="mr-2 h-4 w-4 text-accent flex-shrink-0 mt-1" /> <strong>Eligibility:</strong> <span className="ml-2">{bookmark.eligibility}</span></p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
