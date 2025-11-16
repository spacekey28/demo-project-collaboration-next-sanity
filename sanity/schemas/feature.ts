import { defineField, defineType } from "sanity";

export default defineType({
  name: "feature",
  type: "document",
  title: "Feature",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      type: "string",
      title: "Icon Name",
      description: "Lucide icon name (e.g., 'users', 'zap', 'shield')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Category",
      options: {
        list: [
          { title: "Collaboration", value: "collaboration" },
          { title: "Productivity", value: "productivity" },
          { title: "Security", value: "security" },
          { title: "Integration", value: "integration" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
    },
  },
});
