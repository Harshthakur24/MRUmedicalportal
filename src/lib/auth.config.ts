import { DefaultSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: Role;
            rollNumber: string;
            department: string;
            year: number;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        role: Role;
        rollNumber: string;
        department: string;
        year: number;
        email: string;
        name: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: Role;
        rollNumber: string;
        department: string;
        year: number;
    }
}

type Role = 'ADMIN' | 'HOD' | 'STUDENT';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.student.findUnique({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        password: true,
                        role: true,
                        rollNumber: true,
                        department: true,
                        year: true,
                    }
                });

                if (!user) return null;

                const passwordMatch = await compare(credentials.password, user.password);
                if (!passwordMatch) return null;

                return user;
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.rollNumber = user.rollNumber;
                token.department = user.department;
                token.year = user.year;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
                session.user.rollNumber = token.rollNumber as string;
                session.user.department = token.department as string;
                session.user.year = token.year as number;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error'
    }
}; 