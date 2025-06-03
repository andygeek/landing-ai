import { create } from 'zustand';
import { Project, ProjectFile, FrameworkType, Template, ProjectStore } from '../types';
import { getTemplateByFramework } from '../utils/templates';

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  projects: [],
  isLoading: false,
  error: null,


  createProject: async (framework: FrameworkType, template?: Template) => {
    set({ isLoading: true, error: null });
    
    try {
      const selectedTemplate = template || getTemplateByFramework(framework);
      
      const newProject: Project = {
        id: `project_${Date.now()}`,
        name: template?.name || `New ${framework} Project`,
        framework,
        files: selectedTemplate.files,
        activeFile: 'index.html',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: selectedTemplate.description,
        isPublic: false,
      };

      set({ 
        currentProject: newProject,
        projects: [...get().projects, newProject],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create project',
        isLoading: false 
      });
    }
  },

  loadProject: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // En una app real, esto vendría de una API
      const projects = get().projects;
      const project = projects.find(p => p.id === id);
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      set({ currentProject: project, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load project',
        isLoading: false 
      });
    }
  },

  saveProject: async (project: Project) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simular guardado en API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProject = {
        ...project,
        updatedAt: new Date().toISOString(),
      };
      
      const projects = get().projects.map(p => 
        p.id === project.id ? updatedProject : p
      );
      
      set({ 
        projects,
        currentProject: updatedProject,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save project',
        isLoading: false 
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

    // Si el archivo activo se elimina, cambiar a otro archivo
    let newActiveFile = currentProject.activeFile;
    if (currentProject.activeFile === filename) {
      const remainingFiles = Object.keys(updatedFiles);
      newActiveFile = remainingFiles[0] || '';
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

    const template = getTemplateByFramework(framework);
    
    set({
      currentProject: {
        ...currentProject,
        framework,
        files: template.files,
        activeFile: 'index.html',
        updatedAt: new Date().toISOString(),
      },
    });
  },
}));