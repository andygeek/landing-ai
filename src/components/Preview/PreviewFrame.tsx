'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils/cn';
import { useProjectStore } from '@/lib/stores/projectStore';
import { useEditorStore } from '@/lib/stores/editorStore';
import { compilerService } from '@/lib/services/compilerService';

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

const viewportSizes = {
  mobile: { width: '375px', height: '667px', icon: Smartphone },
  tablet: { width: '768px', height: '1024px', icon: Tablet },
  desktop: { width: '100%', height: '100%', icon: Monitor },
};

export function PreviewFrame() {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [lastCompiled, setLastCompiled] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const { currentProject } = useProjectStore();
  const { previewHtml, setPreviewHtml, addConsoleMessage } = useEditorStore();

  const compileAndUpdate = async () => {
    if (!currentProject) return;

    setIsLoading(true);
    addConsoleMessage({
      type: 'info',
      message: '🔄 Compiling preview...',
    });

    try {
      const result = await compilerService.compile({
        framework: currentProject.framework,
        files: currentProject.files,
        mode: 'development',
      });

      if (result.success && result.html) {
        setPreviewHtml(result.html);
        setLastCompiled(new Date().toLocaleTimeString());
        addConsoleMessage({
          type: 'success',
          message: '✅ Preview updated successfully',
        });
      } else if (result.error) {
        addConsoleMessage({
          type: 'error',
          message: `❌ Compilation error: ${result.error.message}`,
        });
      }
    } catch (error) {
      addConsoleMessage({
        type: 'error',
        message: `❌ Failed to compile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-compile when project changes
  useEffect(() => {
    const timeoutId = setTimeout(compileAndUpdate, 500);
    return () => clearTimeout(timeoutId);
  }, [currentProject]);

  const handleRefresh = () => {
    compileAndUpdate();
  };

  const handleOpenInNewTab = () => {
    if (previewHtml) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(previewHtml);
        newWindow.document.close();
      }
    }
  };

  const ViewportIcon = viewportSizes[viewport].icon;

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background border-l border-border">
        <div className="text-center text-muted-foreground">
          <Monitor className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg mb-2">Preview</p>
          <p className="text-sm">Your project will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border-l border-border">
      {/* Preview Header */}
      <div className="h-12 border-b border-border bg-muted/30 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ViewportIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Preview</span>
            {lastCompiled && (
              <span className="text-xs text-muted-foreground">
                Last updated: {lastCompiled}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Selector */}
          <div className="flex items-center border border-border rounded-md">
            {Object.entries(viewportSizes).map(([size, config]) => {
              const IconComponent = config.icon;
              return (
                <button
                  key={size}
                  onClick={() => setViewport(size as ViewportSize)}
                  className={cn(
                    'p-2 hover:bg-accent hover:text-accent-foreground transition-colors',
                    viewport === size && 'bg-accent text-accent-foreground'
                  )}
                  title={`${size} view`}
                >
                  <IconComponent className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInNewTab}
            disabled={!previewHtml}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white p-4 overflow-auto">
        <div
          className={cn(
            'mx-auto transition-all duration-300',
            viewport !== 'desktop' && 'border border-border rounded-lg overflow-hidden shadow-lg'
          )}
          style={{
            width: viewportSizes[viewport].width,
            height: viewport !== 'desktop' ? viewportSizes[viewport].height : '100%',
            minHeight: viewport === 'desktop' ? '100%' : undefined,
          }}
        >
          {previewHtml ? (
            <iframe
              ref={iframeRef}
              srcDoc={previewHtml}
              className="w-full h-full border-none"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
              onLoad={() => {
                // Handle iframe load events
                addConsoleMessage({
                  type: 'info',
                  message: '🎯 Preview loaded',
                });
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p>Compiling...</p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-4">🚀</div>
                    <p>Start coding to see your preview</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}