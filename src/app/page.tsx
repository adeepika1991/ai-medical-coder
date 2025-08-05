'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { tokens } from '@/design-system/tokens';
import { GlassmorphicPreviewCard } from '@/components/PreviewCard';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import HowItWorksSection from '@/components/HowItWorks';

const HeroSection = styled.section`
  padding: ${tokens.spacing['5xl']} 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing['5xl']};
  align-items: center;

  @media (min-width: ${tokens.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

// Left side content wrapper
export const HeroContent = styled(motion.div)`
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing['3xl']}; // space-y-8 ≈ 48px
`;

// Badge: AI-Powered tag
export const HeroBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  padding: ${tokens.spacing.sm} ${tokens.spacing.md}; // px-4 py-2
  border-radius: ${tokens.radii.full};
  background-color: ${({ theme }) => `${theme.colors.primary[500]}1A`}; // bg-primary/10
  color: ${({ theme }) => theme.colors.primary[600]};
  border: 1px solid ${({ theme }) => `${theme.colors.primary[500]}33`}; // border-primary/20
  font-size: ${tokens.fontSize.xs};
  font-weight: ${tokens.fontWeight.medium};
  gap: ${tokens.spacing.xs};
  align-self: flex-start;
  max-width: fit-content;
  width: auto;
  svg {
    color: ${({ theme }) => theme.colors.gold[500]};
  }
`;

// Main headline with gradient text
export const HeroHeadline = styled(motion.h1)`
  font-size: ${tokens.fontSize['5xl']};
  font-weight: ${tokens.fontWeight.bold};
  line-height: 1.1; // leading-tight
  color: ${({ theme }) => theme.colors.text};

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

  @media (min-width: ${tokens.breakpoints.md}) {
    font-size: ${tokens.fontSize['6xl']}; // lg:text-6xl
  }
`;

// Subtext
export const HeroSubtext = styled(motion.p)`
  font-size: ${tokens.fontSize.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${tokens.lineHeight.relaxed};
  max-width: 64rem; // max-w-2xl
`;

const HeroCTAs = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};

  @media (min-width: ${tokens.breakpoints.sm}) {
    flex-direction: row;
  }
`;

const HeroPreview = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FeaturesSection = styled.section`
  padding: ${tokens.spacing['5xl']} 0;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export default function HomePage() {
  return (
    <>
      <HeroSection>
        <Container>
          <HeroGrid>
            {/* Left Content */}
            <HeroContent
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Badge */}
              <HeroBadge
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  style={{ display: 'flex' }}
                >
                  <Sparkles size={16} />
                </motion.div>
                <span>AI-Powered Medical Coding</span>
              </HeroBadge>

              {/* Headline */}
              <HeroHeadline
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Transform SOAP Notes to <span>Billing Codes</span> in Seconds
              </HeroHeadline>

              {/* Subtext */}
              <HeroSubtext
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Eliminate manual medical coding friction with our AI-powered platform. Simply paste
                your SOAP notes and receive accurate ICD, CPT, and HCPCS billing codes with
                confidence scoring and streamlined review workflows.
              </HeroSubtext>

              {/* CTA Buttons */}
              <HeroCTAs
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link href="/soap-note-editor">
                  <Button size="lg">Try it Now</Button>
                </Link>
                <Link href="/soap-note-editor">
                  <Button variant="outline" size="lg">
                    See How It Works
                  </Button>
                </Link>
              </HeroCTAs>
            </HeroContent>

            <HeroPreview
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <GlassmorphicPreviewCard />
            </HeroPreview>
          </HeroGrid>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <HowItWorksSection />
        </Container>
      </FeaturesSection>
    </>
  );
}
