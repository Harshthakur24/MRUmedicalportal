import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteContext {
    params: {
        id: string;
    };
}

export async function POST(
    request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();
        const { id } = params;
        const data = await request.json() as { comment: string; approved: boolean };

        if (!session?.user || session.user.role !== 'PROGRAM_COORDINATOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the current report to check department
        const currentReport = await prisma.medicalReport.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        department: true
                    }
                }
            }
        });

        if (!currentReport) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        // Verify PC is from same department as student
        if (session.user.department !== currentReport.student?.department) {
            return NextResponse.json({ error: 'Unauthorized: Department mismatch' }, { status: 403 });
        }

        const report = await prisma.medicalReport.update({
            where: { id },
            data: {
                approvedByProgramCoordinator: data.approved,
                programCoordinatorComment: data.comment,
                currentApprovalLevel: data.approved ? 'HOD' : 'PROGRAM_COORDINATOR',
                status: data.approved ? 'PENDING' : 'REJECTED',
                reviewedAt: new Date()
            },
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                        department: true
                    }
                }
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error approving report:', error);
        return NextResponse.json({ error: 'Failed to approve report' }, { status: 500 });
    }
} 