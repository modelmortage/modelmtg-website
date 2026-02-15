import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogFrontmatter = {
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    publishDate: string; // YYYY-MM-DD
    category: string;
    tags: string[];
    featuredImage?: string;
    readTime?: number;
    metadata?: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
        canonical?: string;
    };
};

export function getPostSlugs(): string[] {
    return fs
        .readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): { frontmatter: BlogFrontmatter; content: string } {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    // If you store slug in frontmatter, prefer it, otherwise fallback to filename.

    // safe date conversion
    let publishDate = data.publishDate;
    if (publishDate instanceof Date) {
        try {
            publishDate = publishDate.toISOString().split('T')[0];
        } catch (e) {
            publishDate = new Date().toISOString().split('T')[0];
        }
    } else if (typeof publishDate !== 'string') {
        publishDate = new Date().toISOString().split('T')[0];
    }

    const frontmatter = {
        slug: (data.slug as string) ?? slug,
        title: (data.title as string) ?? 'Untitled Post',
        excerpt: (data.excerpt as string) ?? '',
        author: (data.author as string) ?? 'Model Mortgage',
        publishDate,
        category: (data.category as string) ?? 'General',
        tags: (data.tags as string[]) ?? [],
        featuredImage: (data.featuredImage as string),
        readTime: (data.readTime as number) ?? 5,
        metadata: data.metadata,
    } as BlogFrontmatter;

    return { frontmatter, content };
}

export function getAllPosts(): BlogFrontmatter[] {
    const slugs = getPostSlugs();
    const posts = slugs.map((s) => getPostBySlug(s).frontmatter);

    // Sort newest first
    posts.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
    return posts;
}
