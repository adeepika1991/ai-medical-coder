import { WorkFlowStep, STEP_STATUS, StepStatus } from './constants';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkFlowState {
  currentStep: WorkFlowStep;
  stepStatuses: Record<WorkFlowStep, StepStatus>;
  transitionToStep: (step: WorkFlowStep) => void;
  markStepCompleted: (step: WorkFlowStep) => void;
  resetWorkFlow: () => void;
}

export const useWorkFlowStore = create<WorkFlowState>()(
  persist(
    (set) => ({
      currentStep: 'step1',
      stepStatuses: {
        step1: STEP_STATUS.UNLOCKED,
        step2: STEP_STATUS.LOCKED,
        step3: STEP_STATUS.LOCKED,
      },
      transitionToStep: (step) =>
        set((state) => {
          if (state.stepStatuses[step] === STEP_STATUS.LOCKED) return state;
          return { currentStep: step };
        }),
      markStepCompleted: (step: string) =>
        set((state) => ({
          stepStatuses: {
            ...state.stepStatuses,
            [step]: STEP_STATUS.COMPLETED,
            ...(step === 'step1' && { step2: STEP_STATUS.UNLOCKED }),
            ...(step === 'step2' && { step3: STEP_STATUS.UNLOCKED }),
          },
        })),
      resetWorkFlow: () =>
        set({
          currentStep: 'step1',
          stepStatuses: {
            step1: STEP_STATUS.UNLOCKED,
            step2: STEP_STATUS.LOCKED,
            step3: STEP_STATUS.LOCKED,
          },
        }),
    }),
    { name: 'workflow-storage' }
  )
);
