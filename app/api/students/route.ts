import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, rollNumber, class: className, semester, email } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!rollNumber?.trim()) {
      return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
    }
    if (!className?.trim()) {
      return NextResponse.json({ error: 'Class is required' }, { status: 400 });
    }
    if (!semester?.trim()) {
      return NextResponse.json({ error: 'Semester is required' }, { status: 400 });
    }
    if (!email?.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Check for duplicate roll number
    const existingStudent = await prisma.student.findUnique({
      where: { rollNumber: rollNumber.trim() },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this roll number already exists' },
        { status: 409 }
      );
    }

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        rollNumber: rollNumber.trim(),
        class: className.trim(),
        semester: semester.trim(),
        email: email.trim().toLowerCase(),
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Failed to create student:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Student with this roll number already exists' },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Failed to create student' },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
} 