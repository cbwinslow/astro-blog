/**
 * ContentValidator - Validates and sanitizes blog content
 */

import type { CollectionEntry } from "astro:content";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class ContentValidator {
  /**
   * Validate a blog post
   */
  static validatePost(post: CollectionEntry<"blog">): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!post.data.title || post.data.title.trim().length === 0) {
      errors.push("Title is required and cannot be empty");
    }

    if (!post.data.description || post.data.description.trim().length === 0) {
      errors.push("Description is required and cannot be empty");
    }

    if (!post.data.pubDatetime) {
      errors.push("Publication date is required");
    }

    // Length validations
    if (post.data.title && post.data.title.length > 100) {
      warnings.push("Title is longer than recommended (100 characters)");
    }

    if (post.data.description && post.data.description.length > 200) {
      warnings.push("Description is longer than recommended (200 characters)");
    }

    if (post.data.description && post.data.description.length < 50) {
      warnings.push("Description is shorter than recommended (50 characters)");
    }

    // Tags validation
    if (!post.data.tags || post.data.tags.length === 0) {
      warnings.push("Post should have at least one tag");
    }

    if (post.data.tags && post.data.tags.length > 10) {
      warnings.push("Too many tags (recommended: 3-5 tags)");
    }

    // Date validation
    if (post.data.pubDatetime) {
      const pubDate = new Date(post.data.pubDatetime);
      const now = new Date();

      if (pubDate > now && !post.data.draft) {
        warnings.push("Publication date is in the future for a non-draft post");
      }

      if (post.data.modDatetime) {
        const modDate = new Date(post.data.modDatetime);
        if (modDate < pubDate) {
          errors.push("Modified date cannot be before publication date");
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate multiple posts
   */
  static validatePosts(
    posts: CollectionEntry<"blog">[]
  ): Map<string, ValidationResult> {
    const results = new Map<string, ValidationResult>();

    posts.forEach(post => {
      results.set(post.id, this.validatePost(post));
    });

    return results;
  }

  /**
   * Check for duplicate titles
   */
  static findDuplicateTitles(
    posts: CollectionEntry<"blog">[]
  ): Map<string, CollectionEntry<"blog">[]> {
    const titleMap = new Map<string, CollectionEntry<"blog">[]>();

    posts.forEach(post => {
      const title = post.data.title.toLowerCase().trim();
      const existing = titleMap.get(title) || [];
      existing.push(post);
      titleMap.set(title, existing);
    });

    // Only return duplicates
    const duplicates = new Map<string, CollectionEntry<"blog">[]>();
    titleMap.forEach((posts, title) => {
      if (posts.length > 1) {
        duplicates.set(title, posts);
      }
    });

    return duplicates;
  }

  /**
   * Sanitize tag
   */
  static sanitizeTag(tag: string): string {
    return tag
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  /**
   * Sanitize tags array
   */
  static sanitizeTags(tags: string[]): string[] {
    return tags.map(tag => this.sanitizeTag(tag)).filter(tag => tag.length > 0);
  }
}
