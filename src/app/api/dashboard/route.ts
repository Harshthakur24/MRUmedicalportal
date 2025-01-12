import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();
        
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Different stats based on user role
        if (session.user.role === 'STUDENT') {
            const stats = await prisma.$transaction([
                // Total reports submitted
                prisma.medicalReport.count({
                    where: { studentId: session.user.id }
                }),
                // Pending reports
                prisma.medicalReport.count({
                    where: {
                        studentId: session.user.id,
                        status: 'PENDING'
                    }
                }),
                // Rejected reports
                prisma.medicalReport.count({
                    where: {
                        studentId: session.user.id,
                        status: 'REJECTED'
                    }
                }),
                // Recent reports
                prisma.medicalReport.findMany({
                    where: { studentId: session.user.id },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        student: {
                            select: {
                                name: true,
                                role: true
                            }
                        }
                    }
                })
            ]);

            return NextResponse.json({
                totalReports: stats[0],
                pendingReports: stats[1],
                rejectedReports: stats[2],
                recentReports: stats[3]
            });
        }

        // For HOD and ADMIN
        if (session.user.role === 'HOD' || session.user.role === 'ADMIN') {
            const whereClause = session.user.role === 'HOD' && session.user.department 
                ? { department: session.user.department }
                : undefined;

            const stats = await prisma.$transaction([
                // Total reports
                prisma.medicalReport.count({
                    where: whereClause
                }),
                // Pending reports
                prisma.medicalReport.count({
                    where: {
                        ...whereClause,
                        status: 'PENDING'
                    }
                }),
                // Recent reports
                prisma.medicalReport.findMany({
                    where: whereClause,
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        student: {
                            select: {
                                name: true,
                                department: true,
                                year: true
                            }
                        }
                    }
                }),
                // Department-wise statistics (for ADMIN)
                ...(session.user.role === 'ADMIN' ? [
                    prisma.medicalReport.groupBy({
                        by: ['status'],
                        _count: true
                    })
                ] : [])
            ]);

            return NextResponse.json({
                totalReports: stats[0],
                pendingReports: stats[1],
                recentReports: stats[2],
                ...(session.user.role === 'ADMIN' && {
                    statusDistribution: stats[3]
                })
            });
        }

        return NextResponse.json(
            { error: 'Invalid user role' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Dashboard error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
} 