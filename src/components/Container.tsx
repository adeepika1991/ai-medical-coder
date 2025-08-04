'use client';

import React from 'react';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';

const StyledContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${tokens.spacing.lg};

  @media (min-width: ${tokens.breakpoints.sm}) {
    padding: 0 ${tokens.spacing.xl};
  }

  @media (min-width: ${tokens.breakpoints.lg}) {
    padding: 0 ${tokens.spacing['2xl']};
  }
`;

export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return <StyledContainer {...props}>{children}</StyledContainer>;
};
