'use client';

import React from 'react';
import { Container } from '@/components/Container';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';
import { useState, useEffect } from 'react';
import RichTextEditor from '@/features/coding/RichTextEditor';
import EditorStats from '@/features/coding/EditorStats';
import GenerateCodesSection from '@/features/coding/GenerateCodesSection';
import { useRouter } from 'next/navigation';
import VisitMetadata from '@/features/coding/VisitMetaData';

// ==============================
// Styled Components
// ==============================

const Title = styled.h2`
  font-size: ${tokens.fontSize['4xl']};
  font-weight: ${tokens.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${tokens.spacing.xs};
`;

const Subtitle = styled.p`
  font-size: ${tokens.fontSize.lg};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${tokens.spacing.xl};
`;

const FeaturesSection = styled.section`
  padding: ${tokens.spacing['2xl']} 0;
`;

// Styled Error Banner
const ErrorBanner = styled.div`
  margin-bottom: ${tokens.spacing['2xl']};
  padding: ${tokens.spacing.md};
  background-color: ${({ theme }) => theme.colors.error[500] + '1A'};
  border: 1px solid ${({ theme }) => theme.colors.error[500] + '33'};
  border-radius: ${tokens.radii.md};
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: ${tokens.fontSize.sm};
  line-height: 1.4;
`;

const ErrorIconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.error};
  flex-shrink: 0;
`;

// Main Grid Container
const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing['2xl']};

  @media (min-width: ${tokens.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

// Left Panel (Editor)
const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing['2xl']};
`;

// Editor Card
const EditorCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${tokens.radii.lg};
  overflow: hidden;
  box-shadow: ${tokens.elevation.sm};

  &.glass-light {
    background-color: ${({ theme }) => theme.colors.glass.background};
    border: 1px solid ${({ theme }) => theme.colors.glass.border};
    backdrop-filter: ${({ theme }) => theme.colors.glass.backdrop};
    -webkit-backdrop-filter: ${({ theme }) => theme.colors.glass.backdrop};
  }
`;

// Card Header
const CardHeader = styled.div`
  padding: ${tokens.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardTitle = styled.h2`
  font-size: ${tokens.fontSize.lg};
  font-weight: ${tokens.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${tokens.spacing.xs};
`;

const CardDescription = styled.p`
  font-size: ${tokens.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
`;

// Card Body
const CardBody = styled.div`
  padding: ${tokens.spacing.lg};
`;

// Error Message
const ErrorMessage = styled.div`
  margin-top: ${tokens.spacing.sm};
  font-size: ${tokens.fontSize.sm};
  color: ${({ theme }) => theme.colors.error[700]};
`;

// Optional: Reusable Section for GenerateCodesSection
const Section = styled.div`
  /* You can extend this for other sections */
`;

// Right Panel - Metadata
const RightPanel = styled.div`
  @media (max-width: ${tokens.breakpoints.lg}) {
    margin-top: ${tokens.spacing['2xl']};
  }
`;

// Reusable Card
const MetadataCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${tokens.radii.lg};
  padding: ${tokens.spacing.lg};
  box-shadow: ${tokens.elevation.sm};

  &.glass-light {
    background-color: ${({ theme }) => theme.colors.glass.background};
    border: 1px solid ${({ theme }) => theme.colors.glass.border};
    backdrop-filter: ${({ theme }) => theme.colors.glass.backdrop};
    -webkit-backdrop-filter: ${({ theme }) => theme.colors.glass.backdrop};
  }
`;

// ==============================
// Metadata Interface
// ==============================
interface Metadata {
  [key: string]: unknown;

  patientId?: string;
  patientName?: string;
  dateOfBirth?: string;
  insuranceId?: string;
  visitDate?: string;
  visitTime?: string;
  visitType?: string;
  providerName?: string;
  providerNPI?: string;
  specialty?: string;
  chiefComplaint?: string;
  facility?: string;
}

// ==============================
// Main Component
// ==============================
const SOAPNoteEditor = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({
    content: '',
    general: '',
  });
  const [metadata, setMetadata] = useState<Metadata>({
    patientId: '',
    patientName: '',
    dateOfBirth: '',
    insuranceId: '',
    visitDate: new Date().toISOString().split('T')[0], // ✅ Removed optional chaining
    visitTime: '',
    visitType: '',
    providerName: '',
    providerNPI: '',
    specialty: '',
    chiefComplaint: '',
    facility: '',
  });
  const [content, setContent] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (content || Object.values(metadata)?.some((value) => value)) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [content, metadata]);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('soap-note-draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setContent(parsed?.content || '');
        setMetadata(parsed?.metadata || metadata);
        setLastSaved(new Date(parsed.lastSaved));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const handleAutoSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const saveData = {
      content,
      metadata,
      lastSaved: new Date()?.toISOString(),
    };

    localStorage.setItem('soap-note-draft', JSON.stringify(saveData));
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!metadata.visitType) {
      newErrors.visitType = 'Visit type is required';
    }

    if (!content.trim()) {
      newErrors.content = 'SOAP note content is required';
    }

    const wordCount = content
      .replace(/<[^>]*>/g, '')
      .trim()
      .split(/\s+/).length;
    if (content.trim() && wordCount < 10) {
      newErrors.content = 'SOAP note should contain at least 10 words';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Fixed: Use Partial<Metadata> to match VisitMetadata onChange prop
  const handleMetadataChange = (newMeta: Partial<Metadata>) => {
    setMetadata((prev) => ({ ...prev, ...newMeta }));

    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(newMeta).forEach((key) => {
        if (next[key]) {
          delete next[key];
        }
      });
      return next;
    });
  };

  const handleGenerateCodes = async () => {
    if (!validateForm()) {
      return;
    }

    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const saveData = {
        content,
        metadata,
        lastSaved: new Date().toISOString(),
        generatedAt: new Date().toISOString(),
      };

      localStorage.setItem('soap-note-current', JSON.stringify(saveData));
      router.push('/code-review-interface');
    } catch (error) {
      console.error('Error generating codes:', error);
      setErrors({ general: 'Failed to generate codes. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = Boolean(
    content.trim().length > 0 &&
      metadata.patientId &&
      metadata.visitType &&
      metadata.providerName &&
      !isGenerating
  );

  return (
    <Container>
      <FeaturesSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title>SOAP Note Editor</Title>
            <Subtitle>
              Create and edit clinical documentation for AI-powered medical coding
            </Subtitle>
          </div>

          {errors.general && (
            <ErrorBanner>
              <ErrorText>{errors.general}</ErrorText>
            </ErrorBanner>
          )}
        </div>

        <LayoutGrid>
          {/* Left Panel - Editor */}
          <LeftPanel>
            <EditorCard className="glass-light">
              <CardHeader>
                <CardTitle>Clinical Documentation</CardTitle>
                <CardDescription>
                  Enter your SOAP note using the rich text editor below
                </CardDescription>
              </CardHeader>
              <CardBody>
                <RichTextEditor
                  content={content}
                  onChange={handleContentChange}
                  placeholder="Enter your SOAP note here...\n\nTip: Use the template button in the toolbar to get started with a structured SOAP format."
                  minHeight="500px"
                />
                {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
              </CardBody>
              <EditorStats
                content={content}
                lastSaved={lastSaved}
                autoSaveEnabled={true}
                isSaving={isSaving}
              />
            </EditorCard>

            <Section>
              <GenerateCodesSection
                content={content}
                metadata={metadata}
                onGenerate={handleGenerateCodes}
                isGenerating={isGenerating}
                canGenerate={canGenerate}
              />
            </Section>
          </LeftPanel>

          {/* Right Panel - Visit Metadata */}
          <RightPanel>
            <MetadataCard className="glass-light">
              <VisitMetadata
                metadata={metadata}
                onChange={handleMetadataChange}
                errors={errors}
                isReadOnly={false}
              />
            </MetadataCard>
          </RightPanel>
        </LayoutGrid>
      </FeaturesSection>
    </Container>
  );
};

export default SOAPNoteEditor;
