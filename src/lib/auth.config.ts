import { DefaultSession, NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
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
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: Role;
        rollNumber: string;
        department: School;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                role: { label: 'Role', type: 'text' }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password || !credentials?.role) {
                        console.log('Missing credentials');
                        return null;
                    }

                    const user = await prisma.user.findFirst({
                        where: {
                            email: credentials.email,
                            role: credentials.role as Role
                        }
                    });

                    if (!user) {
                        throw new Error('Invalid credentials');
                    }

                    const isPasswordValid = await compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error('Invalid credentials');
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        rollNumber: user.rollNumber,
                        department: user.department
                    } as unknown as User;
                } catch (error) {
                    console.error('Login error:', error);
                    throw error;
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.rollNumber = user.rollNumber;
                token.department = user.department;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.rollNumber = token.rollNumber;
                session.user.department = token.department;
            }
            return session;
        }
    }
}; 