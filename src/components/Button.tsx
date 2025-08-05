'use client';

import type React from 'react';
import styled, { css } from 'styled-components';
import { motion, HTMLMotionProps } from 'framer-motion';
import { tokens } from '@/design-system/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface CustomButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

type ButtonProps = CustomButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  HTMLMotionProps<'button'>;

// ----- Variant Styles -----
const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.primary[600]};
        color: white;
        border: ${tokens.borderWidth.thin} solid ${({ theme }) => theme.colors.primary[600]};

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[700]};
          border-color: ${({ theme }) => theme.colors.primary[700]};
        }

        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[800]};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.secondary[100]};
        color: ${({ theme }) => theme.colors.secondary[900]};
        border: ${tokens.borderWidth.thin} solid ${({ theme }) => theme.colors.secondary[200]};

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.secondary[200]};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.primary[600]};
        border: ${tokens.borderWidth.thin} solid ${({ theme }) => theme.colors.primary[600]};

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[50]};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.text};
        border: ${tokens.borderWidth.thin} solid transparent;

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.surfaceHover};
        }
      `;
  }
};

// ----- Size Styles -----
const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${tokens.spacing.sm} ${tokens.spacing.md};
        font-size: ${tokens.fontSize.sm};
        border-radius: ${tokens.radii.md};
      `;
    case 'md':
      return css`
        padding: ${tokens.spacing.md} ${tokens.spacing.lg};
        font-size: ${tokens.fontSize.base};
        border-radius: ${tokens.radii.lg};
      `;
    case 'lg':
      return css`
        padding: ${tokens.spacing.lg} ${tokens.spacing.xl};
        font-size: ${tokens.fontSize.lg};
        border-radius: ${tokens.radii.xl};
      `;
  }
};

// ----- Styled Button -----
const StyledButton = styled(motion.button)<CustomButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${tokens.spacing.sm};
  font-weight: ${tokens.fontWeight.medium};
  transition: ${tokens.transitions.all};
  cursor: pointer;
  position: relative;

  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'md' }) => getSizeStyles(size)}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: ${tokens.opacity[50]};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

// ----- Button Component -----
export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...rest
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      {...rest}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
          }}
        />
      )}
      {children}
    </StyledButton>
  );
};
