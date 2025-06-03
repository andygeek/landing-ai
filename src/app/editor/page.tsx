'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { FileExplorer } from '@/components/Editor/FileExplorer';
import { CodeEditor } from '@/components/Editor/CodeEditor';
import { PreviewFrame } from '@/components/Preview/PreviewFrame';
import { Console } from '@/components/Preview/Console';
import { useProjectStore } from '@/lib/stores/projectStore';
import { useEditorStore } from '@/lib/stores/editorStore';
import { compilerService } from '@/lib/services/compilerService';

// Simple split pane implementation
interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSplit?: number;
  minSize?: number;
}

function SplitPane({ left, right, defaultSplit = 50, minSize = 200 }: SplitPaneProps) {
  const [split, setSplit] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const container = document.getElementById('split-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const newSplit = ((e.clientX - rect.left) / rect.width) * 100;
    
    if (newSplit >= (minSize / rect.width) * 100 && newSplit <= 100 - (minSize / rect.width) * 100) {
      setSplit(newSplit);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging]);

  return (
    <div id="split-container" className="flex h-full">
      <div style={{ width: `${split}%` }} className="flex">
        {left}
      </div>
      <div
        className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors"
        onMouseDown={handleMouseDown}
      />
      <div style={{ width: `${100 - split}%` }} className="flex">
        {right}
      </div>
    </div>
  );
}

export default function EditorPage() {
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const { createProject } = useProjectStore();
  const { addConsoleMessage } = useEditorStore();

  useEffect(() => {
    // Initialize the compiler service
    compilerService.preloadDependencies();
    
    // Create default project
    createProject('vanilla');
    
    // Welcome message
    addConsoleMessage({
      type: 'success',
      message: '🎉 Welcome to LandingAI! Start building your landing page.',
    });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex flex-col min-h-0">
        <SplitPane
          left={
            <div className="flex h-full">
              <FileExplorer />
              <CodeEditor />
            </div>
          }
          right={
            <div className="flex flex-col h-full">
              <PreviewFrame />
              <Console
                isCollapsed={isConsoleCollapsed}
                onToggleCollapse={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
              />
            </div>
          }
          defaultSplit={50}
          minSize={300}
        />
      </div>
    </div>
  );
}