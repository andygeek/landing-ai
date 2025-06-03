// Framework Types
export type FrameworkType = 'vanilla' | 'react' | 'vue' | 'svelte';

export interface Framework {
  id: FrameworkType;
  name: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
  templates: Template[];
}

// Project Types
export interface ProjectFile {
  name: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'jsx' | 'vue' | 'svelte' | 'ts';
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  framework: FrameworkType;
  files: Record<string, ProjectFile>;
  activeFile: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  isPublic?: boolean;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  framework: FrameworkType;
  files: Record<string, ProjectFile>;
  preview?: string;
  tags: string[];
}

// Compiler Types
export interface CompileRequest {
  framework: FrameworkType;
  files: Record<string, ProjectFile>;
  mode: 'development' | 'production';
}

export interface CompileResult {
  success: boolean;
  html?: string;
  error?: {
    message: string;
    line?: number;
    column?: number;
    file?: string;
  };
  warnings?: string[];
}

// Editor Types
export interface EditorState {
  activeFile: string;
  openFiles: string[];
  isCompiling: boolean;
  lastCompiled: string;
  errors: EditorError[];
  warnings: string[];
}

export interface EditorError {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

// Console Types
export interface ConsoleMessage {
  id: string;
  type: 'log' | 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
  source?: string;
}

// UI Types
export interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Store Types
export interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createProject: (framework: FrameworkType, template?: Template) => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  saveProject: (project: Project) => Promise<void>;
  updateFile: (filename: string, content: string) => void;
  setActiveFile: (filename: string) => void;
  addFile: (file: ProjectFile) => void;
  deleteFile: (filename: string) => void;
  switchFramework: (framework: FrameworkType) => void;
}

export interface EditorStore {
  editorState: EditorState;
  consoleMessages: ConsoleMessage[];
  previewHtml: string;
  
  // Actions
  setActiveFile: (filename: string) => void;
  addOpenFile: (filename: string) => void;
  removeOpenFile: (filename: string) => void;
  setCompiling: (isCompiling: boolean) => void;
  addError: (error: EditorError) => void;
  clearErrors: () => void;
  addConsoleMessage: (message: Omit<ConsoleMessage, 'id' | 'timestamp'>) => void;
  clearConsole: () => void;
  setPreviewHtml: (html: string) => void;
}

// Utility Types
export type FileExtension = 'html' | 'css' | 'js' | 'jsx' | 'ts' | 'tsx' | 'vue' | 'svelte';

export interface FileTypeConfig {
  extension: FileExtension;
  icon: string;
  color: string;
  language: string;
}

// Theme Types
export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    accent: string;
    muted: string;
    border: string;
  };
  editor: {
    background: string;
    foreground: string;
    selection: string;
    lineNumber: string;
  };
}

export interface AIGenerationRequest {
  framework: FrameworkType;
  prompt: string;
  apiKey?: string;
}

export interface AIGenerationResponse {
  success: boolean;
  files?: Record<string, string>;
  error?: string;
}