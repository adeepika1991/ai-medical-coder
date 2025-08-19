'use client';

import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';
import EditorToolbar from './EditorToolBar';

// ==============================
// Props Interface
// ==============================
interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

// ==============================
// Styled Components
// ==============================

// Main Editor Container
const EditorContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${tokens.radii.lg};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${tokens.elevation.sm};
`;

// Editor Body (contentEditable)
const EditorBody = styled.div<{ $minHeight: string }>`
  position: relative;
  padding: ${tokens.spacing.lg};
  min-height: 400px; /* Fallback */
  min-height: ${({ $minHeight }) => $minHeight};
  font-size: ${tokens.fontSize.base};
  line-height: ${tokens.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  cursor: text;

  &:focus {
    outline: none;
  }

  /* Placeholder */
  &:empty::before {
    content: attr(data-placeholder);
    display: block;
    position: absolute;
    top: ${tokens.spacing.lg};
    left: ${tokens.spacing.lg};
    color: ${({ theme }) => theme.colors.textMuted};
    pointer-events: none;
    user-select: none;
  }

  /* Styling for content */
  p,
  div,
  br {
    margin: 0 0 ${tokens.spacing.sm} 0;
  }

  strong {
    font-weight: ${tokens.fontWeight.semibold};
  }
`;

// ==============================
// Component
// ==============================
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'Enter your SOAP note here...',
  minHeight = '400px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Sync editor content with external `content` prop
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  // Save current content to history
  const saveToHistory = (newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Handle input changes
  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      saveToHistory(newContent);
      updateActiveFormats();
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      switch (e.key) {
        case 'z':
          handleUndo();
          break;
        case 'y':
          handleRedo();
          break;
        case 'b':
          handleFormat('bold');
          break;
        case 'i':
          handleFormat('italic');
          break;
        case 'u':
          handleFormat('underline');
          break;
      }
    }
  };

  // Update active formatting (bold, italic, etc.)
  const updateActiveFormats = () => {
    const formats: string[] = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('underline')) formats.push('underline');
    if (document.queryCommandState('strikethrough')) formats.push('strikethrough');
    if (document.queryCommandState('insertUnorderedList')) formats.push('insertUnorderedList');
    if (document.queryCommandState('insertOrderedList')) formats.push('insertOrderedList');
    if (document.queryCommandState('justifyLeft')) formats.push('justifyLeft');
    if (document.queryCommandState('justifyCenter')) formats.push('justifyCenter');
    if (document.queryCommandState('justifyRight')) formats.push('justifyRight');
    setActiveFormats(formats);
  };

  // Apply formatting command
  const handleFormat = (command: string) => {
    if (command === 'insertTemplate') {
      insertTemplate();
      return;
    }

    document.execCommand(command, false, undefined);
    if (editorRef.current) editorRef.current.focus();
    updateActiveFormats();
    handleInput();
  };

  // Insert SOAP Template
  const insertTemplate = () => {
    const template = `<div><strong>SUBJECTIVE:</strong><br/>
Chief Complaint: <br/>
History of Present Illness: <br/>
Review of Systems: <br/><br/>

<strong>OBJECTIVE:</strong><br/>
Vital Signs: <br/>
Physical Examination: <br/>
Laboratory/Diagnostic Results: <br/><br/>

<strong>ASSESSMENT:</strong><br/>
Primary Diagnosis: <br/>
Secondary Diagnoses: <br/><br/>

<strong>PLAN:</strong><br/>
Treatment Plan: <br/>
Medications: <br/>
Follow-up: <br/></div>`;

    if (editorRef.current) {
      editorRef.current.innerHTML = template;
      onChange(template);
      saveToHistory(template);
      editorRef.current.focus();
      updateActiveFormats();
    }
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
      }
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const content = history[newIndex];
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
      }
    }
  };

  // Handle paste (plaintext only)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  };

  return (
    <EditorContainer>
      {/* Toolbar */}
      <EditorToolbar
        onFormat={handleFormat}
        activeFormats={activeFormats}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {/* Editor Body */}
      <div className="relative">
        <EditorBody
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          $minHeight={minHeight}
          suppressContentEditableWarning
        />
      </div>
    </EditorContainer>
  );
};

export default RichTextEditor;
