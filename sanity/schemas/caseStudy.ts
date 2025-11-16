import { defineField, defineType } from "sanity";

export default defineType({
  name: "caseStudy",
  type: "document",
  title: "Case Study",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      type: "string",
      title: "Client Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      type: "text",
      title: "Summary",
      description: "Brief summary of the case study",
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Client Logo",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Featured Image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Body Content",
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
      ],
    }),
    defineField({
      name: "outcomes",
      type: "array",
      title: "Outcome Metrics",
      description: "Key results/metrics achieved",
      of: [
        {
          type: "object",
          fields: [
            { name: "metric", type: "string", title: "Metric" },
            { name: "value", type: "string", title: "Value" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "client",
      media: "image",
    },
  },
});
