'use client';

import React from 'react';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';
import AppIcon from '@/components/AppIcon';
import Select from '@/components/Select';
import { useTheme } from 'styled-components';

// ==============================
// Props Interface
// ==============================
interface Metadata {
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

interface VisitMetadataProps {
  metadata: Metadata;
  onChange: (meta: Partial<Metadata>) => void;
  errors?: Record<string, string>;
  isReadOnly?: boolean;
}

// ==============================
// Styled Components
// ==============================

// Main Container
const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing['2xl']};
`;

// Section Header
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${tokens.radii.md};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const SectionTitle = styled.h3`
  font-size: ${tokens.fontSize.lg};
  font-weight: ${tokens.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const SectionDescription = styled.p`
  font-size: ${tokens.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${tokens.spacing.xs};
`;

// Section Group
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.lg};
`;

const SubsectionTitle = styled.h4`
  font-size: ${tokens.fontSize.sm};
  font-weight: ${tokens.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
`;

// Grid Layout
const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${tokens.spacing.md};

  @media (min-width: ${tokens.breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

// Read-Only Field
const ReadOnlyField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};
`;

const FieldLabel = styled.label`
  font-size: ${tokens.fontSize.sm};
  font-weight: ${tokens.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const FieldValue = styled.div`
  padding: ${tokens.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${tokens.radii.md};
  font-size: ${tokens.fontSize.base};
  color: ${({ theme }) => theme.colors.text};
  min-height: 44px;
  display: flex;
  align-items: center;
`;

// ==============================
// Component
// ==============================
const VisitMetadata: React.FC<VisitMetadataProps> = ({
  metadata = {},
  onChange,
  errors = {},
  isReadOnly = false,
}) => {
  const theme = useTheme();
  const visitTypeOptions = [
    { value: 'office-visit', label: 'Office Visit' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'annual-exam', label: 'Annual Exam' },
    { value: 'urgent-care', label: 'Urgent Care' },
    { value: 'telemedicine', label: 'Telemedicine' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'surgery', label: 'Surgery' },
  ];

  const specialtyOptions = [
    { value: 'family-medicine', label: 'Family Medicine' },
    { value: 'internal-medicine', label: 'Internal Medicine' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'emergency-medicine', label: 'Emergency Medicine' },
  ];

  const handleChange = (field: keyof Metadata, value: string) => {
    onChange({
      ...metadata,
      [field]: value,
    });
  };

  return (
    <MetadataContainer>
      {/* Header */}
      <div>
        <SectionHeader>
          <IconWrapper>
            <AppIcon name="FileText" size={20} />
          </IconWrapper>
          <div>
            <SectionTitle>Visit Information</SectionTitle>
            <SectionDescription>Patient and visit details</SectionDescription>
          </div>
        </SectionHeader>
      </div>

      {/* Patient Information */}
      <Section>
        <SubsectionTitle>
          <AppIcon name="User" size={16} style={{ marginRight: tokens.spacing.sm }} />
          Patient Information
        </SubsectionTitle>

        <FieldGrid>
          <ReadOnlyField>
            <FieldLabel>Patient ID</FieldLabel>
            <FieldValue>{metadata.patientId || '—'}</FieldValue>
          </ReadOnlyField>
          <ReadOnlyField>
            <FieldLabel>Patient Name</FieldLabel>
            <FieldValue>{metadata.patientName || '—'}</FieldValue>
          </ReadOnlyField>
        </FieldGrid>

        <FieldGrid>
          <ReadOnlyField>
            <FieldLabel>Date of Birth</FieldLabel>
            <FieldValue>{metadata.dateOfBirth || '—'}</FieldValue>
          </ReadOnlyField>
          <ReadOnlyField>
            <FieldLabel>Insurance ID</FieldLabel>
            <FieldValue>{metadata.insuranceId || '—'}</FieldValue>
          </ReadOnlyField>
        </FieldGrid>
      </Section>

      {/* Visit Details */}
      <Section>
        <SubsectionTitle>
          <AppIcon name="Calendar" size={16} style={{ marginRight: tokens.spacing.sm }} />
          Visit Details
        </SubsectionTitle>

        <FieldGrid>
          <ReadOnlyField>
            <FieldLabel>Visit Date</FieldLabel>
            <input
              type="date"
              value={metadata.visitDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => handleChange('visitDate', e.target.value)}
              disabled={isReadOnly}
              style={{
                padding: tokens.spacing.md,
                width: '100%',
                fontSize: tokens.fontSize.base,
                border: `1px solid ${errors.visitDate ? '#ef4444' : 'currentColor'}`,
                borderColor: errors.visitDate ? theme.colors.error[500] : theme.colors.border,
                borderRadius: tokens.radii.md,
                color: 'inherit',
                backgroundColor: 'transparent',
              }}
            />
            {errors.visitDate && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: tokens.fontSize.sm,
                  marginTop: tokens.spacing.xs,
                }}
              >
                {errors.visitDate}
              </div>
            )}
          </ReadOnlyField>
          <ReadOnlyField>
            <FieldLabel>Visit Time</FieldLabel>
            <input
              type="time"
              value={metadata.visitTime || ''}
              onChange={(e) => handleChange('visitTime', e.target.value)}
              disabled={isReadOnly}
              style={{
                padding: tokens.spacing.md,
                width: '100%',
                fontSize: tokens.fontSize.base,
                border: `1px solid ${errors.visitTime ? '#ef4444' : 'currentColor'}`,
                borderRadius: tokens.radii.md,
                color: 'inherit',
                backgroundColor: 'transparent',
              }}
            />
            {errors.visitTime && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: tokens.fontSize.sm,
                  marginTop: tokens.spacing.xs,
                }}
              >
                {errors.visitTime}
              </div>
            )}
          </ReadOnlyField>
        </FieldGrid>

        <Select
          label="Visit Type"
          placeholder="Select visit type"
          options={visitTypeOptions}
          value={metadata.visitType || ''}
          onChange={(value) => handleChange('visitType', value)}
          error={errors.visitType}
          disabled={isReadOnly}
          required
        />
        <Select
          label="Specialty"
          placeholder="Select specialty"
          options={specialtyOptions}
          value={metadata.specialty || ''}
          onChange={(value) => handleChange('specialty', value)}
          error={errors.specialty}
          disabled={isReadOnly}
        />
      </Section>
    </MetadataContainer>
  );
};

export default VisitMetadata;
