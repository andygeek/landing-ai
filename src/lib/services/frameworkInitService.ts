import { mkdtempSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { FrameworkType } from '../types';

export interface InitResult {
  dir: string;
  files: string[];
}

function writeFile(dir: string, filePath: string, content: string) {
  const full = join(dir, filePath);
  const folder = full.substring(0, full.lastIndexOf('/'));
  mkdirSync(folder, { recursive: true });
  writeFileSync(full, content);
}

function listFiles(dir: string, base = dir): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files = files.concat(listFiles(p, base));
    else files.push(p.substring(base.length + 1));
  }
  return files;
}

export function initFrameworkProject(framework: FrameworkType): InitResult {
  const dir = mkdtempSync(join(tmpdir(), `landing-${framework}-`));
  switch (framework) {
    case 'react':
      writeFile(dir, 'index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>React App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="main.jsx"></script>
</body>
</html>`);
      writeFile(dir, 'main.jsx', `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`);
      writeFile(dir, 'App.jsx', `export default function App() {
  return <h1>Hello React</h1>;
}`);
      writeFile(dir, 'style.css', ``);
      break;
    case 'vue':
      writeFile(dir, 'index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vue App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="main.js"></script>
</body>
</html>`);
      writeFile(dir, 'main.js', `import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');`);
      writeFile(dir, 'App.vue', `<template>
  <h1>Hello Vue</h1>
</template>
<script>
export default { name: 'App' }
</script>
<style>
</style>`);
      writeFile(dir, 'style.css', ``);
      break;
    case 'svelte':
      writeFile(dir, 'index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Svelte App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="main.js"></script>
</body>
</html>`);
      writeFile(dir, 'main.js', `import App from './App.svelte';
import './style.css';
const app = new App({ target: document.getElementById('app') });
export default app;`);
      writeFile(dir, 'App.svelte', `<script>
  export let name = 'world';
</script>

<main>
  <h1>Hello {name}!</h1>
</main>

<style>
</style>`);
      writeFile(dir, 'style.css', ``);
      break;
    default:
      writeFile(dir, 'index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vanilla App</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`);
      writeFile(dir, 'script.js', ``);
      writeFile(dir, 'style.css', ``);
      break;
  }
  return { dir, files: listFiles(dir) };
}

