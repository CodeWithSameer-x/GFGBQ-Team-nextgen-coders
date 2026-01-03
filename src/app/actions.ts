
"use server";

import {
  analyzePatientDataForPatterns,
  type AnalyzePatientDataOutput,
} from "@/ai/flows/analyze-patient-data-for-patterns";
import {
  recommendRelevantDiagnosticTests,
  type RecommendRelevantDiagnosticTestsOutput,
} from "@/ai/flows/recommend-relevant-diagnostic-tests";
import {
  suggestDifferentialDiagnoses,
  type SuggestDifferentialDiagnosesOutput,
} from "@/ai/flows/suggest-differential-diagnoses";
import {
  suggestPotentialTreatmentPathways,
  type SuggestPotentialTreatmentPathwaysOutput,
} from "@/ai/flows/suggest-potential-treatment-pathways";
import { patientDataSchema } from "@/lib/schemas";
import type { FullAnalysis } from "@/lib/types";
import type { z } from "zod";

export async function getAiAnalysis(
  data: z.infer<typeof patientDataSchema>
): Promise<FullAnalysis> {
  const { medicalHistory, symptoms, labResults } = data;

  const [analysis, diagnoses] = await Promise.all([
    analyzePatientDataForPatterns({ medicalHistory, symptoms, labResults }),
    suggestDifferentialDiagnoses({ medicalHistory, symptoms, labResults }),
  ]);

  let tests: RecommendRelevantDiagnosticTestsOutput = { recommendedTests: [] };
  let treatments: SuggestPotentialTreatmentPathwaysOutput = {
    treatmentPathways: [],
  };

  if (diagnoses && diagnoses.length > 0) {
    const topDiagnosis = diagnoses[0];
    const potentialConditions = diagnoses.map((d) => d.diagnosis).join(", ");

    const [recommendedTests, suggestedTreatments] = await Promise.all([
      recommendRelevantDiagnosticTests({
        medicalHistory,
        symptoms,
        labResults,
        potentialConditions,
      }),
      suggestPotentialTreatmentPathways({
        diagnosis: topDiagnosis.diagnosis,
        patientData: JSON.stringify(data),
      }),
    ]);
    tests = recommendedTests;
    treatments = suggestedTreatments;
  }

  return {
    analysis,
    diagnoses,
    tests,
    treatments,
  };
}
