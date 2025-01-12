export interface Report {
    id: string;
    studentName: string;
    submissionDate: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    medicalCertificate: string;
    approvedByProgramCoordinator: boolean;
    approvedByHOD: boolean;
    approvedByDeanAcademics: boolean;
    currentApprovalLevel: 'PROGRAM_COORDINATOR' | 'HOD' | 'DEAN_ACADEMICS' | 'COMPLETED';
} 