import RecommendationsForm from './recommendations-form';

export default function RecommendationsPage() {
  return (
    <div className="container mx-auto p-0">
      <header className="mb-8 border-b pb-8">
        <h1 className="text-4xl font-headline font-bold text-foreground tracking-tight">Personalized Recommendations</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
          Tell us about yourself and your needs to receive tailored suggestions for programs and resources. The more detail you provide, the better the recommendations.
        </p>
      </header>
      <RecommendationsForm />
    </div>
  );
}
