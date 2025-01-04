import { DefaultSession, NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';
import { Role, School } from '@prisma/client';

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: Role;
            rollNumber: string;
            department: School;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        email: string;
        name: string;
        role: Role;
        rollNumber: string;
        department: School;
        year: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: Role;
        rollNumber: string;
        department: School;
        year: number;
    }
}

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
                    throw new Error('Please provide both email and password');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
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

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const passwordMatch = await compare(credentials.password, user.password);

                if (!passwordMatch) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    rollNumber: user.rollNumber,
                    department: user.department,
                    year: user.year
                } satisfies User;
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.rollNumber = user.rollNumber;
                token.department = user.department;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role as Role;
                session.user.id = token.id as string;
                session.user.rollNumber = token.rollNumber as string;
                session.user.department = token.department as School;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development',
}; 