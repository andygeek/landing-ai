import { create } from 'zustand';
import { EditorStore, EditorState, ConsoleMessage, EditorError } from '../types';

const initialEditorState: EditorState = {
  activeFile: '',
  openFiles: [],
  isCompiling: false,
  lastCompiled: '',
  errors: [],
  warnings: [],
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  editorState: initialEditorState,
  consoleMessages: [],
  previewHtml: '',

  setActiveFile: (filename: string) => {
    const { editorState } = get();
    const openFiles = editorState.openFiles.includes(filename)
      ? editorState.openFiles
      : [...editorState.openFiles, filename];

    set({
      editorState: {
        ...editorState,
        activeFile: filename,
        openFiles,
      },
    });
  },

  addOpenFile: (filename: string) => {
    const { editorState } = get();
    if (!editorState.openFiles.includes(filename)) {
      set({
        editorState: {
          ...editorState,
          openFiles: [...editorState.openFiles, filename],
        },
      });
    }
  },

  removeOpenFile: (filename: string) => {
    const { editorState } = get();
    const openFiles = editorState.openFiles.filter(f => f !== filename);
    
    // Si cerramos el archivo activo, cambiar a otro
    let activeFile = editorState.activeFile;
    if (activeFile === filename && openFiles.length > 0) {
      activeFile = openFiles[openFiles.length - 1];
    }

    set({
      editorState: {
        ...editorState,
        openFiles,
        activeFile,
      },
    });
  },

  setCompiling: (isCompiling: boolean) => {
    const { editorState } = get();
    set({
      editorState: {
        ...editorState,
        isCompiling,
        lastCompiled: isCompiling ? editorState.lastCompiled : new Date().toISOString(),
      },
    });
  },

  addError: (error: EditorError) => {
    const { editorState } = get();
    const existingErrorIndex = editorState.errors.findIndex(
      e => e.file === error.file && e.line === error.line && e.column === error.column
    );

    let errors = [...editorState.errors];
    if (existingErrorIndex >= 0) {
      errors[existingErrorIndex] = error;
    } else {
      errors.push(error);
    }

    set({
      editorState: {
        ...editorState,
        errors,
      },
    });
  },

  clearErrors: () => {
    const { editorState } = get();
    set({
      editorState: {
        ...editorState,
        errors: [],
        warnings: [],
      },
    });
  },

  addConsoleMessage: (message: Omit<ConsoleMessage, 'id' | 'timestamp'>) => {
    const { consoleMessages } = get();
    const newMessage: ConsoleMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    set({
      consoleMessages: [...consoleMessages, newMessage],
    });
  },

  clearConsole: () => {
    set({ consoleMessages: [] });
  },

  setPreviewHtml: (html: string) => {
    set({ previewHtml: html });
  },
}));