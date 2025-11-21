import { NextResponse } from "next/server";
import { z } from "zod";

import { writeClient } from "@/lib/sanity/client";

const contactSubmissionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactSubmissionData = z.infer<typeof contactSubmissionSchema>;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSubmissionSchema.parse(body);

    const submission: ContactSubmissionData = {
      name: validatedData.name,
      email: validatedData.email,
      company: validatedData.company,
      message: validatedData.message,
    };

    // Create contact submission document in Sanity
    const doc = {
      _type: "contactSubmission",
      name: submission.name,
      email: submission.email,
      company: submission.company,
      message: submission.message,
      submittedAt: new Date().toISOString(),
      status: "new",
    };

    const result = await writeClient.create(doc);

    return NextResponse.json(
      {
        success: true,
        id: result._id,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Error creating contact submission:", error);

    return NextResponse.json(
      {
        error: "Failed to create contact submission",
      },
      { status: 500 },
    );
  }
}
