const fs = require('fs');
const path = require('path');

// Add dynamic export to all page.tsx files
function addDynamicExport(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      addDynamicExport(filePath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes("'use client'") && !content.includes('export const dynamic')) {
        content = content.replace(
          "'use client';",
          "'use client';\n\n// Force dynamic rendering\nexport const dynamic = 'force-dynamic';"
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`Fixed: ${filePath}`);
      }
    }
  });
}

// Start from src/app directory
addDynamicExport('./src/app');
console.log('All pages fixed!');
