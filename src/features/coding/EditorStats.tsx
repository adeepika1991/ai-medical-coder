'use client';

import React from 'react';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';
import AppIcon from '@/components/AppIcon';
import { Check } from 'lucide-react';

// ==============================
// Props Interface
// ==============================
interface EditorStatsProps {
  content?: string;
  lastSaved?: Date | null;
  autoSaveEnabled?: boolean;
  isSaving?: boolean;
}

// ==============================
// Styled Components
// ==============================

// Main Footer Bar
const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${tokens.spacing.md};
  background-color: ${({ theme }) => theme.colors.glass.background || theme.colors.surfaceHover};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${tokens.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
`;

// Left Side: Stats List
const StatsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing['3xl']};

  @media (max-width: ${tokens.breakpoints.sm}) {
    gap: ${tokens.spacing.xl};
    flex-wrap: wrap;
  }
`;

// Single Stat Item
const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

// Icon Wrapper (for consistent styling)
const StatIcon = styled(AppIcon)`
  color: ${({ theme }) => theme.colors.text};
  flex-shrink: 0;
`;

// Warning Badge (for low word count)
const WarningBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  color: ${({ theme }) => theme.colors.warning[600]};
`;

const WarningText = styled.span`
  font-size: ${tokens.fontSize.xs};
  color: ${({ theme }) => theme.colors.warning[700]};
`;

// Right Side: Save Status
const SaveStatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xl};
`;

const SaveStatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

// Spinner (Saving Animation)
const Spinner = styled.div`
  width: 12px;
  height: 12px;
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

// Dot Indicator
const StatusDot = styled.div<{ $status: 'saving' | 'saved' | 'unsaved' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme, $status }) => {
    switch ($status) {
      case 'saving':
        return theme.colors.warning[500];
      case 'saved':
        return theme.colors.success[500];
      default:
        return theme.colors.textMuted;
    }
  }};
  animation: ${({ $status }) =>
    $status === 'saving' ? 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'};
`;

// Status Text
const StatusText = styled.span`
  font-size: ${tokens.fontSize.xs};
  color: ${({ theme }) => theme.colors.text};
`;

const SuccessIcon = styled(Check)`
  color: ${({ theme }) => theme.colors.success[500]};
`;

// ==============================
// Component
// ==============================
const EditorStats: React.FC<EditorStatsProps> = ({
  content = '',
  lastSaved = null,
  autoSaveEnabled = true,
  isSaving = false,
}) => {
  // Word count
  const getWordCount = (): number => {
    const text = content?.replace(/<[^>]*>/g, '')?.trim();
    return text ? text.split(/\s+/).length : 0;
  };

  // Character count
  const getCharacterCount = (): number => {
    return content?.replace(/<[^>]*>/g, '')?.length || 0;
  };

  // Reading time (in minutes)
  const getReadingTime = (): number => {
    const words = getWordCount();
    return Math.ceil(words / 200); // Avg 200 wpm
  };

  // Format last saved time
  const formatLastSaved = (): string => {
    if (!lastSaved) return 'Not saved';

    const now = new Date();
    const saved = new Date(lastSaved);
    // Use .getTime() to get the numeric timestamp
    const diffInMinutes = Math.floor((now.getTime() - saved.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    return saved.toLocaleDateString();
  };
  // Check if content is minimal
  const isContentMinimal = (): boolean => {
    return getWordCount() < 50;
  };

  // Determine dot status
  const dotStatus = isSaving ? 'saving' : lastSaved ? 'saved' : 'unsaved';

  return (
    <StatsBar>
      {/* Left: Content Stats */}
      <StatsGroup>
        {isContentMinimal() && (
          <WarningBadge>
            <AppIcon name="AlertTriangle" size={14} />
            <WarningText>Minimum 50 words recommended</WarningText>
          </WarningBadge>
        )}
      </StatsGroup>

      {/* Right: Save Status */}
      <SaveStatusGroup>
        {autoSaveEnabled && (
          <SaveStatusItem>
            {isSaving ? (
              <>
                <Spinner />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <SuccessIcon size={14} />
                <span>Auto-saved {formatLastSaved()}</span>
              </>
            )}
          </SaveStatusItem>
        )}

        <SaveStatusItem>
          <StatusDot $status={dotStatus} />
          <StatusText>{isSaving ? 'Saving' : lastSaved ? 'Saved' : 'Unsaved'}</StatusText>
        </SaveStatusItem>
      </SaveStatusGroup>
    </StatsBar>
  );
};

export default EditorStats;
