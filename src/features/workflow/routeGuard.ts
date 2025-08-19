'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { WORKFLOW_STEPS, STEP_STATUS } from './constants';
import { useWorkflowStep } from './hook';

export function useWorkflowGuard(onStep2Back?: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const { stepStatuses } = useWorkflowStep();

  // Route protection (typing URL directly, programmatic nav)
  useEffect(() => {
    const currentStep = WORKFLOW_STEPS.find((s) => s.route === pathname);
    if (!currentStep) return;

    const status = stepStatuses[currentStep.id];
    if (status === STEP_STATUS.LOCKED) {
      const fallback = WORKFLOW_STEPS.find((s) => stepStatuses[s.id] !== STEP_STATUS.LOCKED);
      if (fallback) router.replace(fallback.route);
    }
  }, [pathname, stepStatuses, router]);

  // Browser back button handling (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const step2 = WORKFLOW_STEPS.find((s) => s.id === 'step2');
      if (pathname === step2?.route && onStep2Back) {
        // Intercept back action
        onStep2Back();

        // Cancel back navigation by pushing the same route again
        router.push(step2.route);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathname, router, onStep2Back]);
}
