
import { getAllPosts } from '@/lib/blog';

console.log('Starting debug of getAllPosts...');
try {
    const posts = getAllPosts();
    console.log(`Found ${posts.length} posts.`);
    if (posts.length > 0) {
        console.log('First post data:', JSON.stringify(posts[0], null, 2));
        console.log('First post keys:', Object.keys(posts[0]));
    } else {
        console.log('No posts found.');
    }
} catch (error) {
    console.error('Error fetching posts:', error);
}
