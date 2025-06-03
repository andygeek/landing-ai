import { FrameworkType, ProjectFile, CompileRequest, CompileResult } from '../types';

declare global {
  interface Window {
    Babel: typeof import('@babel/standalone');
    Vue: unknown;
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
      if (!htmlFile) throw new Error('index.html is required');

      const cssFile = Object.values(files).find(f => f.name.endsWith('.css'));
      const jsxFile = Object.values(files).find(f => f.name.endsWith('.jsx') || f.name.endsWith('.tsx') || f.name.endsWith('.js'));
      if (!jsxFile) throw new Error('No React entry file found');

      if (this.needsServerCompilation(jsxFile.content, 'react')) {
        return await this.serverCompile('react', files);
      }

      let html = htmlFile.content;
      if (cssFile) {
        html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${cssFile.content}</style>`);
      }

      const code = this.transformWithBabel(jsxFile.content, ['react']);
      html = html.replace(`<script type="module" src="${jsxFile.name}"></script>`, `<script>${code}</script>`);

      return { success: true, html };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'React compilation failed',
          file: 'index.html',
        },
      };
    }
  }

  private async compileVue(files: Record<string, ProjectFile>): Promise<CompileResult> {
    try {
      const htmlFile = files['index.html'];
      if (!htmlFile) throw new Error('index.html is required');

      const cssFile = Object.values(files).find(f => f.name.endsWith('.css'));
      const vueFile = Object.values(files).find(f => f.name.endsWith('.vue'));
      const jsFile = Object.values(files).find(f => f.name.endsWith('.js'));

      if (!vueFile && !jsFile) throw new Error('No Vue entry file found');

      if (vueFile && this.needsServerCompilation(vueFile.content, 'vue')) {
        return await this.serverCompile('vue', files);
      }

      let html = htmlFile.content;
      if (cssFile) {
        html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${cssFile.content}</style>`);
      }

      let code = '';
      if (vueFile) {
        const templateMatch = vueFile.content.match(/<template>([\s\S]*?)<\/template>/);
        const scriptMatch = vueFile.content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        const template = templateMatch ? templateMatch[1].trim().replace(/`/g, '\\`') : '';
        let script = scriptMatch ? scriptMatch[1].trim() : 'export default {}';
        script = script.replace('export default', 'const App =');
        code = `${script}\nApp.template=\`${template}\`;\nVue.createApp(App).mount('#app');`;
      } else if (jsFile) {
        code = jsFile.content;
      }

      html = html.replace(`<script src="${vueFile ? vueFile.name : jsFile!.name}"></script>`, `<script>${code}</script>`);

      return { success: true, html };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Vue compilation failed',
          file: 'index.html',
        },
      };
    }
  }

  private async compileSvelte(files: Record<string, ProjectFile>): Promise<CompileResult> {
    try {
      const htmlFile = files['index.html'];
      if (!htmlFile) throw new Error('index.html is required');

      const cssFile = Object.values(files).find(f => f.name.endsWith('.css'));
      const svelteFile = Object.values(files).find(f => f.name.endsWith('.svelte'));
      const jsFile = Object.values(files).find(f => f.name.endsWith('.js'));

      if (!svelteFile && !jsFile) throw new Error('No Svelte entry file found');

      if (svelteFile && this.needsServerCompilation(svelteFile.content, 'svelte')) {
        return await this.serverCompile('svelte', files);
      }

      let html = htmlFile.content;
      if (cssFile) {
        html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${cssFile.content}</style>`);
      }

      let code = '';
      if (svelteFile) {
        const { compile } = await import('svelte/compiler');
        const compiled = compile(svelteFile.content, { format: 'esm' });
        code = `${compiled.js.code}\nconst app = new App({ target: document.getElementById('app') });`;
      } else if (jsFile) {
        code = jsFile.content;
      }

      html = html.replace(`<script src="${svelteFile ? 'main.js' : jsFile!.name}"></script>`, `<script>${code}</script>`);

      return { success: true, html };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Svelte compilation failed',
          file: 'index.html',
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

    if (framework === 'react' && !Object.keys(files).some(f => f.endsWith('.jsx') || f.endsWith('.js'))) {
      errors.push('A .jsx or .js file is required for React projects');
    }

    if (framework === 'vue' && !Object.keys(files).some(f => f.endsWith('.vue') || f.endsWith('.js'))) {
      errors.push('A .vue or .js file is required for Vue projects');
    }

    if (framework === 'svelte' && !Object.keys(files).some(f => f.endsWith('.svelte') || f.endsWith('.js'))) {
      errors.push('A .svelte or .js file is required for Svelte projects');
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