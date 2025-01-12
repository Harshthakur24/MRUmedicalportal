import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const [session, resolvedParams] = await Promise.all([
            auth(),
            params
        ]);

        if (!session?.user || session.user.role !== 'HOD') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const report = await prisma.medicalReport.update({
            where: { id: resolvedParams.id },
            data: {
                approvedByHOD: true,
                status: 'PENDING',
                currentApprovalLevel: 'DEAN_ACADEMICS'
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error approving report:', error);
        return NextResponse.json({ error: 'Failed to approve report' }, { status: 500 });
    }
} 