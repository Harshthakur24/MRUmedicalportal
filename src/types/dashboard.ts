import { ReportStatus } from './index';

export interface MedicalReport {
    id: string;
    disease: string;
    dateOfAbsence: string;
    dateTo: string;
    status: ReportStatus;
    studentName?: string;
    department?: string;
    year?: number;
}

export interface DashboardData {
    totalReports: number;
    pendingReports: number;
    approvedReports: number;
    recentReports: MedicalReport[];
    departmentReports?: number;
    statusDistribution?: Array<{
        status: ReportStatus;
        _count: number;
    }>;
} 