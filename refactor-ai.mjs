import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function refactorFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Replace gemini-1.5-pro with gemini-2.0-flash
  if (content.includes('gemini-1.5-pro')) {
    content = content.replace(/gemini-1\.5-pro/g, 'gemini-2.0-flash');
    changed = true;
  }

  // 2. Refactor JSON.parse -> parseAIJSON for gemini usages
  // Only target files that import from @/lib/gemini or have JSON.parse(result.response.text())
  if (content.includes('@/lib/gemini') && content.includes('JSON.parse(')) {
    // Add import if not present
    if (!content.includes('parseAIJSON')) {
        content = content.replace(/from\s+["']@\/lib\/gemini["']/g, (match, offset, str) => {
             // Look backwards to see what's imported
             let linesBefore = str.substring(0, offset);
             let lastImportStart = linesBefore.lastIndexOf('import {');
             if (lastImportStart !== -1) {
                 // It's a bracketed import, let's just make sure parseAIJSON is in it
                 let bracketContent = str.substring(lastImportStart, offset);
                 if (!bracketContent.includes('parseAIJSON')) {
                     return `, parseAIJSON } from "@/lib/gemini"`; 
                 }
             }
             return match;
        });

        // Dynamic imports: const { jsonModel } = await import("@/lib/gemini")
        content = content.replace(/const\s*{\s*([^}]+)\s*}\s*=\s*await\s+import\s*\(\s*["']@\/lib\/gemini["']\s*\)/g, (match, p1) => {
            if (!p1.includes('parseAIJSON')) {
                return `const { ${p1}, parseAIJSON } = await import("@/lib/gemini")`;
            }
            return match;
        });
    }

    // Replace JSON.parse(result.response.text())
    if (content.match(/JSON\.parse\([^)]*response\.text\(\)[^)]*\)/)) {
        content = content.replace(/JSON\.parse\(([^)]*response\.text\(\)[^)]*)\)/g, 'parseAIJSON($1)');
        changed = true;
    }
    // Replace JSON.parse(aiText) or similar if recently extracted
    if (content.match(/JSON\.parse\(aiText\)/)) {
        content = content.replace(/JSON\.parse\(aiText\)/g, 'parseAIJSON(aiText)');
        changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Refactored:', filePath);
  }
}

walkDir('./app/api', refactorFile);
