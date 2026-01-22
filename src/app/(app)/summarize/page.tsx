import SummarizeForm from './summarize-form';

export default function SummarizePage() {
  return (
    <div className="container mx-auto p-0">
      <header className="mb-8 border-b pb-8">
        <h1 className="text-4xl font-headline font-bold text-foreground tracking-tight">Simplify Complex Information</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
          Paste any complex text, like government guidelines or program eligibility rules, below to get a clear and simple summary.
        </p>
      </header>
      <SummarizeForm />
    </div>
  );
}
