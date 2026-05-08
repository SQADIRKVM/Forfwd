"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Resend } from "resend";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function saveContactMessageAction(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Validate schema with Zod
    const validated = ContactSchema.parse({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });

    // Save message inside Neon PostgreSQL using Prisma
    const saved = await prisma.contactMessage.create({
      data: validated,
    });

    // Dispatch email notification if Resend is configured
    if (resend) {
      try {
        const recipient = process.env.CONTACT_EMAIL_RECIPIENT ?? "sarhanqadir@gmail.com";
        await resend.emails.send({
          from: "Forfwd Contact <onboarding@resend.dev>",
          to: recipient,
          subject: `New Contact Submission: ${validated.subject}`,
          html: `
            <div style="font-family: sans-serif; padding: 24px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4f46e5; font-size: 20px; font-weight: 800; margin-bottom: 16px; font-family: system-ui, -apple-system, sans-serif;">New Forfwd Contact Form Submission</h2>
              <div style="background-color: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #f3f4f6; margin-bottom: 20px;">
                <p style="margin: 4px 0; font-size: 14px; color: #4b5563;"><strong style="color: #111827;">Sender Name:</strong> ${validated.name}</p>
                <p style="margin: 4px 0; font-size: 14px; color: #4b5563;"><strong style="color: #111827;">Sender Email:</strong> ${validated.email}</p>
                <p style="margin: 4px 0; font-size: 14px; color: #4b5563;"><strong style="color: #111827;">Subject:</strong> ${validated.subject}</p>
              </div>
              <p style="font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 8px;">Message Details:</p>
              <div style="white-space: pre-wrap; background-color: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #f3f4f6; font-size: 14px; line-height: 1.6; color: #374151;">${validated.message}</div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="font-size: 11px; color: #9ca3af; text-align: center;">This message was generated automatically from Forfwd SaaS. Record Saved in Neon DB ID: ${saved.id}</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Failed to dispatch Resend email notification:", emailErr);
      }
    }

    return { success: true, id: saved.id };
  } catch (err: any) {
    console.error("Error saving contact message:", err);
    return { success: false, error: err.message ?? "Failed to save message" };
  }
}
