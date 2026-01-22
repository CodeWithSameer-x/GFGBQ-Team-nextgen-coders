import BookmarkedResources from './bookmarked-resources';

export default function MyProgressPage() {
  return (
    <div className="container mx-auto p-0">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary-foreground tracking-tight">My Progress</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Track your bookmarked resources and update your progress with applications here. All data is saved in your browser and is not shared.
        </p>
      </header>
      <BookmarkedResources />
    </div>
  );
}
