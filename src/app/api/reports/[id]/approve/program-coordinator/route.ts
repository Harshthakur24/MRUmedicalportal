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

        if (!session?.user || session.user.role !== 'PROGRAM_COORDINATOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const report = await prisma.medicalReport.update({
            where: { id },
            data: {
                approvedByProgramCoordinator: true,
                status: 'PENDING',
                currentApprovalLevel: 'HOD'
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error approving report:', error);
        return NextResponse.json({ error: 'Failed to approve report' }, { status: 500 });
    }
} 