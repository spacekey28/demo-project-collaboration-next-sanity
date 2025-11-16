import { defineField, defineType } from "sanity";

export default defineType({
  name: "docPage",
  type: "document",
  title: "Documentation Page",
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
      name: "category",
      type: "string",
      title: "Category",
      description: "Documentation category/section",
      options: {
        list: [
          { title: "Getting Started", value: "getting-started" },
          { title: "Guides", value: "guides" },
          { title: "API Reference", value: "api" },
          { title: "Troubleshooting", value: "troubleshooting" },
        ],
      },
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Order",
      description: "Display order in category",
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
      name: "parent",
      type: "reference",
      title: "Parent Page",
      to: [{ type: "docPage" }],
      description: "Parent documentation page for navigation",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
    },
  },
});
