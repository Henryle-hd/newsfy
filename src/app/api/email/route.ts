import { NextRequest, NextResponse } from "next/server";
import sendEmail from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, content } = await req.json();

    if (!to) {
      return NextResponse.json({ success: false, message: "Email recipient (to) is required" }, { status: 400 });
    }

    if (!subject) {
      return NextResponse.json({ success: false, message: "Email subject is required" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ success: false, message: "Email content is required" }, { status: 400 });
    }

    const senderName = "Newsfy";
    const sent = await sendEmail(
      subject,
      content,
      to,
      senderName
    );

    if (sent) {
      return NextResponse.json({ success: true, message: "Email sent successfully." });
    } else {
      return NextResponse.json({ success: false, message: "Failed to send email." }, { status: 500 });
    }
  } catch (error) {return NextResponse.json({ success: false, message: "Error sending email.", error: String(error) }, { status: 500 });
  }
}