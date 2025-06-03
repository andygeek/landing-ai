'use client';

import React from 'react';
import { Play, Save, Download, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useProjectStore } from '@/lib/stores/projectStore';
import { useEditorStore } from '@/lib/stores/editorStore';
import { useRouter } from 'next/navigation';
import { APP_VERSION } from '@/lib/version';

export function Header() {
  const router = useRouter();
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

  const handleBackToHome = () => {
    if (window.confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
      router.push('/');
    }
  };

  // Get framework display info
  const getFrameworkInfo = () => {
    if (!currentProject) return null;
    
    const frameworkMap = {
      vanilla: { name: 'Vanilla JS', icon: '⚡' },
      react: { name: 'React', icon: '⚛️' },
      vue: { name: 'Vue.js', icon: '💚' },
      svelte: { name: 'Svelte', icon: '🔥' }
    };
    
    return frameworkMap[currentProject.framework] || frameworkMap.vanilla;
  };

  const frameworkInfo = getFrameworkInfo();

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LA</span>
            </div>
            <h1 className="text-lg font-semibold">
              LandingAI
              <span className="ml-2 text-xs font-normal text-muted-foreground">v{APP_VERSION}</span>
            </h1>
          </div>
          
          {currentProject && (
            <>
              <div className="text-sm text-muted-foreground">
                {currentProject.name}
              </div>
              
              {frameworkInfo && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50 border border-border">
                  <span className="text-base">{frameworkInfo.icon}</span>
                  <span className="text-sm font-medium">{frameworkInfo.name}</span>
                </div>
              )}
            </>
          )}
        </div>

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
    </header>
  );
}