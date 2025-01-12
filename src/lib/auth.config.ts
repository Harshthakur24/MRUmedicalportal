import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { compare } from "bcryptjs";
import { getEmailRole } from "./constants";
import prisma from "./prisma";

type ExtendedUser = User & {
    role: string;
    department: string | null;
    year: string | null;
    rollNumber: string | null;
};

interface Credentials {
    email: string;
    password: string;
}

export const authConfig = {
    pages: {
        signIn: '/auth/login',
        verifyRequest: '/auth/verify',
        error: '/auth/error',
    },
    providers: [
        {
            id: 'credentials',
            name: 'Credentials',
            type: 'credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Credentials | undefined) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Missing credentials');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: {
                        accounts: {
                            where: {
                                provider: 'credentials'
                            }
                        }
                    }
                });

                if (!user || !user.accounts[0]?.access_token) {
                    throw new Error('Invalid credentials');
                }

                if (!user.emailVerified) {
                    throw new Error('Please verify your email first');
                }

                const isValid = await compare(credentials.password, user.accounts[0].access_token);
                if (!isValid) {
                    throw new Error('Invalid credentials');
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
        },
        {
            id: 'email',
            name: 'Email',
            type: 'email',
            async sendVerificationRequest({ identifier }: { identifier: string }) {
                const emailInfo = getEmailRole(identifier);
                if (!emailInfo || emailInfo.role === 'STUDENT') {
                    throw new Error('Invalid admin email');
                }

                // Send OTP email to admin
                // Implementation in email.ts
            }
        }
    ],
    callbacks: {
        async signIn({ user, account }: { user: Partial<ExtendedUser>; account: { provider: string } | null }) {
            // For admin email login
            if (account?.provider === 'email') {
                const emailInfo = getEmailRole(user.email!);
                if (!emailInfo || emailInfo.role === 'STUDENT') {
                    return false;
                }
                return true;
            }

            // For student credentials login
            if (account?.provider === 'credentials') {
                return true;
            }

            return false;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.sub!;
                session.user.role = token.role as string;
                session.user.department = token.department as string | null;
                session.user.year = token.year as string | null;
                session.user.rollNumber = token.rollNumber as string | null;
            }
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: Partial<ExtendedUser> }) {
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id! }
                });
                if (dbUser) {
                    token.role = dbUser.role;
                    token.department = dbUser.department;
                    token.year = dbUser.year;
                    token.rollNumber = dbUser.rollNumber;
                }
            }
            return token;
        }
    }
} as const; 