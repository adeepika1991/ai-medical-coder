'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';
import { tokens } from '@/design-system/tokens';
import { CheckCircle, XCircle } from 'lucide-react';

const PreviewContainer = styled(Card)`
  position: relative;
  overflow: hidden;
  isolation: isolate;

  /* Gradient background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary[500]}20 0%,
      ${({ theme }) => theme.colors.secondary[500]}10 100%
    );
    border-radius: ${tokens.radii['2xl']};
    z-index: -2;
  }

  /* Animated border effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${tokens.radii['2xl']};
    padding: ${tokens.borderWidth.thick};
    background: linear-gradient(
      45deg,
      ${({ theme }) => theme.colors.primary[500]},
      ${({ theme }) => theme.colors.secondary[500]},
      ${({ theme }) => theme.colors.primary[500]}
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 0.5;
    animation: shimmer 3s linear infinite;
  }

  /* Shine effect */
  .shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-20deg);
    z-index: -1;
    opacity: 0;
  }

  &:hover .shine {
    animation: shine 1.5s ease-out infinite;
    opacity: 1;
  }

  @keyframes shimmer {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 200% 50%;
    }
  }

  @keyframes shine {
    0% {
      left: -100%;
    }
    100% {
      left: 150%;
    }
  }
`;

const PreviewHeader = styled.div`
  margin-bottom: ${tokens.spacing.lg};
`;

const PreviewTitle = styled.h3`
  font-size: ${tokens.fontSize.lg};
  font-weight: ${tokens.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${tokens.spacing.sm};
`;

const SOAPPreview = styled.div`
  background-color: ${({ theme }) => theme.colors.background}40;
  border: ${tokens.borderWidth.thin} solid ${({ theme }) => theme.colors.border}60;
  border-radius: ${tokens.radii.lg};
  padding: ${tokens.spacing.lg};
  margin-bottom: ${tokens.spacing.lg};
  font-size: ${tokens.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${tokens.lineHeight.relaxed};
`;

const CodeSuggestions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.md};
  margin-bottom: ${tokens.spacing.lg};
`;

const CodeCard = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.background}60;
  border: ${tokens.borderWidth.thin} solid ${({ theme }) => theme.colors.border}40;
  border-radius: ${tokens.radii.lg};
  padding: ${tokens.spacing.md};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.primary[500]},
      ${({ theme }) => theme.colors.secondary[500]}
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const CodeInfo = styled.div`
  flex: 1;
`;

const CodeLabel = styled.div`
  font-weight: ${tokens.fontWeight.medium};
  font-size: ${tokens.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const CodeDescription = styled.div`
  font-size: ${tokens.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${tokens.spacing.xs};
`;

const CodeActions = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${tokens.radii.md};
  cursor: pointer;
  transition: ${tokens.transitions.all};

  &.accept {
    background-color: ${({ theme }) => theme.colors.success[100]};
    color: ${({ theme }) => theme.colors.success[600]};

    &:hover {
      background-color: ${({ theme }) => theme.colors.success[200]};
    }
  }

  &.reject {
    background-color: ${({ theme }) => theme.colors.error[100]};
    color: ${({ theme }) => theme.colors.error[600]};

    &:hover {
      background-color: ${({ theme }) => theme.colors.error[200]};
    }
  }

  &.pending {
    background-color: ${({ theme }) => theme.colors.warning[100]};
    color: ${({ theme }) => theme.colors.warning[600]};
  }
`;

const PreviewActions = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
`;

const mockCodes = [
  { code: 'M79.3', description: 'Panniculitis, unspecified', type: 'ICD' },
  { code: '99213', description: 'Office visit, established patient', type: 'CPT' },
  { code: 'J7050', description: 'Normal saline solution, 1000 cc', type: 'HCPCS' },
];

export const GlassmorphicPreviewCard: React.FC = () => {
  return (
    <PreviewContainer variant="glass" padding="lg" enableHover={true}>
      {/* Shine effect element */}
      <div className="shine" />

      <PreviewHeader>
        <PreviewTitle>AI Medical Coding Preview</PreviewTitle>
      </PreviewHeader>

      <SOAPPreview>
        <strong>SOAP Note:</strong>
        <br />
        Patient presents with localized swelling and tenderness in the subcutaneous tissue of the
        left forearm. Physical examination reveals...
      </SOAPPreview>

      <CodeSuggestions>
        {mockCodes.map((code, index) => (
          <CodeCard
            key={code.code}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              y: -2,
              boxShadow: tokens.elevation.md,
            }}
          >
            <CodeInfo>
              <CodeLabel>
                {code.code} ({code.type})
              </CodeLabel>
              <CodeDescription>{code.description}</CodeDescription>
            </CodeInfo>

            <CodeActions>
              <ActionButton
                className="accept"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <CheckCircle size={16} />
              </ActionButton>
              <ActionButton
                className="reject"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XCircle size={16} />
              </ActionButton>
            </CodeActions>
          </CodeCard>
        ))}
      </CodeSuggestions>

      <PreviewActions>
        <Button variant="primary" size="sm" fullWidth>
          Finalize Codes
        </Button>
        <Button variant="outline" size="sm" fullWidth>
          Edit Note
        </Button>
      </PreviewActions>
    </PreviewContainer>
  );
};
