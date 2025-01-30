export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ApprovalLevel = 'PROGRAM_COORDINATOR' | 'HOD' | 'DEAN_ACADEMICS' | 'COMPLETED';

export interface Report {
    id: string;
    studentName: string;
    submissionDate: string;
    disease: string;
    status: ReportStatus;
    currentApprovalLevel: ApprovalLevel;
    student?: {
        name: string | null;
        email: string | null;
        department: string | null;
    };
} 