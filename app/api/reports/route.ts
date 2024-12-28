import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a report' },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['parentName', 'class', 'section', 'disease'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const report = await prisma.medicalReport.create({
      data: {
        studentId: session.user.id,
        name: session.user.name || '',
        rollNumber: session.user.rollNumber ?? '',
        ...data,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reports = await prisma.medicalReport.findMany({
      include: {
        student: true,
        reviewer: true,
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