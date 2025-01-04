import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth.config';
import { ReportStatus, School } from '@prisma/client';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
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
                        status: ReportStatus.PENDING
                    }
                }),
                // Rejected reports
                prisma.medicalReport.count({
                    where: {
                        studentId: session.user.id,
                        status: ReportStatus.REJECTED
                    }
                }),
                // Recent reports
                prisma.medicalReport.findMany({
                    where: { studentId: session.user.id },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        reviewer: {
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
            const stats = await prisma.$transaction([
                // Total reports
                prisma.medicalReport.count(),
                // Pending reports
                prisma.medicalReport.count({
                    where: { status: 'PENDING' }
                }),
                // Reports by department (for HOD)
                ...(session.user.role === 'HOD' ? [
                    prisma.medicalReport.count({
                        where: {
                            student: {
                                department: session.user.department as School
                            }
                        }
                    })
                ] : []),
                // Recent reports
                prisma.medicalReport.findMany({
                    where: session.user.role === 'HOD' ? {
                        student: {
                            department: session.user.department as School
                        }
                    } : {},
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
                ...(session.user.role === 'HOD' && {
                    departmentReports: stats[2],
                }),
                recentReports: stats[session.user.role === 'HOD' ? 3 : 2],
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