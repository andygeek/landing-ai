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
    // For React, we can use Babel to transform JSX
    
    const htmlFile = files['index.html'];
    const cssFile = files['style.css'];
    const jsFile = files['script.js'];

    if (!htmlFile || !jsFile) {
      throw new Error('index.html and script.js are required');
    }

    let html = htmlFile.content;

    // Inject CSS
    if (cssFile) {
      html = html.replace(
        '<link rel="stylesheet" href="style.css">',
        `<style>${cssFile.content}</style>`
      );
    }

    // Transform JSX with Babel
    try {
      const transformedCode = Babel.transform(jsFile.content, {
        presets: ['react'],
      }).code;

      html = html.replace(
        '<script type="text/babel" src="script.js"></script>',
        `<script>${transformedCode}</script>`
      );
    } catch {
      // Fallback to untransformed code
      html = html.replace(
        '<script type="text/babel" src="script.js"></script>',
        `<script type="text/babel">${jsFile.content}</script>`
      );
    }

    return NextResponse.json({
      success: true,
      html,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'React compilation failed',
        file: 'script.js',
      },
    });
  }
}

async function compileVue(files: Record<string, ProjectFile>) {
  try {
    // For Vue SFC compilation, we would use @vue/compiler-sfc
    // For this demo, we'll handle template compilation
    const htmlFile = files['index.html'];
    const cssFile = files['style.css'];
    const jsFile = files['script.js'];

    if (!htmlFile || !jsFile) {
      throw new Error('index.html and script.js are required');
    }

    let html = htmlFile.content;

    // Inject CSS
    if (cssFile) {
      html = html.replace(
        '<link rel="stylesheet" href="style.css">',
        `<style>${cssFile.content}</style>`
      );
    }

    // For single file components, we would compile here
    // For now, just inject the script
    html = html.replace(
      '<script src="script.js"></script>',
      `<script>${jsFile.content}</script>`
    );

    return NextResponse.json({
      success: true,
      html,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Vue compilation failed',
        file: 'script.js',
      },
    });
  }
}

async function compileSvelte(files: Record<string, ProjectFile>) {
  try {
    // For real Svelte compilation, we would use the Svelte compiler
    // For this demo, we'll simulate it
    const htmlFile = files['index.html'];
    const cssFile = files['style.css'];
    const jsFile = files['script.js'];

    if (!htmlFile || !jsFile) {
      throw new Error('index.html and script.js are required');
    }

    let html = htmlFile.content;

    // Inject CSS
    if (cssFile) {
      html = html.replace(
        '<link rel="stylesheet" href="style.css">',
        `<style>${cssFile.content}</style>`
      );
    }

    // Simulate Svelte compilation
    html = html.replace(
      '<script src="script.js"></script>',
      `<script>${jsFile.content}</script>`
    );

    return NextResponse.json({
      success: true,
      html,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Svelte compilation failed',
        file: 'script.js',
      },
    });
  }
}