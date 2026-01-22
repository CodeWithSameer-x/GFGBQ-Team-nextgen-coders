import AssistantForm from './assistant-form';

export default function AppAssistantPage() {
  return (
    <div className="container mx-auto p-0">
      <header className="mb-8 border-b pb-8">
        <h1 className="text-4xl font-headline font-bold text-foreground tracking-tight">AI Application Assistant</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
          Get help drafting clear and effective responses for applications. Paste the question and provide some background to get a personalized draft.
        </p>
      </header>
      <AssistantForm />
    </div>
  );
}
