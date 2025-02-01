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
    context: RouteContext
) {
    try {
        const session = await auth();
        const { id } = context.params;
        const data = await request.json() as { comment: string; approved: boolean };

        // Debug session info
        console.log('Dean Approval - Session role:', session?.user?.role);

        if (!session?.user || session.user.role !== 'DEAN_ACADEMICS') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if report exists and is approved by HOD
        const report = await prisma.medicalReport.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        department: true
                    }
                }
            }
        });

        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        // Debug report info
        console.log('Report current status:', {
            id: report.id,
            status: report.status,
            approvedByPC: report.approvedByProgramCoordinator,
            approvedByHOD: report.approvedByHOD,
            studentDept: report.student?.department
        });

        if (!report.approvedByHOD) {
            return NextResponse.json(
                { error: 'Report must be approved by HOD first' },
                { status: 403 }
            );
        }

        // Update report based on Dean's decision
        const updatedReport = await prisma.medicalReport.update({
            where: { id },
            data: {
                approvedByDeanAcademics: data.approved,
                status: data.approved ? 'APPROVED' : 'REJECTED',
                currentApprovalLevel: data.approved ? 'COMPLETED' : 'DEAN_ACADEMICS',
                deanAcademicsComment: data.comment,
                reviewedAt: new Date()
            }
        });

        // Debug updated report
        console.log('Updated report status:', {
            id: updatedReport.id,
            status: updatedReport.status,
            approvedByDean: updatedReport.approvedByDeanAcademics,
            currentLevel: updatedReport.currentApprovalLevel
        });

        return NextResponse.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
    }
} 