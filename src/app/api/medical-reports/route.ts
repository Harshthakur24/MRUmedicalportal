import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.role === 'STUDENT') {
            const reports = await prisma.medicalReport.findMany({
                where: { studentId: session.user.id },
                orderBy: { submissionDate: 'desc' }
            });
            return NextResponse.json(reports);
        }

        let reports;
        const department = typeof session.user.department === 'string' ? session.user.department : undefined;

        switch (session.user.role) {
            case 'PROGRAM_COORDINATOR':
                reports = await prisma.medicalReport.findMany({
                    where: {
                        ...(department ? { department } : {}),
                        OR: [
                            { approvedByProgramCoordinator: false },
                            { approvedByProgramCoordinator: true, approvedByHOD: false }
                        ]
                    },
                    include: {
                        student: {
                            select: {
                                name: true,
                                email: true,
                                rollNumber: true,
                                department: true,
                                className: true
                            }
                        }
                    },
                    orderBy: { submissionDate: 'desc' }
                });
                break;

            case 'HOD':
                reports = await prisma.medicalReport.findMany({
                    where: {
                        ...(department ? { department } : {}),
                        approvedByProgramCoordinator: true,
                        OR: [
                            { approvedByHOD: false },
                            { approvedByHOD: true, approvedByDeanAcademics: false }
                        ]
                    },
                    include: {
                        student: {
                            select: {
                                name: true,
                                email: true,
                                rollNumber: true,
                                department: true,
                                className: true
                            }
                        }
                    },
                    orderBy: { submissionDate: 'desc' }
                });
                break;

            case 'DEAN_ACADEMICS':
                reports = await prisma.medicalReport.findMany({
                    where: {
                        approvedByProgramCoordinator: true,
                        approvedByHOD: true,
                        approvedByDeanAcademics: false
                    },
                    include: {
                        student: {
                            select: {
                                name: true,
                                email: true,
                                rollNumber: true,
                                department: true,
                                className: true
                            }
                        }
                    },
                    orderBy: { submissionDate: 'desc' }
                });
                break;
        }

        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only students can submit reports' }, { status: 403 });
    }

    const data = await request.json();
    
    const report = await prisma.medicalReport.create({
      data: {
        ...data,
        studentId: session.user.id,
        studentName: session.user.name,
        rollNumber: session.user.rollNumber,
        department: session.user.department,
        currentApprovalLevel: 'PENDING',
        status: 'PENDING'
      }
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 