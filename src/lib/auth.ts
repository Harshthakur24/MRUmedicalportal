import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { Adapter } from "next-auth/adapters";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            role: string;
            department?: string | null;
            rollNumber?: string | null;
            year?: string | null;
        }
    }
    interface User {
        role: string;
        department?: string | null;
        rollNumber?: string | null;
        year?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        department?: string | null;
        rollNumber?: string | null;
        year?: string | null;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    department: user.department,
                    year: user.year,
                    rollNumber: user.rollNumber
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.department = user.department;
                token.year = user.year;
                token.rollNumber = user.rollNumber;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.department = token.department;
                session.user.year = token.year;
                session.user.rollNumber = token.rollNumber;
            }
            return session;
        }
    }
};

export const auth = () => getServerSession(authOptions); 