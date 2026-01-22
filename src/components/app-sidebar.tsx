'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bookmark,
  FileText,
  HeartHandshake,
  LayoutGrid,
  MessageSquare,
  PanelLeft,
  PenSquare,
  Search,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { href: '/resources', icon: Search, label: 'Resource Locator' },
  { href: '/summarize', icon: FileText, label: 'Info Summaries' },
  { href: '/recommendations', icon: HeartHandshake, label: 'Recommendations' },
  { href: '/app-assistant', icon: PenSquare, label: 'App Assistant' },
  { href: '/my-progress', icon: Bookmark, label: 'My Progress' },
  { href: '/feedback', icon: MessageSquare, label: 'Feedback' },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const navLinks = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-muted text-primary': pathname === href }
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-72 flex-col border-r bg-card sm:flex">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-headline font-bold text-xl">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span>AccessAlly</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          {navLinks}
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs p-0">
             <SheetHeader className="h-16 flex flex-row items-center border-b px-6">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 font-headline font-bold text-xl">
                    <LayoutGrid className="h-6 w-6 text-primary" />
                    <span>AccessAlly</span>
                  </Link>
                </SheetTitle>
                 <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
              </SheetHeader>
            <div className="py-2">
              {navLinks}
            </div>
          </SheetContent>
        </Sheet>
         <div className="flex items-center gap-2 font-headline font-semibold text-xl sm:hidden">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span>AccessAlly</span>
        </div>
      </header>
    </>
  );
}
