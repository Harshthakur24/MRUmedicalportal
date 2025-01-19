import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const [session, { id }] = await Promise.all([
            auth(),
            Promise.resolve(params)
        ]);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.role !== 'DEAN_ACADEMICS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const data = await request.json() as { comment: string; approved: boolean };

        // Verify the report exists and is at the correct approval level
        const report = await prisma.medicalReport.findUnique({
            where: { id }
        });

        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        if (report.currentApprovalLevel !== 'DEAN_ACADEMICS') {
            return NextResponse.json(
                { error: 'Report is not at Dean Academics approval level' },
                { status: 403 }
            );
        }

        const updatedReport = await prisma.medicalReport.update({
            where: { id },
            data: {
                approvedByDeanAcademics: true,
                status: data.approved ? 'APPROVED' : 'REJECTED',
                currentApprovalLevel: data.approved ? 'COMPLETED' : 'DEAN_ACADEMICS',
                reviewerId: session.user.id,
                reviewedAt: new Date(),
                reviewComment: data.comment
            },
        });

        return NextResponse.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json(
            { error: 'Failed to update report' },
            { status: 500 }
        );
    }
} 