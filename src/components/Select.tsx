'use client';

import React from 'react';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';
import AppIcon from '@/components/AppIcon';

// ==============================
// Props Interface
// ==============================
export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// ==============================
// Styled Components
// ==============================

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};
`;

const Label = styled.label`
  font-size: ${tokens.fontSize.sm};
  font-weight: ${tokens.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xs};
`;

const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const StyledSelect = styled.select<{
  $error: boolean;
  $disabled: boolean;
}>`
  width: 100%;
  padding: ${tokens.spacing.md};
  padding-right: ${tokens.spacing['3xl']}; /* Space for dropdown icon */
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid
    ${({ theme, $error }) => ($error ? theme.colors.error[500] : theme.colors.border)};
  border-radius: ${tokens.radii.md};
  font-size: ${tokens.fontSize.base};
  appearance: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    border-color: ${({ theme, $error }) =>
      $error ? theme.colors.error[500] : theme.colors.borderHover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $error }) =>
      $error ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 2px
      ${({ theme, $error }) =>
        $error ? `${theme.colors.error[200]}` : `${theme.colors.primary[200]}`};
  }
`;

const DropdownIcon = styled(AppIcon)`
  position: absolute;
  right: ${tokens.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.span`
  font-size: ${tokens.fontSize.sm};
  color: ${({ theme }) => theme.colors.error[600]};
  margin-top: ${tokens.spacing.xs};
`;

// ==============================
// Component
// ==============================
const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  error,
  disabled = false,
  required = false,
}) => {
  const hasValue = value != null && value !== '';
  const displayPlaceholder = !hasValue && placeholder;

  return (
    <SelectContainer>
      {label && (
        <Label>
          {label}
          {required && <RequiredAsterisk>*</RequiredAsterisk>}
        </Label>
      )}

      <SelectWrapper>
        <StyledSelect
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          $error={!!error}
          $disabled={disabled}
          disabled={disabled}
          aria-invalid={!!error}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>

        <DropdownIcon name="ChevronDown" size={16} />
      </SelectWrapper>

      {error && <ErrorText>{error}</ErrorText>}
    </SelectContainer>
  );
};

export default Select;
