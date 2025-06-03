'use client';

import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils/cn';
import { useEditorStore } from '@/lib/stores/editorStore';
import { ConsoleMessage } from '@/lib/types';

const messageTypeStyles = {
  log: 'text-foreground',
  info: 'text-blue-400 border-l-blue-400 bg-blue-500/10',
  success: 'text-green-400 border-l-green-400 bg-green-500/10',
  warning: 'text-yellow-400 border-l-yellow-400 bg-yellow-500/10',
  error: 'text-red-400 border-l-red-400 bg-red-500/10',
};

const messageTypeIcons = {
  log: '📝',
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

interface ConsoleProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Console({ isCollapsed = false, onToggleCollapse }: ConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { consoleMessages, clearConsole } = useEditorStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleMessages]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderMessage = (message: ConsoleMessage) => {
    const icon = messageTypeIcons[message.type];
    const styles = messageTypeStyles[message.type];

    return (
      <div
        key={message.id}
        className={cn(
          'flex items-start gap-3 px-3 py-2 text-sm border-l-2 border-transparent',
          styles
        )}
      >
        <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs opacity-70 font-mono">
              {formatTimestamp(message.timestamp)}
            </span>
            {message.source && (
              <span className="text-xs opacity-50">
                [{message.source}]
              </span>
            )}
          </div>
          <div className="font-mono break-words">{message.message}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      'border-t border-border bg-[#0D1117] text-[#E6EDF3] transition-all duration-300',
      isCollapsed ? 'h-10' : 'h-48'
    )}>
      {/* Console Header */}
      <div className="h-10 border-b border-border bg-[#161B22] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span className="text-sm font-medium">Console</span>
          {consoleMessages.length > 0 && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {consoleMessages.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConsole}
            disabled={consoleMessages.length === 0}
            className="h-6 px-2 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-6 px-2"
            >
              {isCollapsed ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Console Content */}
      {!isCollapsed && (
        <div
          ref={scrollRef}
          className="h-[calc(100%-2.5rem)] overflow-y-auto custom-scrollbar"
        >
          {consoleMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Console output will appear here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-0">
              {consoleMessages.map(renderMessage)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}