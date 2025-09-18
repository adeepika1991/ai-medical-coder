import { z } from 'zod';

const SpecialtyEnum = z.enum([
  'CARDIOLOGY',
  'DERMATOLOGY',
  'ORTHOPEDICS',
  'PEDIATRICS',
  'PSYCHIATRY',
  'FAMILY_MEDICINE',
  'INTERNAL_MEDICINE',
  'OTHER',
]);

const VisitTypeEnum = z.enum([
  'OFFICE_VISIT',
  'CONSULTATION',
  'FOLLOW_UP',
  'ANNUAL_EXAM',
  'URGENT_CARE',
  'TELEMEDICINE',
  'PROCEDURE',
  'SURGERY',
  'OTHER',
]);

export const GenerateSchema = z.object({
  soapNote: z.string().min(30, 'SOAP note too short'),
  submittedBy: z.string().email(),
  patientId: z.string().uuid().optional(),
  specialty: SpecialtyEnum.default('OTHER'),
  visitType: VisitTypeEnum.default('OTHER'),
  visitDate: z.string().datetime().optional(),
});

export const FinalizeCodesSchema = z.object({
  visitId: z.string().uuid(),
  decisions: z.array(
    z.object({
      code: z.string(),
      type: z.enum(['ICD', 'CPT', 'HCPCS']),
      decision: z.enum(['finalized', 'rejected']),
      reason: z.string().optional(),
    })
  ),
  manual: z
    .array(
      z.object({
        code: z.string(),
        type: z.enum(['ICD', 'CPT', 'HCPCS']),
        description: z.string(),
      })
    )
    .optional()
    .default([]),
  submittedBy: z.string().email().optional().default('system'),
});

export const RegenerateSchema = z.object({
  visitId: z.string().uuid(),
  regenerationReason: z.string().optional(),
  submittedBy: z.string().email().optional().default('system'),
});

export const UpdateNoteSchema = z.object({
  newNote: z.string().min(30),
  submittedBy: z.string().email().optional().default('system'),
});
