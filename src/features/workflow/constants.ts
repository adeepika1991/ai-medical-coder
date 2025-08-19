import { FilePen, ScanSearch, FileChartColumnIncreasing } from 'lucide-react';

export const WORKFLOW_STEPS = [
  {
    id: 'step1',
    route: '/soap-note-editor',
    icon: FilePen,
    label: 'Editor',
    size: 16,
  },
  {
    id: 'step2',
    route: '/code-review',
    icon: ScanSearch,
    label: 'Review',
    size: 16,
  },
  {
    id: 'step3',
    route: '/billing-summary',
    icon: FileChartColumnIncreasing,
    label: 'Summary',
    size: 16,
  },
] as const;

export type WorkFlowStep = (typeof WORKFLOW_STEPS)[number]['id'];

export const STEP_STATUS = {
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  COMPLETED: 'completed',
} as const;

export type StepStatus = (typeof STEP_STATUS)[keyof typeof STEP_STATUS];
