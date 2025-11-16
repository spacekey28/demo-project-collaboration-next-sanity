import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  type: "document",
  title: "Testimonial",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Author Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "company",
      type: "string",
      title: "Company",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quote",
      type: "text",
      title: "Testimonial Quote",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avatar",
      type: "image",
      title: "Avatar",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "rating",
      type: "number",
      title: "Rating",
      description: "Rating out of 5",
      validation: (Rule) => Rule.min(0).max(5).integer(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "company",
      media: "avatar",
    },
  },
});
