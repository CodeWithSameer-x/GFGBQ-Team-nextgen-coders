<<<<<<< HEAD
export type Resource = {
  name: string;
  description: string;
  address: string;
  contact: string;
  eligibility: string;
};

export type Bookmark = Resource & {
  id: string; // generated from resource name and address
  status: 'Not Started' | 'In Progress' | 'Completed';
=======
import type { AnalyzePatientDataOutput, RecommendRelevantDiagnosticTestsOutput, SuggestDifferentialDiagnosesOutput, SuggestPotentialTreatmentPathwaysOutput } from "./schemas/ai-schemas";

export type FullAnalysis = {
  analysis: AnalyzePatientDataOutput;
  diagnoses: SuggestDifferentialDiagnosesOutput;
  tests: RecommendRelevantDiagnosticTestsOutput;
  treatments: SuggestPotentialTreatmentPathwaysOutput;
>>>>>>> b97d77a5d12baed8376e7925d074ce89eed883b9
};
