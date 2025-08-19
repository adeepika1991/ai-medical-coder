'use client';

import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import AppIcon from '@/components/AppIcon';
import { Button } from '@/components/Button';
import { tokens } from '@/design-system/tokens';
import styled from 'styled-components';

// Container
const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${tokens.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: ${tokens.spacing.lg};

  @media (max-width: ${tokens.breakpoints.sm}) {
    flex-wrap: wrap;
  }
`;

// Group container (e.g., formatting, lists)
const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

// Vertical divider
const Divider = styled.div`
  width: 1px;
  height: ${tokens.spacing.lg};
  background-color: ${({ theme }) => theme.colors.border};
  margin: 0 ${tokens.spacing.md};
`;

// Right-side section
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

// Icon-only button override
const IconOnlyButton = styled(Button)`
  padding: ${tokens.spacing.sm} !important;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }
`;

// Text + Icon Button (for Templates)
const TemplateButton = styled(Button)`
  font-size: ${tokens.fontSize.xs};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};

  svg {
    width: 14px;
    height: 14px;
  }
`;

// Types
interface EditorToolbarProps {
  onFormat: (command: string) => void;
  activeFormats?: string[];
  onUndo: () => void;
  onRedo: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

// Component
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onFormat,
  activeFormats = [],
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const formatButtons = [
    { name: 'bold', icon: Bold, tooltip: 'Bold (Ctrl+B)' },
    { name: 'italic', icon: Italic, tooltip: 'Italic (Ctrl+I)' },
    { name: 'underline', icon: Underline, tooltip: 'Underline (Ctrl+U)' },
    { name: 'strikethrough', icon: Strikethrough, tooltip: 'Strikethrough' },
  ] as const;

  const listButtons = [
    { name: 'insertUnorderedList', icon: List, tooltip: 'Bullet List' },
    { name: 'insertOrderedList', icon: ListOrdered, tooltip: 'Numbered List' },
  ] as const;

  const alignButtons = [
    { name: 'justifyLeft', icon: AlignLeft, tooltip: 'Align Left' },
    { name: 'justifyCenter', icon: AlignCenter, tooltip: 'Align Center' },
    { name: 'justifyRight', icon: AlignRight, tooltip: 'Align Right' },
  ] as const;

  const handleFormat = (command: string) => {
    onFormat(command);
  };

  return (
    <Toolbar role="toolbar" aria-label="Text Formatting Toolbar">
      {/* Left: Formatting Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.lg }}>
        {/* Undo/Redo */}
        <ButtonGroup>
          <IconOnlyButton
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <AppIcon name="Undo" size={16} />
          </IconOnlyButton>
          <IconOnlyButton
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <AppIcon name="Redo" size={16} />
          </IconOnlyButton>
        </ButtonGroup>

        <Divider />

        {/* Text Formatting */}
        <ButtonGroup>
          {formatButtons.map((button) => (
            <IconOnlyButton
              key={button.name}
              variant={activeFormats.includes(button.name) ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleFormat(button.name)}
              title={button.tooltip}
            >
              <button.icon size={16} />
            </IconOnlyButton>
          ))}
        </ButtonGroup>

        <Divider />

        {/* Lists */}
        <ButtonGroup>
          {listButtons.map((button) => (
            <IconOnlyButton
              key={button.name}
              variant={activeFormats.includes(button.name) ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleFormat(button.name)}
              title={button.tooltip}
            >
              <button.icon size={16} />
            </IconOnlyButton>
          ))}
        </ButtonGroup>

        <Divider />

        {/* Alignment */}
        <ButtonGroup>
          {alignButtons.map((button) => (
            <IconOnlyButton
              key={button.name}
              variant={activeFormats.includes(button.name) ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleFormat(button.name)}
              title={button.tooltip}
            >
              <button.icon size={16} />
            </IconOnlyButton>
          ))}
        </ButtonGroup>
      </div>

      {/* Right: Templates */}
      <RightSection>
        <TemplateButton variant="outline" size="sm" onClick={() => handleFormat('insertTemplate')}>
          <AppIcon name="FileText" size={14} />
          Templates
        </TemplateButton>
      </RightSection>
    </Toolbar>
  );
};

export default EditorToolbar;
