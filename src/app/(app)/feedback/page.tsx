import FeedbackForm from './feedback-form';

export default function FeedbackPage() {
  return (
    <div className="container mx-auto p-0">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary-foreground tracking-tight">Submit Your Feedback</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Help us improve AccessAlly. We value your thoughts on our resources, features, and your overall experience.
        </p>
      </header>
      <FeedbackForm />
    </div>
  );
}
