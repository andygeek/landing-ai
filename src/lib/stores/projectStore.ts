// src/lib/stores/projectStore.ts
import { create } from 'zustand';
import { Project, ProjectFile, FrameworkType, ProjectStore, Template } from '../types';

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  projects: [],
  isLoading: false,
  error: null,

  createProject: async (framework: FrameworkType, template?: Template) => {
    set({ isLoading: true, error: null });

    try {
      // If a template with files is provided (e.g. from AI generation), use it
      // otherwise start with an empty project
      const emptyFiles: Record<string, ProjectFile> = {
        'index.html': {
          name: 'index.html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Nuevo proyecto ${framework}</title>
</head>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
          type: 'html',
          icon: '📄',
        },
        'style.css': {
          name: 'style.css',
          content: `/* Estilos iniciales (vacío) */`,
          type: 'css',
          icon: '🎨',
        },
        'script.js': {
          name: 'script.js',
          content: `// JavaScript inicial (vacío)`,
          type: 'js',
          icon: '⚡',
        },
      };

      const files = template?.files ? template.files : emptyFiles;
      const newProject: Project = {
        id: template?.id || `project_${Date.now()}`,
        name: template?.name || `Nuevo proyecto (${framework})`,
        framework,
        files,
        activeFile: 'index.html',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: template?.description || '',
        isPublic: false,
      };

      set({
        currentProject: newProject,
        projects: [...get().projects, newProject],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear el proyecto',
        isLoading: false,
      });
    }
  },

  loadProject: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const projects = get().projects;
      const project = projects.find((p) => p.id === id);

      if (!project) {
        throw new Error('Proyecto no encontrado');
      }

      set({ currentProject: project, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar el proyecto',
        isLoading: false,
      });
    }
  },

  saveProject: async (project: Project) => {
    set({ isLoading: true, error: null });

    try {
      // Simular guardado en API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedProject = {
        ...project,
        updatedAt: new Date().toISOString(),
      };

      const updatedList = get().projects.map((p) =>
        p.id === project.id ? updatedProject : p
      );

      set({
        projects: updatedList,
        currentProject: updatedProject,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al guardar el proyecto',
        isLoading: false,
      });
    }
  },

  updateFile: (filename: string, content: string) => {
    const currentProject = get().currentProject;
    if (!currentProject) return;

    const updatedFiles = {
      ...currentProject.files,
      [filename]: {
        ...currentProject.files[filename],
        content,
      },
    };

    const updatedProject = {
      ...currentProject,
      files: updatedFiles,
      updatedAt: new Date().toISOString(),
    };

    set({ currentProject: updatedProject });
  },

  setActiveFile: (filename: string) => {
    const currentProject = get().currentProject;
    if (!currentProject) return;

    set({
      currentProject: {
        ...currentProject,
        activeFile: filename,
      },
    });
  },

  addFile: (file: ProjectFile) => {
    const currentProject = get().currentProject;
    if (!currentProject) return;

    const updatedFiles = {
      ...currentProject.files,
      [file.name]: file,
    };

    set({
      currentProject: {
        ...currentProject,
        files: updatedFiles,
        activeFile: file.name,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  deleteFile: (filename: string) => {
    const currentProject = get().currentProject;
    if (!currentProject) return;

    const updatedFiles = { ...currentProject.files };
    delete updatedFiles[filename];

    // Si el archivo activo se elimina, cambiar a otro
    let newActiveFile = currentProject.activeFile;
    if (currentProject.activeFile === filename) {
      const restantes = Object.keys(updatedFiles);
      newActiveFile = restantes[0] || '';
    }

    set({
      currentProject: {
        ...currentProject,
        files: updatedFiles,
        activeFile: newActiveFile,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  switchFramework: (framework: FrameworkType) => {
    const currentProject = get().currentProject;
    if (!currentProject) return;

    // Ya no usamos plantilla; simplemente actualizamos el framework
    set({
      currentProject: {
        ...currentProject,
        framework,
        // Conservamos los mismos archivos, o podrías reemplazar con emptyFiles si lo prefieres
        updatedAt: new Date().toISOString(),
      },
    });
  },
}));
