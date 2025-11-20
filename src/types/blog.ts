/**
 * Core type definitions for the blog system
 */

import type { CollectionEntry } from "astro:content";

/**
 * Author information interface
 */
export interface Author {
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

/**
 * Blog category interface
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

/**
 * Blog metadata interface extending the base blog entry
 */
export interface BlogMetadata {
  title: string;
  description: string;
  pubDatetime: Date;
  modDatetime?: Date | null;
  author: string;
  tags: string[];
  featured?: boolean;
  draft?: boolean;
  readingTime?: number;
  wordCount?: number;
  ogImage?: string;
  canonicalURL?: string;
}

/**
 * Navigation item interface
 */
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

/**
 * Reading time estimation result
 */
export interface ReadingTimeResult {
  minutes: number;
  text: string;
  words: number;
}

/**
 * Related post information
 */
export interface RelatedPost {
  post: CollectionEntry<"blog">;
  relevanceScore: number;
}

/**
 * Table of contents item
 */
export interface TocItem {
  depth: number;
  text: string;
  slug: string;
  children?: TocItem[];
}

/**
 * SEO metadata configuration
 */
export interface SeoMetadata {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
  };
  schema?: Record<string, unknown>;
}

/**
 * Blog post with computed properties
 */
export interface EnhancedBlogPost extends CollectionEntry<"blog"> {
  readingTime: ReadingTimeResult;
  relatedPosts?: RelatedPost[];
  tableOfContents?: TocItem[];
}
