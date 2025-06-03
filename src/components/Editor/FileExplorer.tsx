'use client';

import React, { useState } from 'react';
import { FileText, Folder, Plus, Trash2, Edit3, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useProjectStore } from '@/lib/stores/projectStore';
import { useEditorStore } from '@/lib/stores/editorStore';
import { ProjectFile } from '@/lib/types';

const fileIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  'html': { icon: <FileText size={16} />, color: 'text-orange-500' },
  'css': { icon: <FileText size={16} />, color: 'text-blue-500' },
  'js': { icon: <FileText size={16} />, color: 'text-yellow-500' },
  'jsx': { icon: <FileText size={16} />, color: 'text-sky-500' }, // React specific
  'ts': { icon: <FileText size={16} />, color: 'text-blue-600' },
  'tsx': { icon: <FileText size={16} />, color: 'text-sky-600' }, // React + TS specific
  'vue': { icon: <FileText size={16} />, color: 'text-green-500' },
  'svelte': { icon: <FileText size={16} />, color: 'text-red-500' },
  'json': { icon: <FileText size={16} />, color: 'text-yellow-600' },
  'md': { icon: <FileText size={16} />, color: 'text-gray-400' },
  'default': { icon: <FileText size={16} />, color: 'text-gray-500' }
};

function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function getFileIconAndColor(filename: string) {
  const ext = getFileExtension(filename);
  return fileIcons[ext] || fileIcons.default;
}

export function FileExplorer() {
  const { 
    currentProject, 
    setActiveFile: setProjectActiveFile, 
    addFile, 
    deleteFile,
    updateFile // Needed for renaming if we implement it
  } = useProjectStore();
  
  const { 
    setActiveFile: setEditorActiveFile,
    removeOpenFile: removeEditorOpenFile,
    addConsoleMessage
  } = useEditorStore();

  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  // const [renamingFile, setRenamingFile] = useState<string | null>(null);
  // const [renameValue, setRenameValue] = useState('');

  if (!currentProject) {
    return (
      <div className="w-60 flex-shrink-0 bg-muted/20 border-r border-border p-4 flex flex-col items-center justify-center text-center">
        <Folder size={48} className="mb-4 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">No project loaded.</p>
        <p className="text-xs text-muted-foreground mt-1">Select or create a project to see files.</p>
      </div>
    );
  }

  const handleFileClick = (filename: string) => {
    setProjectActiveFile(filename);
    setEditorActiveFile(filename);
  };

  const handleToggleAddFile = () => {
    setIsAddingFile(!isAddingFile);
    setNewFileName(''); // Reset input when toggling
  };

  const handleAddNewFile = () => {
    if (!newFileName.trim() || !currentProject) return;

    const trimmedFileName = newFileName.trim();

    if (!trimmedFileName.includes('.')) {
      addConsoleMessage({ type: 'error', message: "File name must include an extension (e.g., index.html)." });
      return;
    }
    if (currentProject.files[trimmedFileName]) {
      addConsoleMessage({ type: 'error', message: `File "${trimmedFileName}" already exists.` });
      return;
    }

    const extension = getFileExtension(trimmedFileName);
    const fileTypeMap: Record<string, ProjectFile['type']> = {
        'html': 'html', 'css': 'css', 'js': 'js',
        'jsx': 'jsx', 'ts': 'ts', 'tsx': 'ts', // tsx files are of type 'ts' with jsx content
        'vue': 'vue', 'svelte': 'svelte', 'json': 'js', 'md': 'js' // Fallback for others
    };
    const type = fileTypeMap[extension] || 'js';

    const newFile: ProjectFile = {
        name: trimmedFileName,
        content: `// New file: ${trimmedFileName}\n\n`,
        type: type,
        icon: '', // Icon is determined by getFileIconAndColor, not stored directly in this manner
    };
    
    addFile(newFile); // This sets projectStore.activeFile = newFile.name
    setEditorActiveFile(newFile.name); // Sync editorStore
    
    setNewFileName('');
    setIsAddingFile(false);
    addConsoleMessage({type: 'success', message: `File "${trimmedFileName}" created.`});
  };

  const handleDeleteFile = (filename: string) => {
    if (!currentProject) return;
    
    // Basic safety: don't delete the last file if it's index.html for example
    // This logic can be enhanced based on project requirements
    if (Object.keys(currentProject.files).length === 1 && filename === 'index.html') {
      addConsoleMessage({ type: 'warning', message: "Cannot delete the main index.html when it's the last file." });
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${filename}? This action cannot be undone.`)) {
        deleteFile(filename); // This updates projectStore.activeFile if needed
        removeEditorOpenFile(filename); // This updates editorStore.activeFile if needed & removes from openFiles

        const newProjectActiveFile = useProjectStore.getState().currentProject?.activeFile || '';
        setEditorActiveFile(newProjectActiveFile); // Sync editor's active file
        addConsoleMessage({type: 'info', message: `File "${filename}" deleted.`});
    }
  };

  // const handleStartRename = (filename: string) => {
  //   setRenamingFile(filename);
  //   setRenameValue(filename);
  // };

  // const handleConfirmRename = () => {
  //   if (!renamingFile || !renameValue.trim() || !currentProject) return;
  //   const oldFileName = renamingFile;
  //   const newFileNameValidated = renameValue.trim();

  //   if (oldFileName === newFileNameValidated) {
  //     setRenamingFile(null);
  //     return;
  //   }
  //   if (currentProject.files[newFileNameValidated]) {
  //     addConsoleMessage({ type: 'error', message: `File "${newFileNameValidated}" already exists.`});
  //     return;
  //   }
  //   // More advanced rename logic would involve updating references if any.
  //   // For now, simple rename:
  //   const fileToRename = currentProject.files[oldFileName];
  //   const renamedFile: ProjectFile = { ...fileToRename, name: newFileNameValidated };
      
  //   // Need a renameFile action in projectStore
  //   // deleteFile(oldFileName);
  //   // addFile(renamedFile);
  //   // If oldFileName was active, setActiveFile(newFileNameValidated)
  //   // This is a simplified placeholder. A real rename is more complex.
  //   addConsoleMessage({type: 'info', message: `Renaming ${oldFileName} to ${newFileNameValidated} (feature under development).`});
  //   setRenamingFile(null);
  // };


  const sortedFileNames = Object.keys(currentProject.files).sort((a, b) => {
    // Optional: sort index.html, style.css, script.js first
    const preferredOrder = ['index.html', 'style.css', 'script.js'];
    const aIdx = preferredOrder.indexOf(a);
    const bIdx = preferredOrder.indexOf(b);

    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="w-60 flex-shrink-0 bg-muted/20 border-r border-border flex flex-col">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Files</h2>
        <button
          onClick={handleToggleAddFile}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          title={isAddingFile ? "Cancel adding file" : "Add new file"}
        >
          {isAddingFile ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      {/* New File Input */}
      {isAddingFile && (
        <div className="p-2 border-b border-border bg-background shadow-sm">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.ext"
            className="w-full px-2 py-1.5 text-sm bg-input border border-border rounded-md focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/50"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddNewFile();
              if (e.key === 'Escape') handleToggleAddFile();
            }}
          />
          <button
            onClick={handleAddNewFile}
            className="w-full mt-2 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Create File
          </button>
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
        {sortedFileNames.length === 0 && !isAddingFile && (
          <div className="text-center text-xs text-muted-foreground py-4 px-2">
            This project has no files yet. Click '+' to add one.
          </div>
        )}
        {sortedFileNames.map((filename) => {
          // const file = currentProject.files[filename]; // Not strictly needed if using getFileIconAndColor
          const { icon, color } = getFileIconAndColor(filename);
          const isActive = currentProject.activeFile === filename;

          // if (renamingFile === filename) {
          //   return (
          //     <div key={filename} className="file-tree-item p-1.5 bg-accent">
          //       <span className={cn('mr-2', color)}>{icon}</span>
          //       <input 
          //         type="text" 
          //         value={renameValue}
          //         onChange={(e) => setRenameValue(e.target.value)}
          //         onKeyDown={(e) => {
          //           if (e.key === 'Enter') handleConfirmRename();
          //           if (e.key === 'Escape') setRenamingFile(null);
          //         }}
          //         className="flex-1 text-sm bg-input border border-border rounded-sm px-1 py-0.5 outline-none focus:ring-1 focus:ring-primary"
          //         autoFocus
          //         onBlur={() => setTimeout(() => setRenamingFile(null), 100)} // Delay to allow button click
          //       />
          //       <button onClick={handleConfirmRename} className="p-0.5 text-green-500 hover:text-green-400 ml-1"><Check size={14}/></button>
          //       <button onClick={() => setRenamingFile(null)} className="p-0.5 text-red-500 hover:text-red-400 ml-1"><X size={14}/></button>
          //     </div>
          //   );
          // }

          return (
            <div
              key={filename}
              onClick={() => handleFileClick(filename)}
              className={cn(
                'file-tree-item group flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              title={filename}
            >
              <span className={cn(color, isActive && 'text-primary-foreground/80')}>{icon}</span>
              <span className="flex-1 truncate">{filename}</span>
              {/* Rename button - placeholder for future implementation
              <button
                onClick={(e) => { e.stopPropagation(); handleStartRename(filename); }}
                className={cn(
                  "ml-auto p-0.5 rounded-sm opacity-0 group-hover:opacity-60 focus:opacity-100 hover:opacity-100 hover:bg-muted-foreground/20",
                  isActive ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                title={`Rename ${filename}`}
              >
                <Edit3 size={13} />
              </button>
              */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent file click
                  handleDeleteFile(filename);
                }}
                className={cn(
                  "ml-1 p-0.5 rounded-sm opacity-0 group-hover:opacity-60 focus:opacity-100 hover:opacity-100 hover:bg-muted-foreground/20",
                  isActive ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-red-500"
                )}
                title={`Delete ${filename}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}