// HowItWorksSection.tsx
'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styled from 'styled-components';
import AppIcon from './AppIcon';
import { tokens } from '@/design-system/tokens';
import type { IconNames } from './AppIcon';

type ColorKey = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray' | 'gold';

// Main Section
const HowItWorksSectionWrapper = styled.section`
  padding: ${tokens.spacing['5xl']} 0;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.background},
    ${({ theme }) => `${theme.colors.gray[100]}22`} /* from-background to-muted/20 */
  );
`;

// Container
const HowItWorksContainer = styled.div`
  max-width: 1440px; /* max-w-7xl ≈ 80rem */
  margin: 0 auto;
  padding: 0 ${tokens.spacing.lg}; /* px-6 */
`;

// Section Header
const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: ${tokens.spacing['4xl']};
`;

// Badge (How It Works)
const StepBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border-radius: ${tokens.radii.full};
  background-color: ${({ theme }) => `${theme.colors.primary[500]}1A`}; /* bg-primary/10 */
  color: ${({ theme }) => theme.colors.primary[600]};
  border: 1px solid ${({ theme }) => `${theme.colors.primary[500]}33`}; /* border-primary/20 */
  margin-bottom: ${tokens.spacing['2xl']};

  svg {
    color: ${({ theme }) => theme.colors.gold?.[500] || '#FFD700'}; /* Use gold if available */
    margin-right: ${tokens.spacing.xs};
  }
`;

// Main Heading
const SectionTitle = styled.h2`
  font-size: ${tokens.fontSize['4xl']};
  line-height: 1.2;
  font-weight: ${tokens.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${tokens.spacing.lg};

  /* Responsive */
  @media (min-width: ${tokens.breakpoints.lg}) {
    font-size: ${tokens.fontSize['5xl']};
  }

  /* Gradient text: "Billing Codes" */
  > span {
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.primary[500]},
      ${({ theme }) => theme.colors.secondary[500]}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

// Subtitle
const SectionSubtitle = styled.p`
  font-size: ${tokens.fontSize.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${tokens.lineHeight.relaxed};
  max-width: 768px; /* max-w-3xl */
  margin: 0 auto;
`;

// Steps Grid
const StepsGrid = styled(motion.div)`
  display: grid;
  gap: ${tokens.spacing['3xl']};

  @media (min-width: ${tokens.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
  }

  @media (min-width: ${tokens.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr); /* lg:grid-cols-4 */
  }
`;

// Step Item (Wrapper)
const StepItem = styled(motion.div)`
  position: relative;
  z-index: 10;

  /* Connection Line (Desktop) */
  &::after {
    content: '';
    position: absolute;
    top: ${tokens.spacing['4xl']}; /* ~64px, align with icon */
    left: 100%;
    width: ${tokens.spacing.xl}; /* w-8 */
    height: 1px;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.border}, transparent);
    opacity: 0;

    @media (min-width: ${tokens.breakpoints.lg}) {
      opacity: 1;
    }
  }
`;

// Step Card
const StepCard = styled.div<{ $color: ColorKey }>`
  position: relative;
  background: ${({ theme }) => `${theme.colors.surface}CC`}; /* bg-card/80 */
  backdrop-filter: blur(8px);
  border: 1px solid ${({ theme }) => `${theme.colors.border}80`}; /* border-border/50 */
  border-radius: ${tokens.radii['3xl']}; /* rounded-2xl → ~1rem, use 3xl for 1.5rem */
  padding: ${tokens.spacing.xl};
  height: 100%;
  transition: all 300ms ease;

  &:hover {
    box-shadow: ${tokens.elevation.md};
    border-color: ${({ theme, $color }) => `${theme.colors[$color][400]}50`};
  }

  /* Hover Glow Effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${tokens.radii['3xl']};
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme, $color }) => `${theme.colors[$color][400]}10`},
      transparent
    );
    opacity: 0;
    transition: opacity 300ms ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

// Step Icon Container
const StepIconWrapper = styled.div<{ $color: ColorKey }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: ${tokens.radii.lg};
  background: ${({ theme, $color }) => `${theme.colors[$color][500]}1A`}; /* bg-color/10 */
  border: 1px solid ${({ theme, $color }) => `${theme.colors[$color][500]}33`}; /* border-color/20 */
  transition: transform 300ms ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    color: ${({ theme, $color }) => theme.colors[$color][600]};
  }
`;

// Step Number Badge
const StepNumber = styled.div<{ $color: ColorKey }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${tokens.radii.full};
  background: ${({ theme, $color }) => `${theme.colors[$color][500]}20`}; /* bg-color/20 */
`;

// Step Title
const StepTitle = styled.h3`
  font-size: ${tokens.fontSize.lg};
  font-weight: ${tokens.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  transition: color 300ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

// Step Description
const StepDescription = styled.p`
  font-size: ${tokens.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${tokens.lineHeight.relaxed};
`;

// Progress Bar (Animated)
const StepProgressBar = styled(motion.div)<{ $color: ColorKey }>`
  height: 4px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    ${({ theme, $color }) => theme.colors[$color][500]},
    ${({ theme, $color }) => `${theme.colors[$color][500]}80`}
  );
`;

const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const steps: {
    id: number;
    icon: IconNames; // ✅ Now enforced
    title: string;
    description: string;
    color: 'primary' | 'secondary' | 'warning' | 'success';
    delay: number;
  }[] = [
    {
      id: 1,
      icon: 'FileText',
      title: 'Paste SOAP Notes',
      description:
        'Simply copy and paste your clinical SOAP notes into our secure editor. Our system accepts any format and automatically processes the content.',
      color: 'primary',
      delay: 0.1,
    },
    {
      id: 2,
      icon: 'Brain',
      title: 'AI Generates Codes',
      description:
        'Our advanced AI analyzes your notes and generates accurate ICD, CPT, and HCPCS codes with confidence scoring in seconds.',
      color: 'secondary',
      delay: 0.2,
    },
    {
      id: 3,
      icon: 'CheckCircle',
      title: 'Review Suggestions',
      description:
        'Review AI-generated codes with confidence scores. Accept, reject, or modify suggestions with detailed reasoning for optimal accuracy.',
      color: 'warning',
      delay: 0.3,
    },
    {
      id: 4,
      icon: 'Download',
      title: 'Export Results',
      description:
        'Download billing-ready codes in JSON format or copy to clipboard. Seamlessly push directly to insurance systems with one click.',
      color: 'success',
      delay: 0.4,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <HowItWorksSectionWrapper ref={sectionRef}>
      <HowItWorksContainer>
        {/* Header */}
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <StepBadge>
            <AppIcon name="Workflow" size={16} />
            <span>How It Works</span>
          </StepBadge>

          <SectionTitle>
            From SOAP Notes to <span>Billing Codes</span> in 4 Simple Steps
          </SectionTitle>

          <SectionSubtitle>
            Our streamlined workflow transforms your clinical documentation into accurate,
            billing-ready medical codes with AI precision and human oversight.
          </SectionSubtitle>
        </SectionHeader>

        {/* Steps */}
        <StepsGrid
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {steps.map((step) => (
            <StepItem key={step.id} variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <StepCard $color={step.color}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: tokens.spacing.md,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
                      <StepIconWrapper $color={step.color}>
                        <AppIcon name={step.icon} size={24} />
                      </StepIconWrapper>
                      <StepNumber $color={step.color}>
                        <span
                          style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'inherit' }}
                        >
                          {step.id}
                        </span>
                      </StepNumber>
                    </div>
                  </div>

                  <div>
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </div>

                  <StepProgressBar
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '100%' } : { width: 0 }}
                    transition={{ duration: 1, delay: step.delay + 0.5 }}
                    $color={step.color}
                  />
                </div>
              </StepCard>
            </StepItem>
          ))}
        </StepsGrid>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: tokens.spacing['4xl'] }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: tokens.spacing.xs,
              color: 'var(--text-muted)',
            }}
          >
            <AppIcon name="Clock" size={16} />
            <span style={{ fontSize: tokens.fontSize.sm, color: 'inherit' }}>
              Average processing time: {'<'} 30 seconds
            </span>
          </div>
        </motion.div>
      </HowItWorksContainer>
    </HowItWorksSectionWrapper>
  );
};

export default HowItWorksSection;
