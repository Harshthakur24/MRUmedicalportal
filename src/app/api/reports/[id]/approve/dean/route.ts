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

        if (!session?.user || session.user.role !== 'DEAN_ACADEMICS') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const report = await prisma.medicalReport.update({
            where: { id },
            data: {
                approvedByDeanAcademics: true,
                status: data.approved ? 'APPROVED' : 'REJECTED',  // Final status set by Dean
                currentApprovalLevel: data.approved ? 'COMPLETED' : 'DEAN_ACADEMICS',
                reviewerId: session.user.id,
                reviewedAt: new Date(),
                reviewComment: data.comment
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json(
            { error: 'Failed to update report' },
            { status: 500 }
        );
    }
} 