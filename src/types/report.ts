export interface Report {
  id: string;
  studentName: string;
  // ... existing fields ...
  approvedByProgramCoordinator: boolean;
  approvedByHOD: boolean;
  approvedByDeanAcademics: boolean;
  programCoordinatorComment?: string;
  hodComment?: string;
  deanAcademicsComment?: string;
  currentApprovalLevel: 'PENDING' | 'PROGRAM_COORDINATOR' | 'HOD' | 'DEAN_ACADEMICS';
} 