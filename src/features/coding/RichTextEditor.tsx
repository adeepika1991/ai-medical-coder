'use client';

import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { tokens } from '@/design-system/tokens';
import EditorToolbar from './EditorToolBar';
import DOMPurify from 'dompurify';

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
const EditorContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${tokens.radii.lg};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${tokens.elevation.sm};
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
`;

const EditorBody = styled.div<{ $minHeight: string }>`
  position: relative;
  padding: ${tokens.spacing.lg};
  min-height: ${({ $minHeight }) => $minHeight};
  font-size: ${tokens.fontSize.base};
  line-height: ${tokens.lineHeight.relaxed};
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  cursor: text;

  &:focus {
    outline: none;
  }

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

  p,
  div,
  br {
    margin: 0 0 ${tokens.spacing.sm} 0;
  }

  strong {
    font-weight: ${tokens.fontWeight.semibold};
  }
  em {
    font-style: italic;
  }
  u {
    text-decoration: underline;
  }
  s {
    text-decoration: line-through;
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

  // Load external content into editor
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = DOMPurify.sanitize(content);
    }
  }, [content]);

  // Save to history
  const saveToHistory = (html: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(html);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Sync on input
  const handleInput = () => {
    if (editorRef.current) {
      const clean = DOMPurify.sanitize(editorRef.current.innerHTML);
      onChange(clean);
      saveToHistory(clean);
      updateActiveFormats();
    }
  };

  // 🔑 Apply inline format (bold, italic, underline, etc.)
  const applyFormat = (tag: keyof HTMLElementTagNameMap) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return; // nothing selected

    const selectedContent = range.extractContents();
    const wrapper = document.createElement(tag);
    wrapper.appendChild(selectedContent);

    range.insertNode(wrapper);

    // move cursor after wrapper
    range.setStartAfter(wrapper);
    range.setEndAfter(wrapper);
    selection.removeAllRanges();
    selection.addRange(range);

    handleInput();
  };

  // Formatting handler (from toolbar/shortcuts)
  const handleFormat = (command: string) => {
    switch (command) {
      case 'bold':
        return applyFormat('strong');
      case 'italic':
        return applyFormat('em');
      case 'underline':
        return applyFormat('u');
      case 'strikethrough':
        return applyFormat('s');
      case 'insertTemplate':
        return insertTemplate();
      default:
        return;
    }
  };

  // Insert SOAP template
  const insertTemplate = () => {
    const template = `<div>
<strong>SUBJECTIVE:</strong><br/>
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
      const clean = DOMPurify.sanitize(template);
      editorRef.current.innerHTML = clean;
      onChange(clean);
      saveToHistory(clean);
      editorRef.current.focus();
      updateActiveFormats();
    }
  };

  // Undo/redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const html = history[newIndex];
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        onChange(html);
      }
    }
  };
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const html = history[newIndex];
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        onChange(html);
      }
    }
  };

  // Secure plain text paste
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));

    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    handleInput();
  };

  // Update active formatting (lightweight — can be improved)
  const updateActiveFormats = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const anchorNode = sel.anchorNode;
    if (!anchorNode) return;

    let node: Node | null = anchorNode.nodeType === 3 ? anchorNode.parentNode : anchorNode;
    const formats: string[] = [];

    while (node && node !== editorRef.current) {
      if (node.nodeName === 'STRONG') formats.push('bold');
      if (node.nodeName === 'EM') formats.push('italic');
      if (node.nodeName === 'U') formats.push('underline');
      if (node.nodeName === 'S') formats.push('strikethrough');
      node = node.parentNode;
    }
    setActiveFormats(formats);
  };

  return (
    <EditorContainer>
      <EditorToolbar
        onFormat={handleFormat}
        activeFormats={activeFormats}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      <div className="relative">
        <EditorBody
          ref={editorRef}
          contentEditable
          onInput={handleInput}
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
