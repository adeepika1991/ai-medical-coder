import { z } from 'zod';
import { DEFAULT_DOCTOR } from './doctorConfig';

export const SpecialtyEnum = z.enum([
  'CARDIOLOGY',
  'DERMATOLOGY',
  'ORTHOPEDICS',
  'PEDIATRICS',
  'PSYCHIATRY',
  'FAMILY_MEDICINE',
  'INTERNAL_MEDICINE',
  'OTHER',
]);

export const VisitTypeEnum = z.enum([
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
  soapNote: z.string().min(15, 'Note too short'),
  patientId: z.string().uuid(),
  specialty: SpecialtyEnum,
  visitType: VisitTypeEnum,
  visitDate: z.string().optional(),
  submittedBy: z.string().default(DEFAULT_DOCTOR.id),
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
