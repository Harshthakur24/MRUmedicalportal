import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        name: string | null;
        email: string | null;
        role: string;
        school?: string | null;
        department?: string | null;
        year?: string | null;
        rollNumber?: string | null;
    }

    interface Session {
        user: User & {
            id: string;
            role: string;
            school?: string | null;
            department?: string | null;
            year?: string | null;
            rollNumber?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        school?: string | null;
        department?: string | null;
        year?: string | null;
        rollNumber?: string | null;
    }
}

export type Role = 'STUDENT' | 'PROGRAM_COORDINATOR' | 'HOD' | 'DEAN_ACADEMICS';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  // ... other fields
} 