import type { AnalyzePatientDataOutput } from "@/ai/flows/analyze-patient-data-for-patterns";
import type { RecommendRelevantDiagnosticTestsOutput } from "@/ai/flows/recommend-relevant-diagnostic-tests";
import type { SuggestDifferentialDiagnosesOutput } from "@/ai/flows/suggest-differential-diagnoses";
import type { SuggestPotentialTreatmentPathwaysOutput } from "@/ai/flows/suggest-potential-treatment-pathways";

export type FullAnalysis = {
  analysis: AnalyzePatientDataOutput;
  diagnoses: SuggestDifferentialDiagnosesOutput;
  tests: RecommendRelevantDiagnosticTestsOutput;
  treatments: SuggestPotentialTreatmentPathwaysOutput;
};
