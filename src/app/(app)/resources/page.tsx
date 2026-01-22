import ResourceLocator from './resource-locator';

export default function ResourceLocatorPage() {
  return (
    <div className="container mx-auto p-0">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary-foreground tracking-tight">Find Community Resources</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Enter your needs (e.g., food assistance, job training) and location to discover relevant programs and services in your community.
        </p>
      </header>
      <ResourceLocator />
    </div>
  );
}
