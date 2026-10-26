import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO || "oussamajb24@gmail.com";

    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: toEmail,
        replyTo: email,
        subject: `[Portfolio Contact] ${subject} from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      });
    } else {
      console.log(
        `[Contact Form - Mock Mode] Email not sent to API (RESEND_API_KEY not configured). Message received from ${name} (${email}): ${subject}`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message processed successfully",
    });
  } catch (err: unknown) {
    console.error("Error sending contact email:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
