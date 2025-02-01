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

        // Set headers for direct download when requested
        const { headers } = request;
        if (headers.get('download') === 'true') {
            try {
                // Fetch the medical certificate
                const certificateResponse = await fetch(report.medicalCertificate);
                if (!certificateResponse.ok) {
                    throw new Error('Failed to fetch medical certificate');
                }

                // Get the content type from the response
                const contentType = certificateResponse.headers.get('content-type') || 'application/pdf';
                const buffer = await certificateResponse.arrayBuffer();

                // Create a sanitized filename with student details
                const sanitizedName = report.student?.name?.replace(/[^a-zA-Z0-9]/g, '') || 'Unknown';
                const sanitizedRollNumber = report.student?.rollNumber?.replace(/[^a-zA-Z0-9]/g, '') || 'NoRoll';
                const submissionDate = new Date(report.submissionDate).toISOString().split('T')[0];
                const fileName = `MedicalReport-${sanitizedName}-${sanitizedRollNumber}-${submissionDate}.pdf`;

                // Return the file with proper headers
                return new NextResponse(buffer, {
                    headers: {
                        'Content-Type': contentType,
                        'Content-Disposition': `attachment; filename="${fileName}"`,
                        'Content-Length': buffer.byteLength.toString()
                    },
                });
            } catch (error) {
                console.error('Download error:', error);
                return new NextResponse('Failed to download file', { status: 500 });
            }
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
