import { NextRequest, NextResponse } from "next/server";
import { addEnquiry } from "@/lib/firebase/firestore";
import { Enquiry } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentName, parentName, phone, whatsapp, email, message, course, board } = body;

    // Server-side validation — mirrors client Zod schema
    if (!studentName?.trim() || studentName.trim().length < 2)
      return NextResponse.json({ error: "Student name must be at least 2 characters." }, { status: 400 });

    if (!phone?.trim() || !/^[6-9]\d{9}$/.test(phone.trim()))
      return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });

    if (!body.class?.trim())
      return NextResponse.json({ error: "Please select a class." }, { status: 400 });

    if (!board?.trim())
      return NextResponse.json({ error: "Please select a board." }, { status: 400 });

    if (!message?.trim() || message.trim().length < 10)
      return NextResponse.json({ error: "Message must be at least 10 characters." }, { status: 400 });

    const enquiry: Omit<Enquiry, "id"> = {
      studentName: studentName.trim(),
      parentName: parentName?.trim() || "",
      phone: phone.trim(),
      whatsapp: whatsapp?.trim() || phone.trim(),
      email: email?.trim() || "",
      class: body.class?.trim() || "",
      board: board?.trim() || "",
      course: course?.trim() || "",
      message: message.trim(),
      status: "New",
      createdAt: new Date().toISOString(),
    };

    await addEnquiry(enquiry);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit enquiry." }, { status: 500 });
  }
}
