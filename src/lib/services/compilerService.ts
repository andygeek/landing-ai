import { FrameworkType, ProjectFile, CompileRequest, CompileResult } from '../types';

declare global {
  interface Window {
    Babel: any;
    Vue: any;
  }
}

export class CompilerService {
  private static instance: CompilerService;

  static getInstance(): CompilerService {
    if (!CompilerService.instance) {
      CompilerService.instance = new CompilerService();
    }
    return CompilerService.instance;
  }

  async compile(request: CompileRequest): Promise<CompileResult> {
    try {
      switch (request.framework) {
        case 'vanilla':
          return this.compileVanilla(request.files);
        case 'react':
          return this.compileReact(request.files);
        case 'vue':
          return this.compileVue(request.files);
        case 'svelte':
          return this.compileSvelte(request.files);
        default:
          throw new Error(`Unsupported framework: ${request.framework}`);
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Compilation failed',
          file: 'unknown',
        },
      };
    }
  }

  private compileVanilla(files: Record<string, ProjectFile>): CompileResult {
    try {
      const htmlFile = files['index.html'];
      const cssFile = files['style.css'];
      const jsFile = files['script.js'];

      if (!htmlFile) {
        throw new Error('index.html is required');
      }

      let html = htmlFile.content;

      // Inject CSS
      if (cssFile) {
        html = html.replace(
          '<link rel="stylesheet" href="style.css">',
          `<style>${cssFile.content}</style>`
        );
      }

      // Inject JavaScript
      if (jsFile) {
        html = html.replace(
          '<script src="script.js"></script>',
          `<script>${jsFile.content}</script>`
        );
      }

      return {
        success: true,
        html,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Vanilla compilation failed',
          file: 'index.html',
        },
      };
    }
  }

  private async compileReact(files: Record<string, ProjectFile>): Promise<CompileResult> {
    try {
      const htmlFile = files['index.html'];
      const cssFile = files['style.css'];
      const jsFile = files['script.js'];

      if (!htmlFile || !jsFile) {
        throw new Error('index.html and script.js are required');
      }

      // Check if we need server-side compilation
      if (this.needsServerCompilation(jsFile.content, 'react')) {
        return await this.serverCompile('react', files);
      }

      // Client-side compilation with Babel
      let html = htmlFile.content;

      // Inject CSS
      if (cssFile) {
        html = html.replace(
          '<link rel="stylesheet" href="style.css">',
          `<style>${cssFile.content}</style>`
        );
      }

      // For React, we keep the Babel transformation on the client
      html = html.replace(
        '<script type="text/babel" src="script.js"></script>',
        `<script type="text/babel">${jsFile.content}</script>`
      );

      return {
        success: true,
        html,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'React compilation failed',
          file: 'script.js',
        },
      };
    }
  }

  private async compileVue(files: Record<string, ProjectFile>): Promise<CompileResult> {
    try {
      const htmlFile = files['index.html'];
      const cssFile = files['style.css'];
      const jsFile = files['script.js'];

      if (!htmlFile || !jsFile) {
        throw new Error('index.html and script.js are required');
      }

      // Vue can be compiled on client-side for simple cases
      let html = htmlFile.content;

      // Inject CSS
      if (cssFile) {
        html = html.replace(
          '<link rel="stylesheet" href="style.css">',
          `<style>${cssFile.content}</style>`
        );
      }

      // Inject JavaScript
      html = html.replace(
        '<script src="script.js"></script>',
        `<script>${jsFile.content}</script>`
      );

      return {
        success: true,
        html,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Vue compilation failed',
          file: 'script.js',
        },
      };
    }
  }

  private async compileSvelte(files: Record<string, ProjectFile>): Promise<CompileResult> {
    try {
      // Svelte always needs server-side compilation for real .svelte files
      // For demo purposes, we'll use the simulated approach
      const htmlFile = files['index.html'];
      const cssFile = files['style.css'];
      const jsFile = files['script.js'];

      if (!htmlFile || !jsFile) {
        throw new Error('index.html and script.js are required');
      }

      // Check if this needs real Svelte compilation
      if (this.needsServerCompilation(jsFile.content, 'svelte')) {
        return await this.serverCompile('svelte', files);
      }

      // Use simulated Svelte approach
      let html = htmlFile.content;

      // Inject CSS
      if (cssFile) {
        html = html.replace(
          '<link rel="stylesheet" href="style.css">',
          `<style>${cssFile.content}</style>`
        );
      }

      // Inject JavaScript
      html = html.replace(
        '<script src="script.js"></script>',
        `<script>${jsFile.content}</script>`
      );

      return {
        success: true,
        html,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Svelte compilation failed',
          file: 'script.js',
        },
      };
    }
  }

  private needsServerCompilation(code: string, framework: FrameworkType): boolean {
    // Determine if we need server-side compilation based on code complexity
    switch (framework) {
      case 'react':
        // Complex JSX or TypeScript needs server compilation
        return (
          code.includes('interface ') ||
          code.includes('type ') ||
          code.includes('import ') ||
          code.split('\n').length > 100
        );
      case 'vue':
        // Single File Components need server compilation
        return code.includes('<template>') || code.includes('<style scoped>');
      case 'svelte':
        // Real .svelte files need server compilation
        return code.includes('<script>') && code.includes('<style>');
      default:
        return false;
    }
  }

  private async serverCompile(
    framework: FrameworkType,
    files: Record<string, ProjectFile>
  ): Promise<CompileResult> {
    try {
      const response = await fetch(`/api/compile/${framework}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
      });

      if (!response.ok) {
        throw new Error(`Server compilation failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      // Fallback to client compilation
      console.warn('Server compilation failed, falling back to client compilation:', error);
      
      switch (framework) {
        case 'react':
          return this.compileReact(files);
        case 'vue':
          return this.compileVue(files);
        case 'svelte':
          return this.compileSvelte(files);
        default:
          return {
            success: false,
            error: {
              message: 'Compilation not supported',
              file: 'unknown',
            },
          };
      }
    }
  }

  // Client-side transformations
  private transformWithBabel(code: string, presets: string[] = ['react']): string {
    if (typeof window !== 'undefined' && window.Babel) {
      try {
        const result = window.Babel.transform(code, {
          presets: presets.map(preset => `@babel/preset-${preset}`),
        });
        return result.code;
      } catch (error) {
        console.error('Babel transformation failed:', error);
        return code;
      }
    }
    return code;
  }

  // Utility methods
  validateFiles(files: Record<string, ProjectFile>, framework: FrameworkType): string[] {
    const errors: string[] = [];

    if (!files['index.html']) {
      errors.push('index.html is required');
    }

    if (framework === 'react' && !files['script.js']) {
      errors.push('script.js is required for React projects');
    }

    if (framework === 'vue' && !files['script.js']) {
      errors.push('script.js is required for Vue projects');
    }

    if (framework === 'svelte' && !files['script.js']) {
      errors.push('script.js is required for Svelte projects');
    }

    return errors;
  }

  async preloadDependencies(): Promise<void> {
    // Preload Babel for React compilation
    if (typeof window !== 'undefined' && !window.Babel) {
      try {
        await this.loadScript('https://unpkg.com/@babel/standalone/babel.min.js');
      } catch (error) {
        console.warn('Failed to load Babel:', error);
      }
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }
}

// Export singleton instance
export const compilerService = CompilerService.getInstance();