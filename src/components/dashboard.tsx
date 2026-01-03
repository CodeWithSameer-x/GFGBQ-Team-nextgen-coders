"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useTransition, useState, Fragment, useRef, useEffect } from "react";

import { getAiAnalysis } from "@/app/actions";
import {
  BrainCircuit,
  FileText,
  FlaskConical,
  HeartPulse,
  Loader2,
  Stethoscope,
  RefreshCcw,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { patientDataSchema } from "@/lib/schemas";
import type { FullAnalysis } from "@/lib/types";

type FormData = z.infer<typeof patientDataSchema>;
type FormFields = keyof FormData;

export function Dashboard() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<FullAnalysis | null>(null);
  const [questions, setQuestions] = useState<Record<number, string>>({});
  const { toast } = useToast();
  const [isListening, setIsListening] = useState<FormFields | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(patientDataSchema),
    defaultValues: {
      medicalHistory: "",
      symptoms: "",
      labResults: "",
    },
  });

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
    }
  }, []);

  const handleVoiceInput = (field: FormFields) => {
    if (!recognitionRef.current) {
      toast({
        variant: "destructive",
        title: "Voice recognition not supported",
        description:
          "Your browser does not support voice recognition. Please try a different browser.",
      });
      return;
    }

    const recognition = recognitionRef.current;
  
    if (isListening) {
      recognition.stop();
      setIsListening(null);
      if (isListening === field) {
        return;
      }
    }
  
    setIsListening(field);
    recognition.start();

    let finalTranscript = form.getValues(field) || '';
  
    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      form.setValue(field, finalTranscript + (interimTranscript ? (finalTranscript ? ' ' : '') + interimTranscript : ''));
    };
  
    recognition.onend = () => {
      setIsListening(null);
    };
  
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      toast({
        variant: "destructive",
        title: "Voice Recognition Error",
        description: `An error occurred: ${event.error}`,
      });
      setIsListening(null);
    };
  };

  const handleAnalysis = (data: FormData, question?: string) => {
    startTransition(async () => {
      setResults(null);
      try {
        const analysisResults = await getAiAnalysis(data, question);
        setResults(analysisResults);
      } catch (error) {
        console.error("Analysis failed:", error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description:
            "There was an error processing the patient data. Please try again.",
        });
      }
    });
  };

  const onSubmit = (data: FormData) => {
    handleAnalysis(data);
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prev) => ({ ...prev, [index]: value }));
  };

  const handleReanalyze = (index: number) => {
    const formData = form.getValues();
    const question = questions[index];
    handleAnalysis(formData, question);
  };

  const isLoading = isPending;

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Patient Information
              </CardTitle>
              <CardDescription>
                Enter patient data to begin AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Textarea
                              placeholder="e.g., Patient is a 45-year-old male with a history of hypertension and type 2 diabetes..."
                              className="min-h-[100px] pr-10"
                              {...field}
                            />
                            <Button
                                type="button"
                                variant={isListening === 'medicalHistory' ? 'destructive' : 'ghost'}
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => handleVoiceInput('medicalHistory')}
                              >
                                <Mic className="h-4 w-4" />
                              </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptoms</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Textarea
                              placeholder="e.g., Reports chest pain, shortness of breath, and fatigue for the past 2 weeks..."
                              className="min-h-[100px] pr-10"
                              {...field}
                            />
                            <Button
                                type="button"
                                variant={isListening === 'symptoms' ? 'destructive' : 'ghost'}
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => handleVoiceInput('symptoms')}
                              >
                                <Mic className="h-4 w-4" />
                              </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="labResults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Laboratory Results</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="e.g., ECG shows ST-segment elevation. Troponin levels are elevated..."
                              className="min-h-[100px] pr-10"
                              {...field}
                            />
                            <Button
                                type="button"
                                variant={isListening === 'labResults' ? 'destructive' : 'ghost'}
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => handleVoiceInput('labResults')}
                              >
                                <Mic className="h-4 w-4" />
                              </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Analyze Patient Data
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" /> AI-Powered Analysis
              </CardTitle>
              <CardDescription>
                Disease patterns and anomalies identified by the AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading && !results && (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                </div>
              )}
              {!isLoading && !results && (
                <p className="text-center text-muted-foreground">
                  Analysis results will appear here.
                </p>
              )}
              {results?.analysis && (
                <>
                  <div>
                    <h3 className="font-semibold">Disease Patterns</h3>
                    <p className="text-sm text-muted-foreground">
                      {results.analysis.diseasePatterns}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Anomalies</h3>
                    <p className="text-sm text-muted-foreground">
                      {results.analysis.anomalies}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" /> Differential Diagnoses
              </CardTitle>
              <CardDescription>
                Potential diagnoses ranked by likelihood.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && !results && (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!isLoading && !results?.diagnoses?.length && (
                <p className="text-center text-muted-foreground">
                  Suggested diagnoses will appear here.
                </p>
              )}
              {results?.diagnoses && results.diagnoses.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">Diagnosis</TableHead>
                      <TableHead className="w-[15%] text-center">Likelihood</TableHead>
                      <TableHead>Rationale</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.diagnoses.map((diag, i) => (
                      <Fragment key={i}>
                        <TableRow>
                          <TableCell className="font-medium">
                            {diag.diagnosis}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="font-mono">
                              {(diag.likelihood * 100).toFixed(0)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {diag.rationale}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={3}>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Ask a clarifying question..."
                                value={questions[i] || ""}
                                onChange={(e) =>
                                  handleQuestionChange(i, e.target.value)
                                }
                                className="h-9"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReanalyze(i)}
                                disabled={isPending}
                              >
                                {isPending ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCcw className="mr-2 h-4 w-4" />
                                )}
                                Re-analyze
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              )}
               {isLoading && results && (
                <div className="space-y-2 pt-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" /> Recommended Tests
                </CardTitle>
                <CardDescription>
                  Prioritized list of diagnostic tests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}
                {!isLoading && !results?.tests?.recommendedTests.length && (
                  <p className="text-center text-muted-foreground">
                    Test recommendations will appear here.
                  </p>
                )}
                {results?.tests && (
                  <ul className="space-y-3">
                    {results.tests.recommendedTests.map((test, i) => (
                      <li key={i} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{test.testName}</p>
                          <Badge variant="outline">P{test.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {test.rationale}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartPulse className="h-5 w-5" /> Treatment Suggestions
                </CardTitle>
                <CardDescription>
                  Potential treatment pathways.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}
                {!isLoading &&
                  !results?.treatments?.treatmentPathways.length && (
                    <p className="text-center text-muted-foreground">
                      Treatment suggestions will appear here.
                    </p>
                  )}
                {results?.treatments && (
                  <ul className="list-disc space-y-2 pl-5">
                    {results.treatments.treatmentPathways.map(
                      (pathway, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            {pathway}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
