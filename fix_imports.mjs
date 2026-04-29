import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function parseFiles(dir, callback) {
  for (const file of fs.readdirSync(dir)) {
    const fPath = path.join(dir, file);
    if (fs.statSync(fPath).isDirectory()) {
      parseFiles(fPath, callback);
    } else {
      callback(fPath);
    }
  }
}

// Build a map of all files to their true current active alias
const allFilesToAliasMap = {};
parseFiles(srcDir, (fPath) => {
  if (fPath.endsWith('.js') || fPath.endsWith('.jsx') || fPath.endsWith('.css') || fPath.endsWith('.png') || fPath.endsWith('.svg')) {
    const relativePart = '@/' + path.relative(srcDir, fPath).replace(/\\/g, '/');
    const baseName = path.basename(fPath);
    
    // Exact mapping logic based on new folder
    if (!allFilesToAliasMap[baseName]) {
      allFilesToAliasMap[baseName] = [];
    }
    allFilesToAliasMap[baseName].push(relativePart);
  }
});

// Heuristics to resolve relative path correctly
// Example: in src/pages/super-admin/Dashboard.jsx
// It imports '../../components/Sidebar'
// Which one? It's super-admin! So we prioritize things with 'super-admin' in their alias path!

function fixImports() {
  parseFiles(srcDir, (fPath) => {
    if (!fPath.endsWith('.js') && !fPath.endsWith('.jsx')) return;
    
    let content = fs.readFileSync(fPath, 'utf8');
    let changed = false;
    
    // Catch single/double quote imports
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    content = content.replace(importRegex, (match, importPath) => {
      if (!importPath.startsWith('.')) return match; // Not a relative path

      const baseNameTarget = path.basename(importPath); 
      // sometimes extension is missing
      let targetName = baseNameTarget;
      if (!targetName.match(/\.(js|jsx|css|svg|png)$/)) {
        targetName = targetName; // we will check .jsx and .js
      }

      let matches = [];
      for (const [key, paths] of Object.entries(allFilesToAliasMap)) {
         if (key === targetName || key === targetName + '.jsx' || key === targetName + '.js' || key === targetName + '.css') {
            matches.push(...paths);
         }
      }

      if (matches.length === 1) {
         changed = true;
         return `from '${matches[0]}'`;
      } 
      
      if (matches.length > 1) {
         // Ambiguity! Try to match context.
         // If file is in "super-admin", prefer "super-admin" match
         const myPath = fPath.replace(/\\/g, '/');
         const isSuper = myPath.includes('/super-admin');
         const isHub = myPath.includes('/hub-admin');
         const isStore = myPath.includes('/store-admin');
         const isGlobal = myPath.includes('/global') || myPath.includes('/auth') || myPath.endsWith('App.jsx');

         let bestMatch = matches[0];
         for (const m of matches) {
           if (isSuper && m.includes('SuperAdmin')) bestMatch = m;
           if (isSuper && m.includes('super-admin')) bestMatch = m;
           if (isHub && m.includes('HubAdmin')) bestMatch = m;
           if (isHub && m.includes('hub-admin')) bestMatch = m;
           if (isStore && m.includes('StoreAdmin')) bestMatch = m;
           if (isStore && m.includes('store-admin')) bestMatch = m;
           if (isGlobal && (m.includes('global') || m.includes('MainNavbar'))) bestMatch = m;
         }
         
         // Special layout mappings
         if (targetName === 'Layout' || targetName === 'Layout.jsx') {
            if (isSuper) bestMatch = '@/layouts/SuperAdminLayout.jsx';
            if (isHub) bestMatch = '@/layouts/HubAdminLayout.jsx';
            if (isStore) bestMatch = '@/layouts/StoreAdminLayout.jsx';
         }
         if (targetName === 'Sidebar' || targetName === 'Sidebar.jsx') {
            if (isSuper) bestMatch = '@/layouts/SuperAdminSidebar.jsx';
            if (isHub) bestMatch = '@/layouts/HubAdminSidebar.jsx';
            if (isStore) bestMatch = '@/layouts/StoreAdminSidebar.jsx';
         }
         if (targetName === 'Navbar' || targetName === 'Navbar.jsx') {
            if (isSuper) bestMatch = '@/layouts/SuperAdminNavbar.jsx';
            if (isHub) bestMatch = '@/layouts/HubAdminNavbar.jsx';
            if (isStore) bestMatch = '@/layouts/StoreAdminNavbar.jsx';
            if (isGlobal) bestMatch = '@/layouts/MainNavbar.jsx';
         }

         changed = true;
         return `from '${bestMatch.replace(/\.jsx?$/, '')}'`;
      }

      return match;
    });

    // Also catch lazy imports like `import('...')`
    const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
    content = content.replace(dynamicImportRegex, (match, importPath) => {
        // Simple logic similar to above.
        if (!importPath.startsWith('.')) return match;
        // Since React Router lazy loads use this. We just replace everything
        const baseNameTarget = path.basename(importPath);
        let matches = [];
        for (const [key, paths] of Object.entries(allFilesToAliasMap)) {
           if (key === baseNameTarget || key === baseNameTarget + '.jsx') {
              matches.push(...paths);
           }
        }
        if (matches.length > 0) {
            changed = true;
            return `import('${matches[0]}')`;
        }
        return match;
    });

    // Also catch CSS imports without "from" like: import '../../styles/foo.css'
    const cssImportRegex = /import\s+['"]([^'"]+\.css)['"]/g;
    content = content.replace(cssImportRegex, (match, importPath) => {
        if (!importPath.startsWith('.')) return match;
        const name = path.basename(importPath);
        if (allFilesToAliasMap[name]) {
             changed = true;
             return `import '${allFilesToAliasMap[name][0]}'`;
        }
        return match;
    });

    if (changed) {
      fs.writeFileSync(fPath, content, 'utf8');
      console.log(`Fixed imports in ${path.basename(fPath)}`);
    }
  });
}

fixImports();
console.log('Imports fixed.');
