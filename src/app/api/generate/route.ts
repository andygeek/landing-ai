// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { FrameworkType } from '@/lib/types';
import { initFrameworkProject } from '@/lib/services/frameworkInitService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { framework, prompt, apiKey, model, company }: {
      framework: FrameworkType;
      prompt: string;
      apiKey?: string;
      model?: string;
      company?: string;
    } = body;

    if (!framework || !prompt) {
      return NextResponse.json(
        { success: false, error: 'Framework and prompt are required' },
        { status: 400 }
      );
    }

    const activeApiKey = apiKey?.trim();
    if (!activeApiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required in the request body' },
        { status: 400 }
      );
    }

    // Initialize base project to get file list
    const initResult = initFrameworkProject(framework);
    const fileList = initResult.files.join(', ');

    // System prompt includes initialized file list
    const systemPrompt = `You are a code assistant that generates landing page files. A base project using ${framework} has been created with these files: ${fileList}. Replace the contents of these files to implement the user's landing page requirements. Return ONLY a valid JSON object where keys are the file paths and values are the new file contents. Use JSX for React (.jsx), single-file components for Vue (.vue) and Svelte (.svelte). The page must remain fully functional.`;

    let generatedFiles: Record<string, string> = {};
    if (company === 'google') {
      const genAI = new GoogleGenAI({ apiKey: activeApiKey });
      const config = {
        responseMimeType: 'application/json',
        systemInstruction: [{ text: systemPrompt }],
      };
      const contents = [
        {
          role: 'user',
          parts: [{ text: `Create a landing page for: ${prompt}` }],
        },
      ];
      const geminiResult = await genAI.models.generateContent({
        model: model || 'gemini-2.5-pro',
        contents,
        config,
      });
      const text = geminiResult.text || '{}';
      generatedFiles = JSON.parse(text);
    } else {
      const openaiClient = new OpenAI({ apiKey: activeApiKey });
      const completion = await openaiClient.chat.completions.create({
        model: model || 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a landing page for: ${prompt}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 4000,
      });
      generatedFiles = JSON.parse(completion.choices[0].message.content || '{}');
    }
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
