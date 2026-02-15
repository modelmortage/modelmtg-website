
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const filePath = path.join(process.cwd(), 'content', 'blog', 'how-refinancing-works-in-texas.mdx');

try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    console.log('Frontmatter:', JSON.stringify(data, null, 2));
} catch (error) {
    console.error('Error reading file:', error);
}
