/**
 * BlogPostManager - A class to manage blog post operations
 */

import type { CollectionEntry } from "astro:content";
import type { RelatedPost, ReadingTimeResult } from "@/types/blog";
import getSortedPosts from "./getSortedPosts";

export class BlogPostManager {
  private posts: CollectionEntry<"blog">[];

  constructor(posts: CollectionEntry<"blog">[]) {
    this.posts = getSortedPosts(posts);
  }

  /**
   * Get posts by tag
   */
  getPostsByTag(tag: string): CollectionEntry<"blog">[] {
    return this.posts.filter(post => post.data.tags.includes(tag));
  }

  /**
   * Get featured posts
   */
  getFeaturedPosts(): CollectionEntry<"blog">[] {
    return this.posts.filter(post => post.data.featured === true);
  }

  /**
   * Get posts by author
   */
  getPostsByAuthor(author: string): CollectionEntry<"blog">[] {
    return this.posts.filter(post => post.data.author === author);
  }

  /**
   * Get recent posts
   */
  getRecentPosts(limit: number = 5): CollectionEntry<"blog">[] {
    return this.posts.slice(0, limit);
  }

  /**
   * Find related posts based on tags
   */
  findRelatedPosts(
    currentPost: CollectionEntry<"blog">,
    limit: number = 3
  ): RelatedPost[] {
    const currentTags = currentPost.data.tags;

    const scoredPosts = this.posts
      .filter(post => post.id !== currentPost.id)
      .map(post => {
        const commonTags = post.data.tags.filter(tag =>
          currentTags.includes(tag)
        );
        const relevanceScore = commonTags.length / currentTags.length;

        return {
          post,
          relevanceScore,
        };
      })
      .filter(item => item.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return scoredPosts.slice(0, limit);
  }

  /**
   * Calculate reading time for content
   */
  calculateReadingTime(content: string): ReadingTimeResult {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);

    return {
      minutes,
      text: `${minutes} min read`,
      words,
    };
  }

  /**
   * Get post by slug or id
   */
  getPostById(id: string): CollectionEntry<"blog"> | undefined {
    return this.posts.find(post => post.id === id);
  }

  /**
   * Search posts by keyword
   */
  searchPosts(keyword: string): CollectionEntry<"blog">[] {
    const lowerKeyword = keyword.toLowerCase();

    return this.posts.filter(
      post =>
        post.data.title.toLowerCase().includes(lowerKeyword) ||
        post.data.description.toLowerCase().includes(lowerKeyword) ||
        post.data.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Get all posts
   */
  getAllPosts(): CollectionEntry<"blog">[] {
    return this.posts;
  }

  /**
   * Get total post count
   */
  getPostCount(): number {
    return this.posts.length;
  }

  /**
   * Group posts by year
   */
  groupPostsByYear(): Map<number, CollectionEntry<"blog">[]> {
    const groupedPosts = new Map<number, CollectionEntry<"blog">[]>();

    this.posts.forEach(post => {
      const year = new Date(post.data.pubDatetime).getFullYear();
      const yearPosts = groupedPosts.get(year) || [];
      yearPosts.push(post);
      groupedPosts.set(year, yearPosts);
    });

    return groupedPosts;
  }
}
