// ===== Updated /src/app/page.tsx =====
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Sparkles, Brain, ArrowRight, Key, Eye, EyeOff } from 'lucide-react';
import { FrameworkType } from '@/lib/types';
import { useProjectStore } from '@/lib/stores/projectStore';
import { useEditorStore } from '@/lib/stores/editorStore';
import { aiService } from '@/lib/services/aiService';
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
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState('');

  useEffect(() => {
    const savedKey = aiService.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setApiKeyError('');
    if (value.trim()) {
      aiService.setApiKey(value.trim());
    }
  };

  const handleGenerate = async () => {
    if (!selectedFramework || !prompt.trim()) return;

    if (!apiKey.trim()) {
      setApiKeyError('Please enter your OpenAI API key');
      return;
    }

    setIsGenerating(true);
    
    try {
      addConsoleMessage({
        type: 'info',
        message: `🤖 Generating landing page with ${selectedModel} using ${selectedFramework}...`,
      });

      const result = await aiService.generateLandingPage(selectedFramework, prompt, selectedModel);
      
      if (result.success && result.files) {
        const projectFiles = aiService.convertToProjectFiles(result.files);
        
        await createProject(selectedFramework, {
          id: `ai-generated-${Date.now()}`,
          name: 'AI Generated Landing',
          description: `Generated from prompt: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`,
          framework: selectedFramework,
          files: projectFiles,
          tags: ['ai-generated', selectedModel],
        });
        
        addConsoleMessage({
          type: 'success',
          message: '✨ Landing page generated successfully!',
        });
        
        router.push('/editor');
      } else {
        throw new Error(result.error || 'Failed to generate landing page content');
      }
    } catch (error) {
      addConsoleMessage({
        type: 'error',
        message: `❌ Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      
      if (error instanceof Error && (error.message.toLowerCase().includes('api key') || error.message.toLowerCase().includes('authentication'))) {
        setApiKeyError('Invalid API key or issue with authentication. Please check your OpenAI API key and try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = selectedFramework && prompt.trim().length > 10 && apiKey.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <header className="border-b border-gray-700/50 backdrop-blur bg-gray-900/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">LA</span>
            </div>
            <h1 className="text-2xl font-bold text-white">LandingAI</h1>
          </div>
        </div>
      </header>

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
                  'relative p-6 rounded-xl border-2 transition-all duration-200 text-left h-full flex flex-col',
                  'hover:shadow-xl hover:scale-105',
                  selectedFramework === framework.id
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                )}
              >
                <div className="flex items-center mb-3">
                  <div className="text-4xl mr-3">{framework.icon}</div>
                  <h4 className="text-lg font-semibold text-white">{framework.name}</h4>
                </div>
                <p className="text-sm text-gray-400 mb-3 flex-grow">{framework.description}</p>
                <ul className="space-y-1 mt-auto">
                  {framework.features.map((feature, idx) => (
                    <li key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3 text-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {selectedFramework === framework.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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
                  'hover:shadow-lg hover:scale-105 flex items-start gap-4 text-left',
                  selectedModel === model.id
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg bg-gradient-to-br text-white',
                  model.color
                )}>
                  {React.cloneElement(model.icon, { className: "w-5 h-5" })}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white">{model.name}</h4>
                  <p className="text-sm text-gray-400">{model.description}</p>
                </div>
                {selectedModel === model.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Step 3: OpenAI API Key */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">3</span>
            <Key className="w-6 h-6 mr-1" /> Enter Your OpenAI API Key
          </h3>
          <div className="max-w-xl">
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className={cn(
                  'w-full p-3 pr-12 rounded-lg border-2 bg-gray-700/50 text-white',
                  'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-transparent',
                  'transition-colors duration-200',
                  apiKeyError ? 'border-red-500 ring-red-500/50' : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                )}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-white transition-colors"
                aria-label={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {apiKeyError && (
              <p className="mt-2 text-sm text-red-400">{apiKeyError}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Your API key is stored locally in your browser and only used to communicate with the OpenAI API.
            </p>
          </div>
        </div>

        {/* Step 4: Describe Your Landing Page */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">4</span>
            Describe Your Landing Page
          </h3>
          <div className="max-w-4xl">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Create a sleek, modern landing page for a new AI-powered task management app. Features should include a hero section with a call-to-action, a benefits grid, a pricing table with three tiers, and a simple contact form. Use a dark theme with vibrant blue accents..."
              className={cn(
                'w-full h-48 p-4 rounded-lg border-2 bg-gray-700/50 text-white',
                'placeholder:text-gray-500 resize-y min-h-[120px]',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'transition-colors duration-200',
                prompt.trim() ? 'border-gray-600' : 'border-gray-700'
              )}
              maxLength={2000}
            />
            <div className="mt-2 text-sm text-gray-500 text-right">
              {prompt.length}/2000 characters
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className={cn(
              'px-10 py-4 rounded-lg font-semibold text-lg',
              'flex items-center justify-center gap-3 transition-all duration-200 transform',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              canGenerate && !isGenerating
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                : 'bg-gray-700 text-gray-400'
            )}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Generating Magic...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Landing Page
                <ArrowRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>

          {/* Helper Text */}
          {!canGenerate && !isGenerating && (
            <p className="text-center mt-6 text-gray-500">
              {!selectedFramework 
                ? 'Please select a framework to begin.'
                : !apiKey.trim()
                  ? 'Please enter your OpenAI API key to enable generation.'
                  : 'Please describe your landing page (minimum 10 characters).'}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}