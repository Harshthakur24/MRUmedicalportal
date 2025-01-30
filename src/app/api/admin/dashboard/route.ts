import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MedicalReport } from "@prisma/client";

interface ReportWithStudent extends MedicalReport {
    student: {
        name: string | null;
        department: string | null;
    } | null;
}

interface ApprovalDates {
    createdAt: Date;
    updatedAt: Date;
    status: string;
}

function calculateApprovalTimeStats(reports: ApprovalDates[]) {
    const approvedReports = reports.filter(r => r.status === 'APPROVED' && r.createdAt && r.updatedAt);
    if (approvedReports.length === 0) {
        return {
            averageTime: 0,
            minTime: 0,
            maxTime: 0
        };
    }

    const times = approvedReports.map(report => {
        return Math.ceil(
            (report.updatedAt.getTime() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
    });

    return {
        averageTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
        minTime: Math.min(...times),
        maxTime: Math.max(...times)
    };
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return new NextResponse(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        // Get all reports
        const reports = await prisma.medicalReport.findMany({
            include: {
                student: {
                    select: {
                        name: true,
                        department: true
                    }
                }
            }
        });

        // Calculate basic statistics
        const totalReports = reports.length;
        const approvedReports = reports.filter(report => report.status === 'APPROVED').length;
        const pendingReports = reports.filter(report => report.status === 'PENDING').length;
        const rejectedReports = reports.filter(report => report.status === 'REJECTED').length;

        // Calculate average approval time (in days)
        const approvedReportsWithDates = reports.filter(report => 
            report.status === 'APPROVED' && report.createdAt && report.updatedAt
        );
        
        const averageApprovalTime = approvedReportsWithDates.length > 0
            ? Math.round(
                approvedReportsWithDates.reduce((acc, report) => {
                    const diffInDays = Math.ceil(
                        (report.updatedAt.getTime() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return acc + diffInDays;
                }, 0) / approvedReportsWithDates.length
            )
            : 0;

        // Get monthly statistics
        const monthlyStats = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const monthStart = new Date(year, date.getMonth(), 1);
            const monthEnd = new Date(year, date.getMonth() + 1, 0);

            const monthReports = reports.filter(report => 
                report.createdAt >= monthStart && report.createdAt <= monthEnd
            );

            return {
                month: `${month} ${year}`,
                total: monthReports.length,
                approved: monthReports.filter(r => r.status === 'APPROVED').length,
                rejected: monthReports.filter(r => r.status === 'REJECTED').length
            };
        }).reverse();

        // Get department statistics
        const departments = [...new Set(reports.map(r => r.student?.department).filter(Boolean))];
        const departmentStats = departments.map(dept => {
            const deptReports = reports.filter(r => r.student?.department === dept);
            const approved = deptReports.filter(r => r.status === 'APPROVED');
            
            return {
                department: dept,
                total: deptReports.length,
                approved: approved.length,
                rejected: deptReports.filter(r => r.status === 'REJECTED').length,
                averageApprovalTime: approved.length > 0
                    ? Math.round(
                        approved.reduce((acc, report) => {
                            const diffInDays = Math.ceil(
                                (report.updatedAt.getTime() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                            );
                            return acc + diffInDays;
                        }, 0) / approved.length
                    )
                    : 0
            };
        });

        // Get approval time statistics for each stage
        const approvalTimeStats = [
            {
                stage: 'Program Coordinator',
                ...calculateApprovalTimeStats(reports)
            },
            {
                stage: 'HOD',
                ...calculateApprovalTimeStats(reports)
            },
            {
                stage: 'Dean Academics',
                ...calculateApprovalTimeStats(reports)
            }
        ];

        // Get recent reports
        const recentReports = reports
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 10)
            .map(report => ({
                id: report.id,
                studentName: report.student?.name || 'N/A',
                department: report.student?.department || 'N/A',
                submissionDate: report.createdAt.toISOString(),
                status: report.status,
                disease: report.disease,
                currentApprovalLevel: report.status === 'APPROVED' ? 'APPROVED' : 
                    report.status === 'REJECTED' ? 'REJECTED' : 'PENDING'
            }));

        return NextResponse.json({
            totalReports,
            approvedReports,
            pendingReports,
            rejectedReports,
            averageApprovalTime,
            recentReports,
            monthlyStats,
            departmentStats,
            approvalTimeStats
        });

    } catch (error) {
        console.error('Admin Dashboard API Error:', error);
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
} 