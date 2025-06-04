import { NextRequest, NextResponse } from 'next/server';
import { ProjectFile, FrameworkType } from '@/lib/types';
import * as Babel from '@babel/standalone';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { framework, files }: { framework: FrameworkType; files: Record<string, ProjectFile> } = body;

    if (!framework || !files) {
      return NextResponse.json(
        { success: false, error: 'Framework and files are required' },
        { status: 400 }
      );
    }

    // Route to specific framework compiler
    switch (framework) {
      case 'vue':
        return await compileVue(files);
      case 'svelte':
        return await compileSvelte(files);
      case 'react':
        return await compileReact(files);
      default:
        return NextResponse.json(
          { success: false, error: `Unsupported framework: ${framework}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Compilation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Internal server error',
          file: 'unknown',
        },
      },
      { status: 500 }
    );
  }
}

async function compileReact(files: Record<string, ProjectFile>) {
  try {
    const htmlFile = files['index.html'];
    if (!htmlFile) throw new Error('index.html is required');

    const cssFile = Object.values(files).find(f => f.name.endsWith('.css'));
    const jsxFile = Object.values(files).find(f => f.name.endsWith('.jsx') || f.name.endsWith('.tsx') || f.name.endsWith('.js'));
    if (!jsxFile) throw new Error('No React entry file found');

    let html = htmlFile.content;

    if (cssFile) {
      html = html.replace('<link rel="stylesheet" href="style.css">', `<style>${cssFile.content}</style>`);
    }

    let transformedCode = jsxFile.content;
    try {
      transformedCode = Babel.transform(jsxFile.content, { presets: ['react'] }).code || jsxFile.content;
    } catch {}

    html = html.replace(`<script type="module" src="${jsxFile.name}"></script>`, `<script>${transformedCode}</script>`);

    return NextResponse.json({ success: true, html });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'React compilation failed',
        file: 'index.html',
      },
    });
  }
}

async function compileVue(files: Record<string, ProjectFile>) {
  try {
    const htmlFile = files['index.html'];
    if (!htmlFile) throw new Error('index.html is required');

    const cssFile = Object.values(files).find(f => f.name.endsWith('.css'));
    const vueFile = Object.values(files).find(f => f.name.endsWith('.vue'));
    const jsFile = Object.values(files).find(f => f.name.endsWith('.js'));

    if (!vueFile && !jsFile) throw new Error('No Vue entry file found');

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

    return NextResponse.json({ success: true, html });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Vue compilation failed',
        file: 'index.html',
      },
    });
  }
}

async function compileSvelte(files: Record<string, ProjectFile>) {
  try {
    const htmlFile = files['index.html'];
    if (!htmlFile) throw new Error('index.html is required');

    const cssFile = Object.values(files).find(f => f.name.endsWith('.css'));
    const svelteFile = Object.values(files).find(f => f.name.endsWith('.svelte'));
    const jsFile = Object.values(files).find(f => f.name.endsWith('.js'));

    if (!svelteFile && !jsFile) throw new Error('No Svelte entry file found');

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

    return NextResponse.json({ success: true, html });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Svelte compilation failed',
        file: 'index.html',
      },
    });
  }
}