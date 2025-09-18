//Temporary

import { Prisma } from '@prisma/client';

export type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface PatientSummary {
  name: string;
  dob: Date;
  insurance: string | null;
}

// The above can also be written as follows
// import { Patient } from '@prisma/client';

// type PatientSummary = Pick<Patient, 'name' | 'dob' | 'insurance'>;

export type SOAPMatch = {
  revisionId: string;
  content: string;
  similarityScore: number;
  finalizedCodes: { code: string; codeType: string }[];
  rejectedCodes: { code: string; codeType: string; reason: string }[];
  manualCodes: { code: string; codeType: string }[];
  noteMetadata: {
    patientId: string;
    doctorId: string;
    doctorName: string;
    specialty: string;
    visitType: string;
    createdAt: Date;
  };
};

export type BoostResult = {
  match: SOAPMatch;
  boostScore: number;
  scenarioTags: string[];
};

export type PromptResolverInput = {
  currentNote: string;
  matches: BoostResult[];
  metadata: {
    patientId: string;
    providerId: string;
    specialty: string;
    visitType: string;
  };
  config?: {
    topK?: number;
    strongMatchThreshold?: number;
    conflictThreshold?: number;
    maxTokenBudget?: number;
  };
};

export type ResolvedPrompt = {
  prompt: {
    system: string;
    user: {
      currentNote: string;
      context?: {
        type: string;
        content: string;
        metadata?: Record<string, unknown>;
        score?: number;
      }[];
      warnings?: string[];
    };
  };
  promptType: PromptStyle;
  scenarioTags: string[];
  rawMatches: BoostResult[];
};

export type PromptStyle =
  | 'FIRST_NOTE'
  | 'NO_MATCH'
  | 'STRONG_SINGLE'
  | 'MULTI_MATCH'
  | 'CONFLICTING'
  | 'MANUAL_OVERRIDE'
  | 'LONGITUDINAL'
  | 'DUPLICATE'
  | 'BAD_QUALITY';

export type LLMCodeSuggestion = {
  code: string;
  codeType: 'ICD' | 'CPT' | 'HCPCS';
  confidence: number;
  reasoning?: string;
};

export type LLMOutput = {
  suggestions: LLMCodeSuggestion[];
};

// type R = Prisma.SoapNoteRevisionGetPayload<{ select: { metadata: true } }>;
