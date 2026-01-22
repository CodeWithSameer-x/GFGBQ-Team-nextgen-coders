'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Bookmark, Resource } from '@/lib/types';
import { useToast } from './use-toast';

const BOOKMARKS_STORAGE_KEY = 'accessally-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error('Failed to load bookmarks from localStorage', error);
    }
  }, []);

  const saveBookmarks = useCallback((newBookmarks: Bookmark[]) => {
    try {
      setBookmarks(newBookmarks);
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error Saving Bookmarks',
        description: 'Your bookmarks could not be saved to your browser.'
      })
    }
  }, [toast]);

  const addBookmark = (resource: Resource) => {
    const id = `${resource.name}-${resource.address}`.replace(/\s+/g, '-').toLowerCase();
    if (bookmarks.some(b => b.id === id)) {
      toast({
        title: 'Already Bookmarked',
        description: 'This resource is already in your "My Progress" list.',
      });
      return;
    }
    const newBookmark: Bookmark = { ...resource, id, status: 'Not Started' };
    saveBookmarks([...bookmarks, newBookmark]);
    toast({
      title: 'Bookmarked!',
      description: `${resource.name} has been added to "My Progress".`,
    });
  };

  const removeBookmark = (bookmarkId: string) => {
    const newBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    saveBookmarks(newBookmarks);
    toast({
      title: 'Bookmark Removed',
      description: 'The resource has been removed from your list.',
    });
  };

  const updateBookmarkStatus = (bookmarkId: string, status: Bookmark['status']) => {
    const newBookmarks = bookmarks.map(b =>
      b.id === bookmarkId ? { ...b, status } : b
    );
    saveBookmarks(newBookmarks);
  };
  
  const isBookmarked = (resource: Resource): boolean => {
    const id = `${resource.name}-${resource.address}`.replace(/\s+/g, '-').toLowerCase();
    return bookmarks.some(b => b.id === id);
  }

  return { bookmarks, addBookmark, removeBookmark, updateBookmarkStatus, isBookmarked };
}
