'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { FrameworkType } from '@/lib/types';
import { useProjectStore } from '@/lib/stores/projectStore';

const frameworks = [
  {
    id: 'vanilla' as FrameworkType,
    name: 'Vanilla JS',
    icon: '⚡',
    color: 'text-yellow-500',
    description: 'Pure JavaScript, HTML & CSS',
  },
  {
    id: 'vue' as FrameworkType,
    name: 'Vue.js',
    icon: '💚',
    color: 'text-green-500',
    description: 'Vue 3 with Composition API',
  },
];

export function FrameworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentProject, switchFramework } = useProjectStore();

  const currentFramework = frameworks.find(f => f.id === currentProject?.framework) || frameworks[0];

  const handleSelect = (framework: FrameworkType) => {
    switchFramework(framework);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors',
          'min-w-[140px] justify-between'
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn('text-base', currentFramework.color)}>
            {currentFramework.icon}
          </span>
          <span className="text-sm font-medium">{currentFramework.name}</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-md shadow-lg z-20 animate-fade-in">
            <div className="p-1">
              {frameworks.map((framework) => (
                <button
                  key={framework.id}
                  onClick={() => handleSelect(framework.id)}
                  className={cn(
                    'w-full flex items-start gap-3 px-3 py-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-left',
                    currentFramework.id === framework.id && 'bg-accent text-accent-foreground'
                  )}
                >
                  <span className={cn('text-lg', framework.color)}>
                    {framework.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{framework.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {framework.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}