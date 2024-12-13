import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, fileUrl, studentId } = body;

    const report = await prisma.report.create({
      data: {
        title,
        description,
        fileUrl,
        studentId,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        student: true,
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}