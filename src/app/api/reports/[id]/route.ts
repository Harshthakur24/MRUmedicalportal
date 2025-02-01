import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const report = await prisma.medicalReport.findUnique({
            where: {
                id: params.id,
            },
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                        department: true,
                        className: true,
                        rollNumber: true,
                    },
                },
            },
        });

        if (!report) {
            return new NextResponse('Report not found', { status: 404 });
        }

        // Check role-based permissions
        if (session.user.role === 'HOD' && !report.approvedByProgramCoordinator) {
            return new NextResponse(
                'Access denied: Report not approved by Program Coordinator',
                { status: 403 }
            );
        }

        if (session.user.role === 'DEAN_ACADEMICS' && !report.approvedByHOD) {
            return new NextResponse(
                'Access denied: Report not approved by HOD',
                { status: 403 }
            );
        }

        // Log the data to verify what we're getting
        console.log('Report data:', report);

        // Set headers for direct download when requested
        const { headers } = request;
        if (headers.get('download') === 'true') {
            // Add download headers
            return new NextResponse(report.medicalCertificate, {
                headers: {
                    'Content-Disposition': `attachment; filename="medical-report-${report.id}.pdf"`,
                    'Content-Type': 'application/pdf',
                },
            });
        }

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    try {
        const { status, comment } = await request.json();

        const updatedReport = await prisma.medicalReport.update({
            where: { id },
            data: {
                status,
                reviewComment: comment,
                reviewedAt: new Date(),
            },
        });

        return new Response(
            JSON.stringify(updatedReport),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error updating report:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update report' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
