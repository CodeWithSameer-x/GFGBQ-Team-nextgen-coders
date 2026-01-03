import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-potential-treatment-pathways.ts';
import '@/ai/flows/recommend-relevant-diagnostic-tests.ts';
import '@/ai/flows/analyze-patient-data-for-patterns.ts';
import '@/ai/flows/suggest-differential-diagnoses.ts';