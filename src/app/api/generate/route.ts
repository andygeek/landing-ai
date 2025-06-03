// ===== 1. Create API Route: /src/app/api/generate/route.ts =====
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { FrameworkType } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { framework, prompt, apiKey }: { 
      framework: FrameworkType; 
      prompt: string;
      apiKey?: string;
    } = body;

    if (!framework || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Framework and prompt are required' },
        { status: 400 }
      );
    }

    const activeApiKey = apiKey || process.env.OPENAI_API_KEY;
    
    if (!activeApiKey) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key is required' },
        { status: 400 }
      );
    }

    const openaiClient = apiKey ? new OpenAI({ apiKey }) : openai;

    const systemPrompt = `You are a code assistant that generates landing page files. Generate the files for a landing page based on the user's requirements using the ${framework} framework. 

Return ONLY a valid JSON object in this exact format:
{
  "index.html": "html code here",
  "style.css": "css code here",
  "script.js": "javascript code here"
}

Framework-specific requirements:
- For vanilla: Use pure HTML, CSS, and JavaScript
- For react: Include React CDN links and use JSX with Babel standalone
- For vue: Include Vue 3 CDN and use Options API or Composition API
- For svelte: Generate Svelte-compatible vanilla JS (since we can't compile .svelte files client-side)

Make the landing page modern, responsive, and professional.`;

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Create a landing page for: ${prompt}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const generatedFiles = JSON.parse(completion.choices[0].message.content || '{}');

    if (!generatedFiles['index.html']) {
      throw new Error('Generated files must include index.html');
    }

    return NextResponse.json({
      success: true,
      files: generatedFiles,
    });
  } catch (error) {
    console.error('AI Generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate landing page',
      },
      { status: 500 }
    );
  }
}

// ===== 2. Create AI Service: /src/lib/services/aiService.ts =====
import { FrameworkType, ProjectFile } from '../types';

export interface AIGenerationResponse {
  success: boolean;
  files?: Record<string, string>;
  error?: string;
}

export class AIService {
  private static instance: AIService;
  private apiKey: string | null = null;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openai_api_key', apiKey);
    }
  }

  getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('openai_api_key');
      if (storedKey) {
        this.apiKey = storedKey;
        return storedKey;
      }
    }
    
    return null;
  }

  clearApiKey() {
    this.apiKey = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('openai_api_key');
    }
  }

  async generateLandingPage(
    framework: FrameworkType, 
    prompt: string
  ): Promise<AIGenerationResponse> {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          framework,
          prompt,
          apiKey: this.apiKey,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate landing page');
      }

      return result;
    } catch (error) {
      console.error('AI generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate landing page',
      };
    }
  }

  convertToProjectFiles(generatedFiles: Record<string, string>): Record<string, ProjectFile> {
    const projectFiles: Record<string, ProjectFile> = {};
    
    const fileTypeMap: Record<string, ProjectFile['type']> = {
      'html': 'html',
      'css': 'css',
      'js': 'js',
      'jsx': 'jsx',
      'vue': 'vue',
      'svelte': 'svelte',
    };

    for (const [filename, content] of Object.entries(generatedFiles)) {
      const extension = filename.split('.').pop() || '';
      const type = fileTypeMap[extension] || 'js';
      
      projectFiles[filename] = {
        name: filename,
        content,
        type,
        icon: this.getFileIcon(extension),
      };
    }

    return projectFiles;
  }

  private getFileIcon(extension: string): string {
    const iconMap: Record<string, string> = {
      'html': '📄',
      'css': '🎨',
      'js': '⚡',
      'jsx': '⚛️',
      'vue': '💚',
      'svelte': '🔥',
    };
    return iconMap[extension] || '📄';
  }
}

export const aiService = AIService.getInstance();