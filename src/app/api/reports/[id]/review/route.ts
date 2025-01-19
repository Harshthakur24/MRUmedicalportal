import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

type ReviewAction = 'approve' | 'reject';

interface ReviewData {
    action: ReviewAction;
    comment?: string;
}

export async function POST(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const [session, { id }] = await Promise.all([
            auth(),
            Promise.resolve(context.params)
        ]);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json() as ReviewData;
        const { action, comment } = data;

        const report = await prisma.medicalReport.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                        department: true
                    }
                }
            }
        });

        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        // Create a comment if provided
        if (comment) {
            await prisma.comment.create({
                data: {
                    content: comment,
                    authorId: session.user.id,
                    reportId: id
                }
            });
        }

        // Update report status based on user role and action
        const updateData: Prisma.MedicalReportUpdateInput = {};

        switch (session.user.role) {
            case 'PROGRAM_COORDINATOR':
                updateData.approvedByProgramCoordinator = action === 'approve';
                updateData.currentApprovalLevel = action === 'approve' ? 'HOD' : 'PROGRAM_COORDINATOR';
                updateData.status = action === 'approve' ? 'PENDING' : 'REJECTED';
                break;

            case 'HOD':
                updateData.approvedByHOD = action === 'approve';
                updateData.currentApprovalLevel = action === 'approve' ? 'DEAN_ACADEMICS' : 'HOD';
                updateData.status = 'PENDING';
                break;

            case 'DEAN_ACADEMICS':
                updateData.approvedByDeanAcademics = action === 'approve';
                updateData.currentApprovalLevel = action === 'approve' ? 'COMPLETED' : 'DEAN_ACADEMICS';
                updateData.status = action === 'approve' ? 'APPROVED' : 'REJECTED';
                updateData.reviewedAt = new Date();
                updateData.reviewerId = session.user.id;
                break;

            default:
                return NextResponse.json(
                    { error: 'Not authorized to review reports' },
                    { status: 403 }
                );
        }

        const updatedReport = await prisma.medicalReport.update({
            where: { id },
            data: updateData,
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                        department: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                role: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        return NextResponse.json(updatedReport);
    } catch (error) {
        console.error('Error reviewing report:', error);
        return NextResponse.json(
            { error: 'Failed to review report' },
            { status: 500 }
        );
    }
} 