import fs from 'fs';
import path from 'path';

function refactorTheme(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Global background inversions
  content = content.replace(/bg-black(?:\/\[?[0-9.]+\]?)?/g, 'bg-slate-50');
  content = content.replace(/bg-grid-white(?:\/\[?[0-9.]+\]?)?/g, 'bg-grid-slate-900/[0.04]');
  content = content.replace(/bg-white\/5/g, 'bg-white');
  content = content.replace(/bg-white\/10/g, 'bg-slate-100');
  
  // Text inversions
  content = content.replace(/text-white/g, 'text-slate-900');
  content = content.replace(/text-gray-400/g, 'text-slate-600');
  content = content.replace(/text-slate-400/g, 'text-slate-500');
  
  // Border inversions
  content = content.replace(/border-white\/5/g, 'border-slate-200');
  content = content.replace(/border-white\/10/g, 'border-slate-300');
  content = content.replace(/border-border\/40/g, 'border-slate-200');

  // Gradient text
  content = content.replace(/from-white to-gray-400/g, 'from-slate-900 to-slate-600');

  // React Bits swaps for Light Mode enhancements
  if (filePath.includes('page.tsx')) {
     if (content.includes('<SplitText text="Where do you want to learn?" />')) {
         content = content.replace('<SplitText text="Where do you want to learn?" />', '<TrueFocus sentence="Where do you want to learn?" />');
         // Add TrueFocus import if needed
         if (!content.includes('TrueFocus')) {
             content = content.replace('import { SplitText }', 'import { SplitText }\nimport { TrueFocus }');
         }
     }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Theme Refactored:', filePath);
  }
}

const filesToRefactor = [
  './app/page.tsx',
  './app/dashboard/page.tsx',
  './app/learn/[track]/page.tsx',
  './components/hero.tsx',
  './components/ui/ai-activity-toast.tsx',
  './components/learn/course-player.tsx'
];

filesToRefactor.forEach(refactorTheme);
