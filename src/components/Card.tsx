// components/Card.tsx
'use client';

import styled, { css } from 'styled-components';
import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';
import { tokens } from '@/design-system/tokens';

// ----- Props -----
interface CustomCardProps {
  variant?: 'default' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  enableHover?: boolean; // Renamed from `hover` to avoid conflict
}

// ----- Merged Props -----
type CardProps = CustomCardProps & React.HTMLAttributes<HTMLDivElement> & HTMLMotionProps<'div'>;

// ----- Style Helpers -----
const getVariantStyles = (variant: CustomCardProps['variant']) => {
  switch (variant) {
    case 'glass':
      return css`
        background: ${({ theme }) => theme.colors.glass.background};
        border: ${tokens.borderWidth.thin} solid ${({ theme }) => theme.colors.glass.border};
        backdrop-filter: ${({ theme }) => theme.colors.glass.backdrop};
        -webkit-backdrop-filter: ${({ theme }) => theme.colors.glass.backdrop};
      `;
    default:
      return css`
        background-color: ${({ theme }) => theme.colors.surface};
        border: ${tokens.borderWidth.thin} solid ${({ theme }) => theme.colors.border};
      `;
  }
};

const getPaddingStyles = (padding: CustomCardProps['padding']) => {
  switch (padding) {
    case 'sm':
      return css`
        padding: ${tokens.spacing.lg};
      `;
    case 'lg':
      return css`
        padding: ${tokens.spacing['3xl']};
      `;
    default:
      return css`
        padding: ${tokens.spacing['2xl']};
      `;
  }
};

const BaseCard = styled(motion.div)<CustomCardProps>`
  border-radius: ${tokens.radii['2xl']};
  box-shadow: ${tokens.elevation.base};
  transition: ${tokens.transitions.all};

  ${({ variant = 'default' }) => getVariantStyles(variant)}
  ${({ padding = 'md' }) => getPaddingStyles(padding)}

  ${({ enableHover }) =>
    enableHover &&
    css`
      &:hover {
        box-shadow: ${tokens.elevation.lg};
        transform: translateY(-2px);
      }
    `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  enableHover = false,
  variant = 'default',
  padding = 'md',
  ...props
}) => {
  return (
    <BaseCard
      variant={variant}
      padding={padding}
      enableHover={enableHover}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </BaseCard>
  );
};
