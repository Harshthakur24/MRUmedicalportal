import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401 }
            );
        }

        // Get all reports for the user
        const reports = await prisma.medicalReport.findMany({
            where: {
                studentId: session.user.id
            }
        });

        // Calculate statistics
        const totalReports = reports.length;
        const approvedReports = reports.filter(report => 
            report.status === 'APPROVED'
        ).length;
        const pendingReports = reports.filter(report => 
            report.status === 'PENDING'
        ).length;
        const rejectedReports = reports.filter(report => 
            report.status === 'REJECTED'
        ).length;

        // Get recent reports
        const recentReports = await prisma.medicalReport.findMany({
            where: {
                studentId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5,
            include: {
                student: {
                    select: {
                        name: true,
                        department: true
                    }
                }
            }
        });

        return NextResponse.json({
            totalReports,
            approvedReports,
            pendingReports,
            rejectedReports,
            recentReports: recentReports.map(report => ({
                id: report.id,
                disease: report.disease,
                dateOfAbsence: report.dateOfAbsence.toISOString(),
                dateTo: report.dateTo.toISOString(),
                status: report.status,
                studentName: report.student?.name || 'N/A',
                department: report.student?.department || 'N/A'
            }))
        });

    } catch (error) {
        console.error('Dashboard API Error:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
} 