'use client';

import React from 'react';
import { Play, Save, Download, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { FrameworkSelector } from '../Framework/FrameworkSelector';
import { useProjectStore } from '@/lib/stores/projectStore';
import { useEditorStore } from '@/lib/stores/editorStore';

export function Header() {
  const { currentProject, saveProject } = useProjectStore();
  const { setCompiling, addConsoleMessage } = useEditorStore();

  const handleRun = async () => {
    if (!currentProject) return;
    
    setCompiling(true);
    addConsoleMessage({
      type: 'info',
      message: '🚀 Compiling project...',
    });

    // Simulate compilation time
    setTimeout(() => {
      setCompiling(false);
      addConsoleMessage({
        type: 'success',
        message: '✅ Project compiled successfully!',
      });
    }, 1000);
  };

  const handleSave = async () => {
    if (!currentProject) return;
    
    await saveProject(currentProject);
    addConsoleMessage({
      type: 'success',
      message: '💾 Project saved successfully!',
    });
  };

  const handleExport = () => {
    addConsoleMessage({
      type: 'info',
      message: '📦 Export feature coming soon!',
    });
  };

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LA</span>
            </div>
            <h1 className="text-lg font-semibold">LandingAI</h1>
          </div>
          
          {currentProject && (
            <div className="text-sm text-muted-foreground">
              {currentProject.name}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <FrameworkSelector />
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRun}
              disabled={!currentProject}
            >
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={!currentProject}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              disabled={!currentProject}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}