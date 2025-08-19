import { useWorkFlowStore } from './store';
import { WORKFLOW_STEPS } from './constants';

export const useWorkflowStep = () => {
  const { currentStep, stepStatuses } = useWorkFlowStore();
  const currentConfig = WORKFLOW_STEPS.find((s) => s.id === currentStep);

  return {
    currentStep,
    currentConfig,
    stepStatuses,
  };
};
