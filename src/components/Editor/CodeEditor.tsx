'use client';

import React, { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import type * as monacoEditor from 'monaco-editor';
import { useProjectStore } from '@/lib/stores/projectStore';
import { useEditorStore } from '@/lib/stores/editorStore';

const languageMap: Record<string, string> = {
  'html': 'html',
  'css': 'css',
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'vue': 'html',
  'svelte': 'html',
};

function getLanguage(filename: string): string {
  const ext = filename.split('.').pop() || '';
  return languageMap[ext] || 'plaintext';
}

export function CodeEditor() {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const { currentProject, updateFile } = useProjectStore();
  const { addConsoleMessage } = useEditorStore();

  const currentFile = currentProject?.files[currentProject.activeFile];

  // Update editor content when file changes
  useEffect(() => {
    if (editorRef.current && currentFile) {
      // Force update the editor content when file changes
      const currentValue = editorRef.current.getValue();
      if (currentValue !== currentFile.content) {
        editorRef.current.setValue(currentFile.content);
      }
    }
  }, [currentProject?.activeFile, currentFile?.content]);

  // Also update when switching projects
  useEffect(() => {
    if (editorRef.current && currentFile) {
      editorRef.current.setValue(currentFile.content);
    }
  }, [currentProject?.id]);

  const handleEditorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    
    // Configure Monaco Editor
    monaco.editor.defineTheme('landing-ai-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7C7C7C' },
        { token: 'keyword', foreground: 'C792EA' },
        { token: 'string', foreground: 'C3E88D' },
        { token: 'number', foreground: 'F78C6C' },
        { token: 'type', foreground: '82AAFF' },
        { token: 'function', foreground: '82AAFF' },
      ],
      colors: {
        'editor.background': '#0D1117',
        'editor.foreground': '#E6EDF3',
        'editor.lineHighlightBackground': '#161B22',
        'editor.selectionBackground': '#264F78',
        'editorCursor.foreground': '#E6EDF3',
        'editorLineNumber.foreground': '#7D8590',
        'editorLineNumber.activeForeground': '#E6EDF3',
      },
    });

    monaco.editor.setTheme('landing-ai-dark');

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      addConsoleMessage({
        type: 'info',
        message: '💾 File saved automatically',
      });
    });

    // Auto-save on content change
    editor.onDidChangeModelContent(() => {
      if (currentProject && currentFile) {
        const value = editor.getValue();
        // Avoid infinite loops by checking if content actually changed
        if (value !== currentFile.content) {
          updateFile(currentProject.activeFile, value);
        }
      }
    });
  };

  if (!currentProject || !currentFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0D1117] text-[#E6EDF3]">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-lg mb-2">Welcome to LandingAI</p>
          <p className="text-muted-foreground">Select a framework to start coding</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* File Tab */}
      <div className="flex items-center border-b border-border bg-muted/50">
        <div className="flex items-center gap-2 px-4 py-2 bg-background border-r border-border">
          <span className="text-xs">{currentProject.activeFile}</span>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse-subtle" />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          key={`${currentProject.id}-${currentProject.activeFile}`} // Force remount on file change
          height="100%"
          language={getLanguage(currentProject.activeFile)}
          value={currentFile.content}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Monaco, Consolas, monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            contextmenu: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
}