import {z} from 'zod';

export const AnalyzePatientDataInputSchema = z.object({
    medicalHistory: z.string().describe("The patient's medical history."),
    symptoms: z.string().describe("The patient's reported symptoms."),
    labResults: z.string().describe("The patient's laboratory results."),
});
export type AnalyzePatientDataInput = z.infer<typeof AnalyzePatientDataInputSchema>;

export const AnalyzePatientDataOutputSchema = z.object({
    diseasePatterns: z.string().describe('Identified disease patterns and potential conditions.'),
    anomalies: z.string().describe('Highlighted anomalies in the patient data.'),
});
export type AnalyzePatientDataOutput = z.infer<typeof AnalyzePatientDataOutputSchema>;


export const RecommendRelevantDiagnosticTestsInputSchema = z.object({
  medicalHistory: z.string().describe('The patient\'s medical history.'),
  symptoms: z.string().describe('The patient\'s reported symptoms.'),
  labResults: z.string().describe('The patient\'s laboratory results.'),
  potentialConditions: z.string().describe('The identified potential conditions.'),
});
export type RecommendRelevantDiagnosticTestsInput = z.infer<typeof RecommendRelevantDiagnosticTestsInputSchema>;

export const RecommendRelevantDiagnosticTestsOutputSchema = z.object({
  recommendedTests: z.array(
    z.object({
      testName: z.string().describe('The name of the recommended diagnostic test.'),
      rationale: z.string().describe('The rationale for recommending this test.'),
      priority: z.number().describe('The priority of the test (1 being highest).'),
    })
  ).describe('A prioritized list of relevant diagnostic tests.'),
});
export type RecommendRelevantDiagnosticTestsOutput = z.infer<typeof RecommendRelevantDiagnosticTestsOutputSchema>;


export const SuggestDifferentialDiagnosesInputSchema = z.object({
  medicalHistory: z.string().describe("The patient's medical history."),
  symptoms: z.string().describe("The patient's reported symptoms."),
  labResults: z.string().describe("The patient's laboratory results."),
  question: z.string().optional().describe("A clarifying question from the user to refine a diagnosis."),
});
export type SuggestDifferentialDiagnosesInput =
  z.infer<typeof SuggestDifferentialDiagnosesInputSchema>;

export const SuggestDifferentialDiagnosesOutputSchema = z.array(z.object({
  diagnosis: z.string().describe('A potential diagnosis.'),
  likelihood: z.number().describe('The likelihood of the diagnosis (0-1).'),
  rationale: z.string().describe('The rationale for the diagnosis.'),
  aiQuestion: z.string().optional().describe("A clarifying counter-question from the AI to the user to get more information for a more accurate diagnosis.")
})).describe('A list of potential diagnoses, ranked by likelihood.');
export type SuggestDifferentialDiagnosesOutput =
  z.infer<typeof SuggestDifferentialDiagnosesOutputSchema>;


export const SuggestPotentialTreatmentPathwaysInputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the patient.'),
  patientData: z.string().describe('The patient data including medical history, symptoms, and lab results.'),
});
export type SuggestPotentialTreatmentPathwaysInput = z.infer<typeof SuggestPotentialTreatmentPathwaysInputSchema>;

export const SuggestPotentialTreatmentPathwaysOutputSchema = z.object({
  treatmentPathways: z.array(z.string()).describe('An array of potential treatment pathways including relevant medications and therapies.'),
});
export type SuggestPotentialTreatmentPathwaysOutput = z.infer<typeof SuggestPotentialTreatmentPathwaysOutputSchema>;


export const TextToSpeechInputSchema = z.string();
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audio: z.string().describe('The base64 encoded WAV audio data URI.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
