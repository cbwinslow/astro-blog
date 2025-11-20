/**
 * SEOMetadataBuilder - Build SEO metadata for pages
 */

import type { SeoMetadata } from "@/types/blog";
import type { CollectionEntry } from "astro:content";
import { SITE } from "@/config";

export class SEOMetadataBuilder {
  private metadata: Partial<SeoMetadata> = {};

  /**
   * Set basic SEO metadata
   */
  setBasicMetadata(title: string, description: string): this {
    this.metadata.title = title;
    this.metadata.description = description;
    return this;
  }

  /**
   * Set canonical URL
   */
  setCanonical(url: string): this {
    this.metadata.canonical = url;
    return this;
  }

  /**
   * Set Open Graph metadata
   */
  setOpenGraph(og: SeoMetadata["openGraph"]): this {
    this.metadata.openGraph = og;
    return this;
  }

  /**
   * Set Twitter metadata
   */
  setTwitter(twitter: SeoMetadata["twitter"]): this {
    this.metadata.twitter = twitter;
    return this;
  }

  /**
   * Set schema.org structured data
   */
  setSchema(schema: Record<string, unknown>): this {
    this.metadata.schema = schema;
    return this;
  }

  /**
   * Build from blog post
   */
  static fromBlogPost(
    post: CollectionEntry<"blog">,
    baseUrl: string
  ): SEOMetadataBuilder {
    const builder = new SEOMetadataBuilder();
    const url = `${baseUrl}/posts/${post.id}`;
    const imageUrl = post.data.ogImage
      ? `${baseUrl}${post.data.ogImage}`
      : `${baseUrl}/og.png`;

    builder.setBasicMetadata(post.data.title, post.data.description);
    builder.setCanonical(post.data.canonicalURL || url);

    builder.setOpenGraph({
      title: post.data.title,
      description: post.data.description,
      image: imageUrl,
      type: "article",
    });

    builder.setTwitter({
      card: "summary_large_image",
      site: SITE.website,
      creator: post.data.author,
    });

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.data.title,
      description: post.data.description,
      image: imageUrl,
      datePublished: post.data.pubDatetime.toISOString(),
      ...(post.data.modDatetime && {
        dateModified: post.data.modDatetime.toISOString(),
      }),
      author: {
        "@type": "Person",
        name: post.data.author,
      },
      publisher: {
        "@type": "Organization",
        name: SITE.title,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/favicon.svg`,
        },
      },
    };

    builder.setSchema(schema);
    return builder;
  }

  /**
   * Build metadata object
   */
  build(): SeoMetadata {
    if (!this.metadata.title || !this.metadata.description) {
      throw new Error("Title and description are required");
    }

    return this.metadata as SeoMetadata;
  }

  /**
   * Get partial metadata (useful for progressive building)
   */
  getPartial(): Partial<SeoMetadata> {
    return this.metadata;
  }

  /**
   * Reset builder
   */
  reset(): this {
    this.metadata = {};
    return this;
  }

  /**
   * Create a copy of this builder
   */
  clone(): SEOMetadataBuilder {
    const builder = new SEOMetadataBuilder();
    builder.metadata = { ...this.metadata };
    return builder;
  }
}
