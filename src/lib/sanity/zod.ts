import { z } from "zod";

/**
 * Zod schemas for runtime validation of Sanity content
 * These schemas ensure type safety and validate data fetched from Sanity
 */

// Common schemas
const imageSchema = z.object({
  _type: z.literal("image"),
  asset: z.object({
    _ref: z.string(),
    _type: z.literal("reference"),
  }),
  alt: z.string().optional(),
});

const slugSchema = z.object({
  _type: z.literal("slug"),
  current: z.string(),
});

// Portable Text block schema (simplified)
const portableTextBlockSchema = z.object({
  _type: z.string(),
  _key: z.string(),
  children: z.array(
    z.object({
      _type: z.string(),
      _key: z.string().optional(),
      text: z.string().optional(),
      marks: z.array(z.string()).optional(),
    }),
  ),
  markDefs: z.array(z.unknown()).optional(),
  style: z.string().optional(),
  level: z.number().optional(),
  listItem: z.string().optional(),
});

const portableTextSchema = z.array(
  z.union([portableTextBlockSchema, imageSchema]),
);

// Site Settings Schema
export const siteSettingsSchema = z.object({
  _id: z.string(),
  _type: z.literal("siteSettings"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  siteTitle: z.string(),
  logo: imageSchema.nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  navLinks: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
      }),
    )
    .nullable()
    .optional(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

// Home Page Schema (hero fields)
export const homePageSchema = z.object({
  _id: z.string(),
  _type: z.literal("pageHome"),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  cta: z.string().nullable().optional(),
});

export type HomePage = z.infer<typeof homePageSchema>;

// Feature Schema
export const featureSchema = z.object({
  _id: z.string(),
  _type: z.literal("feature"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.string().nullable().optional(),
});

export type Feature = z.infer<typeof featureSchema>;

// Pricing Tier Schema
export const pricingTierSchema = z.object({
  _id: z.string(),
  _type: z.literal("pricingTier"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  name: z.string(),
  monthlyPrice: z.number(),
  yearlyPrice: z.number(),
  features: z.array(z.string()),
  buttonLabel: z.string().nullable().optional(),
  popular: z.boolean().nullable().optional(),
});

export type PricingTier = z.infer<typeof pricingTierSchema>;

// Testimonial Schema
export const testimonialSchema = z.object({
  _id: z.string(),
  _type: z.literal("testimonial"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  name: z.string(),
  company: z.string(),
  quote: z.string(),
  avatar: imageSchema.nullable().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;

// Author Schema (simplified reference)
export const authorReferenceSchema = z.object({
  _type: z.literal("reference"),
  _ref: z.string(),
  _weak: z.boolean().optional(),
  _strengthenOnPublish: z.boolean().optional(),
});

// Author Schema (full)
export const authorSchema = z.object({
  _id: z.string(),
  _type: z.literal("author"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  name: z.string(),
  slug: slugSchema,
  photo: imageSchema.nullable().optional(),
  bio: z.string().nullable().optional(),
});

export type Author = z.infer<typeof authorSchema>;

// Blog Post Schema
export const blogPostSchema = z.object({
  _id: z.string(),
  _type: z.literal("blogPost"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  title: z.string(),
  slug: slugSchema,
  author: authorReferenceSchema,
  publishedAt: z.string(),
  updatedAt: z.string().nullable().optional(),
  coverImage: imageSchema.nullable().optional(),
  excerpt: z.string().nullable().optional(),
  content: portableTextSchema,
  tags: z.array(z.string()).nullable().optional(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;

// Blog Post with populated author
export const blogPostWithAuthorSchema = blogPostSchema.extend({
  author: authorSchema,
});

export type BlogPostWithAuthor = z.infer<typeof blogPostWithAuthorSchema>;

// Case Study Schema
export const caseStudySchema = z.object({
  _id: z.string(),
  _type: z.literal("caseStudy"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  title: z.string(),
  client: z.string(),
  summary: z.string().nullable().optional(),
  logo: imageSchema.nullable().optional(),
  image: imageSchema.nullable().optional(),
  body: portableTextSchema.nullable().optional(),
  outcomes: z
    .array(
      z.object({
        metric: z.string(),
        value: z.string(),
      }),
    )
    .nullable()
    .optional(),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;

// Doc Page Schema
export const docPageReferenceSchema = z.object({
  _type: z.literal("reference"),
  _ref: z.string(),
  _weak: z.boolean().optional(),
  _strengthenOnPublish: z.boolean().optional(),
});

export const docPageSchema = z.object({
  _id: z.string(),
  _type: z.literal("docPage"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  title: z.string(),
  slug: slugSchema,
  category: z.string().nullable().optional(),
  order: z.number().nullable().optional(),
  content: portableTextSchema,
  parent: docPageReferenceSchema.nullable().optional(),
});

export type DocPage = z.infer<typeof docPageSchema>;

// Contact Submission Schema
export const contactSubmissionSchema = z.object({
  _id: z.string(),
  _type: z.literal("contactSubmission"),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  _rev: z.string(),
  name: z.string(),
  email: z.string().email(),
  company: z.string(),
  message: z.string(),
  submittedAt: z.string(),
  status: z
    .enum(["new", "in-progress", "replied", "closed"])
    .nullable()
    .optional(),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

// Helper function to validate and parse Sanity data
export function validateSanityData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T {
  return schema.parse(data);
}

// Helper function to safely validate (returns result instead of throwing)
export function safeValidateSanityData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
