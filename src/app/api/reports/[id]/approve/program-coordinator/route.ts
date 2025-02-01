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
        console.log('PC Approval - Session role:', session?.user?.role);
        console.log('PC Approval - Department:', session?.user?.department);

        if (!session?.user || session.user.role !== 'PROGRAM_COORDINATOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if report exists and belongs to PC's department
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
            studentDept: report.student?.department,
            pcDept: session.user.department
        });

        // Check if PC's department matches student's department or if PC is from CST for CSE
        const canApprove = session.user.department === report.student?.department ||
            (session.user.department === 'CST' && report.student?.department === 'CSE');

        if (!canApprove) {
            return NextResponse.json(
                { error: 'You can only review reports from your department' },
                { status: 403 }
            );
        }

        // Update report based on PC's decision
        const updatedReport = await prisma.medicalReport.update({
            where: { id },
            data: {
                approvedByProgramCoordinator: data.approved,
                status: data.approved ? 'PENDING' : 'REJECTED',
                currentApprovalLevel: data.approved ? 'HOD' : 'PROGRAM_COORDINATOR',
                programCoordinatorComment: data.comment,
                reviewedAt: new Date()
            }
        });

        // Debug updated report
        console.log('Updated report status:', {
            id: updatedReport.id,
            status: updatedReport.status,
            approvedByPC: updatedReport.approvedByProgramCoordinator,
            currentLevel: updatedReport.currentApprovalLevel
        });

        return NextResponse.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
    }
} 