'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { FileExplorer } from '@/components/Editor/FileExplorer';
import { CodeEditor } from '@/components/Editor/CodeEditor';
import { PreviewFrame } from '@/components/Preview/PreviewFrame';
import { Console } from '@/components/Preview/Console';
import { useProjectStore } from '@/lib/stores/projectStore';
import { useEditorStore } from '@/lib/stores/editorStore';
import { compilerService } from '@/lib/services/compilerService';

// Improved split pane implementation
interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSplit?: number;
  minSize?: number;
}

function SplitPane({ left, right, defaultSplit = 50, minSize = 200 }: SplitPaneProps) {
  const [split, setSplit] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const container = document.getElementById('split-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const newSplit = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Calculate minimum percentage based on container width
    const minPercent = (minSize / rect.width) * 100;
    const maxPercent = 100 - minPercent;
    
    if (newSplit >= minPercent && newSplit <= maxPercent) {
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
    <div id="split-container" className="flex h-full w-full">
      <div 
        style={{ width: `${split}%` }} 
        className="flex min-w-0"
      >
        {left}
      </div>
      <div
        className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0 relative"
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator for the handle */}
        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-current opacity-50" />
      </div>
      <div 
        style={{ width: `${100 - split}%` }} 
        className="flex min-w-0"
      >
        {right}
      </div>
    </div>
  );
}

export default function EditorPage() {
  const router = useRouter();
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);
  const { currentProject } = useProjectStore();
  const { addConsoleMessage } = useEditorStore();

  useEffect(() => {
    // If no current project, redirect to home
    if (!currentProject) {
      router.push('/');
      return;
    }

    // Initialize the compiler service
    compilerService.preloadDependencies();
    
    // Welcome message with framework info
    const frameworkNames = {
      vanilla: 'Vanilla JS',
      react: 'React',
      vue: 'Vue.js',
      svelte: 'Svelte'
    };
    
    addConsoleMessage({
      type: 'success',
      message: `🎉 Welcome to LandingAI! Building with ${frameworkNames[currentProject.framework]}.`,
    });
  }, [currentProject, router, addConsoleMessage]);

  // Show loading or redirect if no project
  if (!currentProject) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header />
      
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <SplitPane
          left={
            <div className="flex h-full w-full min-w-0">
              <FileExplorer />
              <CodeEditor />
            </div>
          }
          right={
            <div className="flex flex-col h-full w-full min-w-0">
              <PreviewFrame />
              <Console
                isCollapsed={isConsoleCollapsed}
                onToggleCollapse={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
              />
            </div>
          }
          defaultSplit={60} // 60% for left panel (editor), 40% for right panel (preview)
          minSize={300}
        />
      </div>
    </div>
  );
}