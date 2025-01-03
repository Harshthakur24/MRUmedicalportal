import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ReportStatus } from '@prisma/client';

type ReviewParams = {
    status: ReportStatus;
    comment: string;
};

// Add route segment config
export const dynamic = 'force-dynamic';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<Response> {
    if (!params?.id) {
        return Response.json(
            { error: 'Report ID is required' },
            { status: 400 }
        );
    }

    try {
        const data = await request.json() as ReviewParams;

        // Validate the input
        if (!data.status || (data.status === 'REJECTED' && !data.comment)) {
            return Response.json(
                { error: 'Invalid input' },
                { status: 400 }
            );
        }

        const updatedReport = await prisma.medicalReport.update({
            where: { 
                id: params.id 
            },
            data: {
                status: data.status,
                reviewComment: data.comment,
                reviewedAt: new Date(),
            },
        });

        return Response.json({
            success: true,
            message: `Report ${data.status.toLowerCase()} successfully`,
            report: updatedReport
        });

    } catch (error) {
        console.error('Error updating report:', error);
        return Response.json(
            { error: 'Failed to update report status' },
            { status: 500 }
        );
    }
} 