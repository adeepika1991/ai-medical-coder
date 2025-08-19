import React from 'react';
import { WORKFLOW_STEPS } from './constants';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { useWorkFlowStore } from './store';
import { STEP_STATUS } from './constants';

const TabBar = styled.div`
  display: none;
  gap: ${tokens.spacing.md};
  align-items: center;
  background-color: ${({ theme }) => `${theme.colors.surface}80`};
  border-radius: ${tokens.radii.lg};
  padding: ${tokens.spacing.xs};

  @media (min-width: ${tokens.breakpoints.md}) {
    display: flex;
  }
`;

const WorkFlow = () => {
  const { currentStep, stepStatuses, transitionToStep } = useWorkFlowStore();

  return (
    <TabBar>
      {WORKFLOW_STEPS.map((step) => {
        const isActive = step.id === currentStep;
        const isLocked = stepStatuses[step.id] === STEP_STATUS.LOCKED;

        return (
          <Link
            key={step.id}
            href={isLocked ? '#' : step.route}
            onClick={(e) => {
              if (isLocked) e.preventDefault();
              else transitionToStep(step.id);
            }}
          >
            <Button size="sm" variant={isActive ? 'primary' : 'secondary'} disabled={isLocked}>
              <step.icon size={step.size} />
              {step.label}
            </Button>
          </Link>
        );
      })}
    </TabBar>
  );
};

export default WorkFlow;
