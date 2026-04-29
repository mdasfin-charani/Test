const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const mappings = [
  // SuperAdmin
  { old: 'SuperAdmin/pages', new: 'pages/super-admin' },
  { old: 'SuperAdmin/components/Layout.jsx', new: 'layouts/SuperAdminLayout.jsx' },
  { old: 'SuperAdmin/components/Navbar.jsx', new: 'layouts/SuperAdminNavbar.jsx' },
  { old: 'SuperAdmin/components/Sidebar.jsx', new: 'layouts/SuperAdminSidebar.jsx' },
  { old: 'SuperAdmin/components', new: 'components/super-admin' },
  { old: 'SuperAdmin/context', new: 'context/super-admin' },
  { old: 'SuperAdmin/routes', new: 'routes/super-admin' },
  { old: 'SuperAdmin/services', new: 'services/super-admin' },

  // HubAdminV2
  { old: 'HubAdminV2/pages', new: 'pages/hub-admin' },
  { old: 'HubAdminV2/components/Layout.jsx', new: 'layouts/HubAdminLayout.jsx' },
  { old: 'HubAdminV2/components/Navbar.jsx', new: 'layouts/HubAdminNavbar.jsx' },
  { old: 'HubAdminV2/components/Sidebar.jsx', new: 'layouts/HubAdminSidebar.jsx' },
  { old: 'HubAdminV2/components', new: 'components/hub-admin' },
  { old: 'HubAdminV2/context', new: 'context/hub-admin' },
  { old: 'HubAdminV2/routes', new: 'routes/hub-admin' },

  // StoreAdminV2
  { old: 'StoreAdminV2/pages', new: 'pages/store-admin' },
  { old: 'StoreAdminV2/components/Layout.jsx', new: 'layouts/StoreAdminLayout.jsx' },
  { old: 'StoreAdminV2/components/Navbar.jsx', new: 'layouts/StoreAdminNavbar.jsx' },
  { old: 'StoreAdminV2/components/Sidebar.jsx', new: 'layouts/StoreAdminSidebar.jsx' },
  { old: 'StoreAdminV2/components', new: 'components/store-admin' },
  { old: 'StoreAdminV2/context', new: 'context/store-admin' },
  { old: 'StoreAdminV2/routes', new: 'routes/store-admin' },

  // Global legacy folders
  { old: 'Pages', new: 'pages/auth' },
  { old: 'Components/Navbar.jsx', new: 'layouts/MainNavbar.jsx' },
  { old: 'Components', new: 'components/global' },
];

function moveFiles() {
  mappings.forEach(({ old, new: mappedNew }) => {
    const oldPath = path.join(srcDir, old);
    const newPath = path.join(srcDir, mappedNew);

    if (fs.existsSync(oldPath)) {
      const parentDir = path.dirname(newPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      // if moving file to file
      if (fs.lstatSync(oldPath).isFile()) {
         fs.renameSync(oldPath, newPath);
      } else {
         // if moving dir to dir
         if (!fs.existsSync(newPath)) fs.mkdirSync(newPath, { recursive: true });
         fs.cpSync(oldPath, newPath, { recursive: true });
         fs.rmSync(oldPath, { recursive: true, force: true });
      }
      console.log(`Moved ${old} -> ${mappedNew}`);
    }
  });
}

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath, callback);
    } else {
      callback(filePath);
    }
  }
}

function resolveOldImportToNew(sourceFilePath, importPath) {
  if (!importPath.startsWith('.')) return null; // Only modify relative imports
  
  const absoluteImportPathRaw = path.resolve(path.dirname(sourceFilePath), importPath);
  
  // Standardize backslashes to forward slashes for mapping comparison
  let relToSrc = path.relative(srcDir, absoluteImportPathRaw).replace(/\\/g, '/');
  
  // It might be referencing a file that had no extension in import path
  // We'll check the mappings directly.
  let newRelPath = relToSrc;
  
  for (const map of mappings) {
      // Direct file match
      if (relToSrc === map.old || relToSrc + '.jsx' === map.old || relToSrc + '.js' === map.old || relToSrc + '/index.js' === map.old) {
          if (map.new.endsWith('.jsx') || map.new.endsWith('.js')) {
              newRelPath = map.new.replace(/\.jsx?$/, '');
          } else {
              newRelPath = map.new;
          }
          break;
      }
      
      // Directory prefix match
      if (relToSrc.startsWith(map.old + '/')) {
          newRelPath = relToSrc.replace(map.old + '/', map.new + '/');
          break;
      }
  }

  // Convert to absolute alias @
  return '@/' + newRelPath;
}

function updateImports() {
  walk(srcDir, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;

      // Regex to find all import statements
      const importRegex = /import\s+.*?(?:from\s+)?['"]([^'"]+)['"]/g;
      
      let newContent = content.replace(importRegex, (match, p1) => {
        let replacement = resolveOldImportToNew(filePath, p1);
        if (replacement) {
          changed = true;
          return match.replace(p1, replacement);
        }
        return match;
      });

      if (changed) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Updated imports in ${path.relative(srcDir, filePath).replace(/\\/g, '/')}`);
      }
    }
  });
}

function main() {
  console.log('Starting migration...');
  moveFiles();
  console.log('Updating imports...');
  updateImports();
  
  // Cleanup old empty root dirs inside src
  const oldDirs = ['SuperAdmin', 'HubAdminV2', 'StoreAdminV2', 'Pages', 'Components'];
  oldDirs.forEach(d => {
      const p = path.join(srcDir, d);
      if (fs.existsSync(p)) {
          console.log(`Cleaning up old parent directory ${p}`);
          fs.rmSync(p, { recursive: true, force: true });
      }
  });
  
  console.log('Done.');
}

main();
