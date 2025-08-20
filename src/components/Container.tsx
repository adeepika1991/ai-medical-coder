'use client';

import React from 'react';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';

const StyledContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 ${tokens.spacing.md};

  @media (min-width: ${tokens.breakpoints.sm}) {
    padding: 0 ${tokens.spacing.lg};
    max-width: 100%;
  }

  @media (min-width: ${tokens.breakpoints.lg}) {
    padding: 0 ${tokens.spacing.xl};
    max-width: 1400px;
  }
`;

export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return <StyledContainer {...props}>{children}</StyledContainer>;
};
