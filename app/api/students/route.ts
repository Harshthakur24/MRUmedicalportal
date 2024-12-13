import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, rollNumber, class: className, semester, email } = body;

    const student = await prisma.student.create({
      data: {
        name,
        rollNumber,
        class: className,
        semester,
        email,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        reports: true,
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}