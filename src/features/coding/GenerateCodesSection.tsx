'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';
import { Button } from '@/components/Button';
import AppIcon from '@/components/AppIcon';
import { AlertTriangle, FileText, Info, Save, Trash2, Zap } from 'lucide-react';

// ==============================
// Props Interface
// ==============================
interface GenerateCodesSectionProps {
  content: string;
  metadata: {
    patientId?: string;
    visitType?: string;
    providerName?: string;
    [key: string]: unknown;
  };
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

// ==============================
// Styled Components
// ==============================

// Main Section
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing['2xl']};
`;

// Card
const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${tokens.radii.lg};
  padding: ${tokens.spacing.lg};
`;

// Header
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
  margin-bottom: ${tokens.spacing.lg};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${tokens.radii.lg};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const Title = styled.h3`
  font-size: ${tokens.fontSize.lg};
  font-weight: ${tokens.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  font-size: ${tokens.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

// Stats Grid
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${tokens.spacing.md};

  @media (min-width: ${tokens.breakpoints.sm}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
  padding: ${tokens.spacing.md};
  background-color: ${({ theme }) => theme.colors.glass};
  border-radius: ${tokens.radii.md};
`;

const StatText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StatValue = styled.div<{ $isGood?: boolean }>`
  font-size: ${tokens.fontSize['2xl']};
  font-weight: ${tokens.fontWeight.bold};
  color: ${({ theme, $isGood }) =>
    $isGood ? theme.colors.success[600] : theme.colors.warning[600]};
`;

const StatLabel = styled.div`
  font-size: ${tokens.fontSize.xs};
  color: ${({ theme }) => theme.colors.text};
`;

const StatIcon = styled(AppIcon)`
  color: ${({ theme }) => theme.colors.text};
  flex-shrink: 0;
`;

// Validation Banner
const ValidationBanner = styled.div`
  margin-bottom: ${tokens.spacing.lg};
  padding: ${tokens.spacing.md};
  background-color: ${({ theme }) => theme.colors.warning[50]};
  border: 1px solid ${({ theme }) => theme.colors.warning[100]};
  border-radius: ${tokens.radii.md};
  display: flex;
  gap: ${tokens.spacing.sm};
`;

const ValidationContent = styled.div`
  flex: 1;
`;

const ValidationTitle = styled.h4`
  font-size: ${tokens.fontSize.sm};
  font-weight: ${tokens.fontWeight.medium};
  color: ${({ theme }) => theme.colors.warning[700]};
  margin-bottom: ${tokens.spacing.sm};
`;

const ValidationList = styled.ul`
  font-size: ${tokens.fontSize.sm};
  color: ${({ theme }) => theme.colors.warning[600]};
  list-style: none;
  margin: 0;
  padding: 0;
  line-height: 1.5;
`;

const ValidationItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${tokens.spacing.xs};
`;

const ValidationActions = styled.div`
  display: flex;
  gap: ${tokens.spacing.md};
  margin-top: ${tokens.spacing.md};
`;

// Progress Banner
const ProgressBanner = styled.div`
  margin-bottom: ${tokens.spacing.lg};
  padding: ${tokens.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${tokens.radii.md};
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.colors.primary[500]};
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  flex-shrink: 0;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ProgressContent = styled.div`
  flex: 1;
`;

const ProgressTitle = styled.h4`
  font-size: ${tokens.fontSize.sm};
  font-weight: ${tokens.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: ${tokens.spacing.xs};
`;

const ProgressText = styled.p`
  font-size: ${tokens.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const ProgressBar = styled.div`
  margin-top: ${tokens.spacing.md};
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${tokens.radii.full};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  width: 60%;
  border-radius: ${tokens.radii.full};
  animation: pulse 2s infinite;
`;

// Button Row
const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${tokens.breakpoints.sm}) {
    flex-direction: row;
    gap: ${tokens.spacing.md};
  }
`;

// Help Box
const HelpBox = styled.div`
  margin-top: ${tokens.spacing.lg};
  padding: ${tokens.spacing.md};
  background-color: ${({ theme }) => theme.colors.glass};
  border-radius: ${tokens.radii.md};
`;

const HelpContent = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
`;

const HelpText = styled.div`
  font-size: ${tokens.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

// Quick Actions
const QuickActions = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing.md};

  @media (min-width: ${tokens.breakpoints.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const WarningIcon = styled(AlertTriangle)`
  color: ${({ theme }) => theme.colors.warning[600]};
`;

const InfoIcon = styled(Info)`
  color: ${({ theme }) => theme.colors.textMuted};
`;

// ==============================
// Component
// ==============================
const GenerateCodesSection: React.FC<GenerateCodesSectionProps> = ({
  content = '',
  metadata = {},
  onGenerate,
  isGenerating = false,
  canGenerate = false,
}) => {
  const [showValidation, setShowValidation] = useState(false);

  const getWordCount = (): number => {
    const text = content?.replace(/<[^>]*>/g, '')?.trim();
    return text ? text.split(/\s+/).length : 0;
  };

  const validateContent = (): string[] => {
    const errors: string[] = [];
    const wordCount = getWordCount();

    if (wordCount < 50) {
      errors.push('SOAP note should contain at least 50 words for accurate coding');
    }

    if (!metadata?.patientId) {
      errors.push('Patient ID is required');
    }

    if (!metadata?.visitType) {
      errors.push('Visit type must be selected');
    }

    if (!metadata?.providerName) {
      errors.push('Provider name is required');
    }

    const lowerContent = content.toLowerCase();
    if (
      !lowerContent.includes('subjective') &&
      !lowerContent.includes('objective') &&
      !lowerContent.includes('assessment') &&
      !lowerContent.includes('plan')
    ) {
      errors.push(
        'Consider including SOAP format sections (Subjective, Objective, Assessment, Plan)'
      );
    }

    return errors;
  };

  const handleGenerate = () => {
    const errors = validateContent();
    if (errors.length > 0) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    onGenerate();
  };

  const handleProceedAnyway = () => {
    setShowValidation(false);
    onGenerate();
  };

  const validationErrors = validateContent();
  const wordCount = getWordCount();
  const hasGoodWordCount = wordCount >= 50;

  return (
    <Section>
      {/* Main Card */}
      <Card>
        {/* Header */}
        <Header>
          <IconWrapper>
            <AppIcon name="Brain" size={20} />
          </IconWrapper>
          <div>
            <Title>AI Code Generation</Title>
            <Description>Generate ICD, CPT, and HCPCS codes from your SOAP note</Description>
          </div>
        </Header>

        {/* Stats */}
        <StatsGrid>
          <StatBox>
            <StatIcon name="Type" size={16} />
            <StatText>
              <StatValue>{wordCount.toLocaleString()}</StatValue>
              <StatLabel>Words</StatLabel>
            </StatText>
          </StatBox>
          <StatBox>
            <StatIcon name="Hash" size={16} />
            <StatText>
              <StatValue>{content.replace(/<[^>]*>/g, '').length.toLocaleString()}</StatValue>
              <StatLabel>Characters</StatLabel>
            </StatText>
          </StatBox>
          <StatBox>
            <StatIcon name="Clock" size={16} />
            <StatText>
              <StatValue>{Math.ceil(wordCount / 200)}</StatValue>
              <StatLabel>Min Read</StatLabel>
            </StatText>
          </StatBox>
          <StatBox>
            <StatValue $isGood={hasGoodWordCount}>{hasGoodWordCount ? '✓' : '!'}</StatValue>
            <StatLabel>Quality</StatLabel>
          </StatBox>
        </StatsGrid>

        {/* Validation */}
        {showValidation && validationErrors.length > 0 && (
          <ValidationBanner>
            <WarningIcon size={20} />
            <ValidationContent>
              <ValidationTitle>Content Validation Issues</ValidationTitle>
              <ValidationList>
                {validationErrors.map((error, idx) => (
                  <ValidationItem key={idx}>
                    <span style={{ color: 'currentColor' }}>•</span>
                    <span>{error}</span>
                  </ValidationItem>
                ))}
              </ValidationList>
              <ValidationActions>
                <Button variant="outline" size="sm" onClick={() => setShowValidation(false)}>
                  Fix Issues
                </Button>
                <Button
                  //variant="warning"
                  size="sm"
                  onClick={handleProceedAnyway}
                  disabled={isGenerating}
                >
                  Proceed Anyway
                </Button>
              </ValidationActions>
            </ValidationContent>
          </ValidationBanner>
        )}

        {/* Progress */}
        {isGenerating && (
          <ProgressBanner>
            <Spinner />
            <ProgressContent>
              <ProgressTitle>Generating Medical Codes...</ProgressTitle>
              <ProgressText>
                AI is analyzing your SOAP note and generating appropriate billing codes
              </ProgressText>
            </ProgressContent>
            <ProgressBar>
              <ProgressFill />
            </ProgressBar>
          </ProgressBanner>
        )}

        {/* Buttons */}
        <ButtonRow>
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            loading={isGenerating}
            style={{ flex: 1 }}
          >
            <Zap size={16} />
            {isGenerating ? 'Generating Codes...' : 'Generate Medical Codes'}
          </Button>
          {/* <Button
            variant="outline"
            size="lg"
            onClick={() => (window.location.href = '/code-review-interface')}
            disabled={isGenerating}
            icon="Eye"
            iconPosition="left"
          >
            Review Existing
          </Button> */}
        </ButtonRow>

        {/* Help */}
        <HelpBox>
          <HelpContent>
            <InfoIcon size={16} />
            <HelpText>
              <p>
                <strong>Best Results:</strong> Include detailed SOAP format with Subjective,
                Objective, Assessment, and Plan sections.
              </p>
              <p>
                <strong>Processing Time:</strong> Code generation typically takes 10-30 seconds
                depending on note complexity.
              </p>
            </HelpText>
          </HelpContent>
        </HelpBox>
      </Card>

      {/* Quick Actions */}
      <QuickActions>
        <Button variant="ghost" size="sm" style={{ justifyContent: 'flex-start' }}>
          <Save size={16} />
          Save Draft
        </Button>
        <Button variant="ghost" size="sm" style={{ justifyContent: 'flex-start' }}>
          <FileText size={16} />
          Load Template
        </Button>
        <Button
          variant="ghost"
          size="sm"
          style={
            {
              justifyContent: 'flex-start',
              color: 'var(--error)',
              '--error': 'red',
            } as React.CSSProperties
          }
        >
          <Trash2 size={16} />
          Clear Content
        </Button>
      </QuickActions>
    </Section>
  );
};

export default GenerateCodesSection;
