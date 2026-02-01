import { blogPosts } from '../blogPosts'
import { BlogPost } from '@/lib/types/content'

describe('Blog Posts Content Structure', () => {
  describe('Array Structure', () => {
    it('should have at least 10 blog posts', () => {
      expect(blogPosts.length).toBeGreaterThanOrEqual(10)
    })

    it('should export an array of BlogPost objects', () => {
      expect(Array.isArray(blogPosts)).toBe(true)
      expect(blogPosts.length).toBeGreaterThan(0)
    })
  })

  describe('Blog Post Structure', () => {
    it('should have all required fields for each blog post', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(post).toHaveProperty('slug')
        expect(post).toHaveProperty('title')
        expect(post).toHaveProperty('excerpt')
        expect(post).toHaveProperty('content')
        expect(post).toHaveProperty('author')
        expect(post).toHaveProperty('publishDate')
        expect(post).toHaveProperty('category')
        expect(post).toHaveProperty('tags')
        expect(post).toHaveProperty('featuredImage')
        expect(post).toHaveProperty('readTime')
        expect(post).toHaveProperty('metadata')
      })
    })

    it('should have non-empty string values for required text fields', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(typeof post.slug).toBe('string')
        expect(post.slug.length).toBeGreaterThan(0)
        
        expect(typeof post.title).toBe('string')
        expect(post.title.length).toBeGreaterThan(0)
        
        expect(typeof post.excerpt).toBe('string')
        expect(post.excerpt.length).toBeGreaterThan(0)
        
        expect(typeof post.content).toBe('string')
        expect(post.content.length).toBeGreaterThan(0)
        
        expect(typeof post.author).toBe('string')
        expect(post.author.length).toBeGreaterThan(0)
        
        expect(typeof post.publishDate).toBe('string')
        expect(post.publishDate.length).toBeGreaterThan(0)
        
        expect(typeof post.category).toBe('string')
        expect(post.category.length).toBeGreaterThan(0)
        
        expect(typeof post.featuredImage).toBe('string')
        expect(post.featuredImage.length).toBeGreaterThan(0)
      })
    })

    it('should have valid date format for publishDate', () => {
      blogPosts.forEach((post: BlogPost) => {
        // Check if date is in YYYY-MM-DD format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        expect(post.publishDate).toMatch(dateRegex)
        
        // Check if date is valid
        const date = new Date(post.publishDate)
        expect(date.toString()).not.toBe('Invalid Date')
      })
    })

    it('should have positive readTime values', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(typeof post.readTime).toBe('number')
        expect(post.readTime).toBeGreaterThan(0)
      })
    })

    it('should have tags as an array with at least one tag', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(Array.isArray(post.tags)).toBe(true)
        expect(post.tags.length).toBeGreaterThan(0)
        post.tags.forEach(tag => {
          expect(typeof tag).toBe('string')
          expect(tag.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('Category Requirements', () => {
    it('should have all posts in the "Learn" category', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(post.category).toBe('Learn')
      })
    })
  })

  describe('Metadata Structure', () => {
    it('should have complete metadata for each post', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(post.metadata).toHaveProperty('title')
        expect(post.metadata).toHaveProperty('description')
        expect(post.metadata).toHaveProperty('keywords')
        expect(post.metadata).toHaveProperty('ogImage')
        expect(post.metadata).toHaveProperty('canonical')
      })
    })

    it('should have non-empty metadata values', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(typeof post.metadata.title).toBe('string')
        expect(post.metadata.title.length).toBeGreaterThan(0)
        
        expect(typeof post.metadata.description).toBe('string')
        expect(post.metadata.description.length).toBeGreaterThan(0)
        expect(post.metadata.description.length).toBeLessThanOrEqual(160)
        
        expect(Array.isArray(post.metadata.keywords)).toBe(true)
        expect(post.metadata.keywords.length).toBeGreaterThan(0)
        
        expect(typeof post.metadata.ogImage).toBe('string')
        expect(post.metadata.ogImage!.length).toBeGreaterThan(0)
        
        expect(typeof post.metadata.canonical).toBe('string')
        expect(post.metadata.canonical!.length).toBeGreaterThan(0)
      })
    })

    it('should have canonical URLs matching blog post slugs', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(post.metadata.canonical).toBe(`/blog/${post.slug}`)
      })
    })
  })

  describe('Unique Identifiers', () => {
    it('should have unique slugs for all posts', () => {
      const slugs = blogPosts.map(post => post.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(slugs.length)
    })

    it('should have unique titles for all posts', () => {
      const titles = blogPosts.map(post => post.title)
      const uniqueTitles = new Set(titles)
      expect(uniqueTitles.size).toBe(titles.length)
    })
  })

  describe('Content Quality', () => {
    it('should have substantial content for each post', () => {
      blogPosts.forEach((post: BlogPost) => {
        // Content should be at least 500 characters
        expect(post.content.length).toBeGreaterThan(500)
      })
    })

    it('should have reasonable excerpt length', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(post.excerpt.length).toBeGreaterThan(50)
        expect(post.excerpt.length).toBeLessThan(300)
      })
    })
  })

  describe('Author Information', () => {
    it('should have valid author names', () => {
      const validAuthors = ['Matthew Bramow', 'Rolston Nicholls']
      blogPosts.forEach((post: BlogPost) => {
        expect(validAuthors).toContain(post.author)
      })
    })
  })

  describe('Image Paths', () => {
    it('should have valid image paths', () => {
      blogPosts.forEach((post: BlogPost) => {
        expect(post.featuredImage).toMatch(/^\/images\/blog\//)
        expect(post.metadata.ogImage).toMatch(/^\/images\/blog\//)
      })
    })
  })
})
