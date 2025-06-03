'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Sparkles, Brain, ArrowRight } from 'lucide-react';
import { FrameworkType } from '@/lib/types';
import { useProjectStore } from '@/lib/stores/projectStore';
import { useEditorStore } from '@/lib/stores/editorStore';
import { cn } from '@/lib/utils/cn';

const frameworks = [
  {
    id: 'vanilla' as FrameworkType,
    name: 'Vanilla JS',
    icon: '⚡',
    color: 'from-yellow-500 to-yellow-600',
    description: 'Pure JavaScript, HTML & CSS',
    features: ['No framework overhead', 'Direct DOM manipulation', 'Full control'],
  },
  {
    id: 'react' as FrameworkType,
    name: 'React',
    icon: '⚛️',
    color: 'from-blue-500 to-blue-600',
    description: 'Component-based UI library',
    features: ['Component reusability', 'Virtual DOM', 'Rich ecosystem'],
  },
  {
    id: 'vue' as FrameworkType,
    name: 'Vue.js',
    icon: '💚',
    color: 'from-green-500 to-green-600',
    description: 'Progressive JavaScript framework',
    features: ['Reactive data binding', 'Easy learning curve', 'Flexible architecture'],
  },
  {
    id: 'svelte' as FrameworkType,
    name: 'Svelte',
    icon: '🔥',
    color: 'from-orange-500 to-red-500',
    description: 'Compiler-based framework',
    features: ['No virtual DOM', 'Smaller bundle size', 'Built-in reactivity'],
  },
];

const aiModels = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'OpenAI\'s most capable model',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    icon: <Brain className="w-5 h-5" />,
    description: 'Google\'s latest AI model',
    color: 'from-blue-500 to-cyan-600',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { createProject } = useProjectStore();
  const { addConsoleMessage } = useEditorStore();
  
  const [selectedFramework, setSelectedFramework] = useState<FrameworkType | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedFramework || !prompt.trim()) return;

    setIsGenerating(true);
    
    // Create project with selected framework
    await createProject(selectedFramework);
    
    // Add console message about generation
    addConsoleMessage({
      type: 'info',
      message: `🤖 Generating landing page with ${selectedModel}...`,
    });
    
    // Simulate generation delay
    setTimeout(() => {
      addConsoleMessage({
        type: 'success',
        message: '✨ Landing page generated successfully!',
      });
      
      // Navigate to editor
      router.push('/editor');
    }, 1500);
  };

  const canGenerate = selectedFramework && prompt.trim().length > 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700/50 backdrop-blur bg-gray-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">LA</span>
            </div>
            <h1 className="text-2xl font-bold text-white">LandingAI</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Your Landing Page with AI
          </h2>
          <p className="text-xl text-gray-400">
            Choose your framework, describe your vision, and let AI build it for you
          </p>
        </div>

        {/* Step 1: Framework Selection */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">1</span>
            Choose Your Framework
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setSelectedFramework(framework.id)}
                className={cn(
                  'relative p-6 rounded-xl border-2 transition-all duration-200',
                  'hover:shadow-xl hover:scale-105',
                  selectedFramework === framework.id
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                )}
              >
                <div className="text-4xl mb-3">{framework.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-1">{framework.name}</h4>
                <p className="text-sm text-gray-400 mb-3">{framework.description}</p>
                <ul className="space-y-1">
                  {framework.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {selectedFramework === framework.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: AI Model Selection */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">2</span>
            Select AI Model
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {aiModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={cn(
                  'relative p-4 rounded-lg border-2 transition-all duration-200',
                  'hover:shadow-lg hover:scale-105 flex items-start gap-4',
                  selectedModel === model.id
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg bg-gradient-to-br',
                  model.color
                )}>
                  {model.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-lg font-semibold text-white">{model.name}</h4>
                  <p className="text-sm text-gray-400">{model.description}</p>
                </div>
                {selectedModel === model.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Prompt Input */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">3</span>
            Describe Your Landing Page
          </h3>
          
          <div className="max-w-4xl">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your landing page in detail. For example: 'Create a modern SaaS landing page with a hero section, features grid, pricing table, and contact form. Use a blue and purple gradient theme with smooth animations...'"
              className={cn(
                'w-full h-40 p-4 rounded-lg border-2 bg-gray-800/50 text-white',
                'placeholder:text-gray-500 resize-none',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-all duration-200',
                prompt.trim() ? 'border-gray-600' : 'border-gray-700'
              )}
            />
            <div className="mt-2 text-sm text-gray-500">
              {prompt.length}/1000 characters
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className={cn(
              'px-8 py-4 rounded-lg font-semibold text-lg',
              'flex items-center gap-3 transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              canGenerate && !isGenerating
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-700 text-gray-400'
            )}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Generating...
              </>
            ) : (
              <>
                Generate Landing Page
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Helper Text */}
        {!canGenerate && (
          <p className="text-center mt-4 text-gray-500">
            {!selectedFramework 
              ? 'Please select a framework to continue'
              : 'Please describe your landing page (minimum 10 characters)'}
          </p>
        )}
      </main>
    </div>
  );
}