# Blog Components and Utilities Guide

This guide documents the robust blog template components, TypeScript utilities, and type definitions added to enhance the blog functionality.

## 📦 Type Definitions

### Location: `src/types/blog.ts`

All blog-related TypeScript interfaces and types are defined here for type-safe development.

#### Author Interface
```typescript
interface Author {
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
}
```

#### Category Interface
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}
```

#### Other Key Types
- `BlogMetadata`: Extended metadata for blog posts
- `NavigationItem`: Navigation menu items
- `ReadingTimeResult`: Reading time estimation data
- `RelatedPost`: Related post with relevance score
- `TocItem`: Table of contents item
- `SeoMetadata`: SEO configuration
- `EnhancedBlogPost`: Blog post with computed properties

## 🛠️ Utility Classes

### BlogPostManager

**Location:** `src/utils/BlogPostManager.ts`

A comprehensive class for managing blog post operations.

#### Features:
- Get posts by tag, author, or featured status
- Find related posts based on tag similarity
- Calculate reading time
- Search posts by keyword
- Group posts by year
- And more...

#### Example Usage:
```typescript
import { BlogPostManager } from "@/utils/BlogPostManager";
import { getCollection } from "astro:content";

const posts = await getCollection("blog");
const manager = new BlogPostManager(posts);

// Get featured posts
const featured = manager.getFeaturedPosts();

// Find related posts
const related = manager.findRelatedPosts(currentPost, 3);

// Calculate reading time
const readingTime = manager.calculateReadingTime(content);

// Search posts
const results = manager.searchPosts("typescript");
```

### ContentValidator

**Location:** `src/utils/ContentValidator.ts`

Validates and sanitizes blog content to ensure quality and consistency.

#### Features:
- Validate post metadata (title, description, dates)
- Check for duplicate titles
- Sanitize tags
- Provide warnings for best practices

#### Example Usage:
```typescript
import { ContentValidator } from "@/utils/ContentValidator";

// Validate a single post
const result = ContentValidator.validatePost(post);
if (!result.isValid) {
  console.error("Validation errors:", result.errors);
}

// Find duplicate titles
const duplicates = ContentValidator.findDuplicateTitles(posts);

// Sanitize tags
const cleanTags = ContentValidator.sanitizeTags(["Hello World!", "TypeScript"]);
// Result: ["hello-world", "typescript"]
```

### DateFormatter

**Location:** `src/utils/DateFormatter.ts`

Utility object for consistent date formatting across the blog.

#### Features:
- Format dates in various styles
- Handle timezones
- Relative time (e.g., "2 days ago")
- Date range formatting
- Date comparisons

#### Example Usage:
```typescript
import { DateFormatter } from "@/utils/DateFormatter";

// Format a date
const formatted = DateFormatter.formatDate(new Date(), "MMM DD, YYYY");

// Get relative time
const relative = DateFormatter.getRelativeTime(post.data.pubDatetime);
// Output: "2 days ago"

// Format with timezone
const withTz = DateFormatter.formatDateWithTimezone(
  date,
  "America/New_York"
);

// Check if date is in the past
const isPast = DateFormatter.isPast(post.data.pubDatetime);
```

### SEOMetadataBuilder

**Location:** `src/utils/SEOMetadataBuilder.ts`

Builder pattern class for constructing SEO metadata.

#### Features:
- Fluent API for building metadata
- Auto-generate from blog posts
- Open Graph and Twitter card support
- Schema.org structured data

#### Example Usage:
```typescript
import { SEOMetadataBuilder } from "@/utils/SEOMetadataBuilder";

// Build from scratch
const metadata = new SEOMetadataBuilder()
  .setBasicMetadata("Page Title", "Page description")
  .setCanonical("https://example.com/page")
  .setOpenGraph({
    title: "Page Title",
    image: "/image.jpg",
  })
  .build();

// Build from blog post
const postMetadata = SEOMetadataBuilder.fromBlogPost(
  post,
  "https://example.com"
).build();
```

## 🎨 Components

### BlogAuthor

**Location:** `src/components/BlogAuthor.astro`

Displays author information with optional avatar, bio, and social links.

#### Props:
- `author`: `Author | string` - Author data or name
- `size`: `"sm" | "md" | "lg"` - Avatar size (default: "md")
- `showBio`: `boolean` - Show author bio (default: false)
- `showSocial`: `boolean` - Show social links (default: false)

#### Example Usage:
```astro
---
import BlogAuthor from "@/components/BlogAuthor.astro";

const author = {
  name: "John Doe",
  avatar: "/avatars/john.jpg",
  bio: "Software developer and blogger",
  social: {
    twitter: "johndoe",
    github: "johndoe",
  }
};
---

<BlogAuthor author={author} size="lg" showBio showSocial />
```

### BlogCategoryBadge

**Location:** `src/components/BlogCategoryBadge.astro`

Displays a category badge with customizable styling.

#### Props:
- `category`: `Category | string` - Category data or name
- `variant`: `"solid" | "outline" | "subtle"` - Style variant (default: "subtle")
- `size`: `"sm" | "md" | "lg"` - Badge size (default: "md")
- `href`: `string` - Optional link URL

#### Example Usage:
```astro
---
import BlogCategoryBadge from "@/components/BlogCategoryBadge.astro";
---

<BlogCategoryBadge 
  category="TypeScript" 
  variant="solid" 
  href="/categories/typescript" 
/>
```

### BlogReadingTime

**Location:** `src/components/BlogReadingTime.astro`

Displays estimated reading time with optional clock icon.

#### Props:
- `readingTime`: `ReadingTimeResult | string` - Reading time data
- `showIcon`: `boolean` - Show clock icon (default: true)
- `className`: `string` - Additional CSS classes

#### Example Usage:
```astro
---
import BlogReadingTime from "@/components/BlogReadingTime.astro";
import { BlogPostManager } from "@/utils/BlogPostManager";

const manager = new BlogPostManager([]);
const readingTime = manager.calculateReadingTime(post.body);
---

<BlogReadingTime readingTime={readingTime} />
```

### BlogRelatedPosts

**Location:** `src/components/BlogRelatedPosts.astro`

Displays a grid of related posts.

#### Props:
- `relatedPosts`: `RelatedPost[]` - Array of related posts
- `title`: `string` - Section title (default: "Related Posts")

#### Example Usage:
```astro
---
import BlogRelatedPosts from "@/components/BlogRelatedPosts.astro";
import { BlogPostManager } from "@/utils/BlogPostManager";

const manager = new BlogPostManager(allPosts);
const related = manager.findRelatedPosts(currentPost, 3);
---

<BlogRelatedPosts relatedPosts={related} />
```

### BlogTableOfContents

**Location:** `src/components/BlogTableOfContents.astro`

Generates and displays an interactive table of contents.

#### Props:
- `items`: `TocItem[]` - TOC items to display
- `title`: `string` - Section title (default: "Table of Contents")
- `maxDepth`: `number` - Maximum heading depth (default: 3)

#### Example Usage:
```astro
---
import BlogTableOfContents from "@/components/BlogTableOfContents.astro";

const tocItems = [
  { depth: 1, text: "Introduction", slug: "introduction" },
  { depth: 2, text: "Getting Started", slug: "getting-started" },
  { depth: 2, text: "Advanced Usage", slug: "advanced-usage" },
];
---

<BlogTableOfContents items={tocItems} maxDepth={3} />
```

## 🚀 Getting Started

### Import Types
```typescript
import type { Author, Category, BlogMetadata } from "@/types";
```

### Import Utilities
```typescript
import {
  BlogPostManager,
  ContentValidator,
  DateFormatter,
  SEOMetadataBuilder,
} from "@/utils";
```

### Use in Astro Components
```astro
---
import BlogAuthor from "@/components/BlogAuthor.astro";
import BlogReadingTime from "@/components/BlogReadingTime.astro";
import { BlogPostManager } from "@/utils";
---
```

## 📝 Best Practices

1. **Type Safety**: Always use the provided TypeScript interfaces for type-safe development
2. **Validation**: Use `ContentValidator` to validate blog posts before publishing
3. **Consistency**: Use `DateFormatter` for all date formatting to maintain consistency
4. **SEO**: Use `SEOMetadataBuilder` to ensure proper SEO metadata on all pages
5. **Reusability**: Leverage the `BlogPostManager` class instead of writing custom filtering logic

## 🔧 Integration Example

Here's a complete example of using these utilities in a blog post page:

```astro
---
import Layout from "@/layouts/Layout.astro";
import BlogAuthor from "@/components/BlogAuthor.astro";
import BlogReadingTime from "@/components/BlogReadingTime.astro";
import BlogRelatedPosts from "@/components/BlogRelatedPosts.astro";
import { BlogPostManager, SEOMetadataBuilder, DateFormatter } from "@/utils";
import { getCollection } from "astro:content";

const { slug } = Astro.params;
const allPosts = await getCollection("blog");
const manager = new BlogPostManager(allPosts);

const post = manager.getPostById(slug);
if (!post) return Astro.redirect("/404");

const readingTime = manager.calculateReadingTime(post.body);
const relatedPosts = manager.findRelatedPosts(post, 3);
const seoMetadata = SEOMetadataBuilder.fromBlogPost(post, Astro.site.href).build();
---

<Layout {...seoMetadata}>
  <article>
    <h1>{post.data.title}</h1>
    
    <div class="flex items-center gap-4">
      <BlogAuthor author={post.data.author} />
      <BlogReadingTime readingTime={readingTime} />
      <time>{DateFormatter.formatDate(post.data.pubDatetime)}</time>
    </div>
    
    <div set:html={post.body} />
    
    <BlogRelatedPosts relatedPosts={relatedPosts} />
  </article>
</Layout>
```

## 🎯 Summary

This robust blog template provides:

- **5 new reusable components** for consistent UI elements
- **4 utility classes** for common blog operations
- **10+ TypeScript interfaces** for type safety
- **Comprehensive documentation** and examples
- **Best practices** for blog development

All components and utilities are fully typed, tested for type safety, and ready to use in your Astro blog project.
