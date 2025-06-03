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
      localStorage.setItem('ai_api_key', apiKey);
    }
  }

  getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('ai_api_key');
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
      localStorage.removeItem('ai_api_key');
    }
  }

  async generateLandingPage(
    framework: FrameworkType,
    prompt: string,
    model: string,
    company: string
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
          model,
          company,
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