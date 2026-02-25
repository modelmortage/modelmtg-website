const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
                walk(path.join(dir, file), fileList);
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                fileList.push(path.join(dir, file));
            }
        }
    }
    return fileList;
}

const files = walk('./app');
const components = walk('./components');
const allFiles = [...files, ...components];

let results = {
    metadata: { missingDesc: [], missingTitle: [], hasCanonical: [], hasOG: [] },
    h1: { missing: [], multiple: [] },
    images: { missingAlt: [] },
    schema: { foundIn: [] },
};

files.forEach(f => {
    if (f.endsWith('page.tsx') || f.endsWith('layout.tsx')) {
        const content = fs.readFileSync(f, 'utf-8');

        // Check metadata
        if (!content.includes('export const metadata') && !content.includes('generateMetadata')) {
            if (f.endsWith('page.tsx')) results.metadata.missingTitle.push(f);
        } else {
            if (!content.includes('description:')) {
                // Some might use variable names or other structures, but this is a rough check
                if (!content.includes('description')) results.metadata.missingDesc.push(f);
            }
            if (content.match(/alternates[\s\S]*?canonical/)) results.metadata.hasCanonical.push(f);
            if (content.match(/openGraph/)) results.metadata.hasOG.push(f);
        }

        if (f.endsWith('page.tsx')) {
            // H1 count
            // Remove comments to avoid false positives
            const noComments = content.replace(/{\/\*[\s\S]*?\*\/}/g, '').replace(/\/\/.*/g, '');
            const h1Count = (noComments.match(/<h1[\s>]/g) || []).length;
            if (h1Count === 0) results.h1.missing.push(f);
            else if (h1Count > 1) results.h1.multiple.push(f);

            // Schema
            if (content.includes('application/ld+json')) results.schema.foundIn.push(f);
        }
    }
});

allFiles.forEach(f => {
    const content = fs.readFileSync(f, 'utf-8');
    // Remove comments
    const noComments = content.replace(/{\/\*[\s\S]*?\*\/}/g, '');
    // Images
    const imgRegex = /<Image\b[^>]*>/g;
    let match;
    while ((match = imgRegex.exec(noComments)) !== null) {
        if (!match[0].includes('alt=')) {
            results.images.missingAlt.push({ file: f, tag: match[0] });
        } else if (match[0].includes('alt=\"\"') || match[0].includes("alt={''}")) {
            results.images.missingAlt.push({ file: f, tag: 'empty alt' });
        }
    }
});

fs.writeFileSync('audit-results.json', JSON.stringify(results, null, 2), 'utf8');
console.log('done');
