import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  type: "document",
  title: "Site Settings",
  fields: [
    defineField({
      name: "siteTitle",
      type: "string",
      title: "Site Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Logo",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "metaDescription",
      type: "text",
      title: "Meta Description",
      description: "Used for SEO meta tags",
    }),
    defineField({
      name: "navLinks",
      type: "array",
      title: "Navigation Links",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "href", type: "string", title: "URL" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "siteTitle",
    },
  },
});
