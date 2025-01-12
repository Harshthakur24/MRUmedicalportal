export type Role = 'STUDENT' | 'PROGRAM_COORDINATOR' | 'HOD' | 'DEAN_ACADEMICS';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  // ... other fields
} 