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
    z-index: -1;
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
    <PreviewContainer variant="glass" padding="lg">
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
