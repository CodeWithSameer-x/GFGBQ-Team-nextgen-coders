import type { AnalyzePatientDataOutput, RecommendRelevantDiagnosticTestsOutput, SuggestDifferentialDiagnosesOutput, SuggestPotentialTreatmentPathwaysOutput } from "./schemas/ai-schemas";

export type FullAnalysis = {
  analysis: AnalyzePatientDataOutput;
  diagnoses: SuggestDifferentialDiagnosesOutput;
  tests: RecommendRelevantDiagnosticTestsOutput;
  treatments: SuggestPotentialTreatmentPathwaysOutput;
};
