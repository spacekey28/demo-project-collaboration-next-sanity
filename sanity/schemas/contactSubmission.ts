import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactSubmission",
  type: "document",
  title: "Contact Submission",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "email",
      type: "email",
      title: "Email",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "company",
      type: "string",
      title: "Company",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "message",
      type: "text",
      title: "Message",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      type: "datetime",
      title: "Submitted At",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Progress", value: "in-progress" },
          { title: "Replied", value: "replied" },
          { title: "Closed", value: "closed" },
        ],
      },
      initialValue: "new",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      return {
        title,
        subtitle: `${subtitle} • ${status}`,
      };
    },
  },
});
