import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogPost",
  type: "document",
  title: "Blog Post",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      title: "Author",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Published At",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      type: "datetime",
      title: "Updated At",
      description: "Last updated date",
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Cover Image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "excerpt",
      type: "text",
      title: "Excerpt",
      description: "Short description for blog listing",
    }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      of: [
        {
          type: "block",
        },
        {
          type: "image",
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
            },
          ],
        },
        {
          type: "code",
          title: "Code Block",
          options: {
            language: "typescript",
            languageAlternatives: [
              { title: "TypeScript", value: "typescript" },
              { title: "JavaScript", value: "javascript" },
              { title: "HTML", value: "html" },
              { title: "CSS", value: "css" },
              { title: "JSON", value: "json" },
              { title: "Bash", value: "bash" },
            ],
            withFilename: true,
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      title: "Tags",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "coverImage",
      publishedAt: "publishedAt",
    },
    prepare({ title, author, media, publishedAt }) {
      return {
        title,
        subtitle: `By ${author} • ${publishedAt ? new Date(publishedAt).toLocaleDateString() : "Draft"}`,
        media,
      };
    },
  },
});
