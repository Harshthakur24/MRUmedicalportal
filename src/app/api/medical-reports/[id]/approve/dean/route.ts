import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const [session, params] = await Promise.all([
            auth(),
            context.params
        ]);

        if (!session?.user || session.user.role !== 'DEAN_ACADEMICS') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const report = await prisma.medicalReport.update({
            where: { id: params.id },
            data: {
                approvedByDeanAcademics: true,
                status: 'APPROVED',
                currentApprovalLevel: 'COMPLETED'
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error approving report:', error);
        return NextResponse.json({ error: 'Failed to approve report' }, { status: 500 });
    }
} 