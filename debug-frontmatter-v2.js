const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(process.cwd(), 'content', 'blog'); // Changed __dirname to process.cwd() for consistency with original
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

console.log('Checking ' + files.length + ' posts...');

files.forEach(file => {
    const filePath = path.join(blogDir, file);
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(raw);
        if (!data || !data.title) {
            console.error(`[FAIL] ${file}: Missing title. Data keys: ${Object.keys(data || {}).join(', ')}`);
        }
    } catch (e) {
        console.error(`[EXCEPTION] ${file}: ${e.message}`);
    }
});
