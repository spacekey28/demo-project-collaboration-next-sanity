import { defineField, defineType } from "sanity";

export default defineType({
  name: "pricingTier",
  type: "document",
  title: "Pricing Tier",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Tier Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "monthlyPrice",
      type: "number",
      title: "Monthly Price",
      description: "Price per month (e.g., 29 for $29/month)",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "yearlyPrice",
      type: "number",
      title: "Yearly Price",
      description: "Price per year (e.g., 290 for $290/year)",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "features",
      type: "array",
      title: "Features",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "buttonLabel",
      type: "string",
      title: "Button Label",
      description: "CTA button text (e.g., 'Get Started', 'Start Free Trial')",
      initialValue: "Get Started",
    }),
    defineField({
      name: "popular",
      type: "boolean",
      title: "Popular Plan",
      description: "Mark this plan as popular/recommended",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "monthlyPrice",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `$${subtitle}/month`,
      };
    },
  },
});
