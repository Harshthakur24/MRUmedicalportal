import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { message: 'Token and password are required' },
                { status: 400 }
            );
        }

        // Find user with valid reset token
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid reset token' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hash(password, 10);

        // Update or create user's credentials in the Account model
        const existingAccount = await prisma.account.findFirst({
            where: {
                provider: 'credentials',
                providerAccountId: user.email!,
                userId: user.id
            }
        });

        if (existingAccount) {
            await prisma.account.update({
                where: {
                    provider_providerAccountId: {
                        provider: 'credentials',
                        providerAccountId: user.email!
                    }
                },
                data: {
                    access_token: hashedPassword
                }
            });
        } else {
            await prisma.account.create({
                data: {
                    type: 'credentials',
                    provider: 'credentials',
                    providerAccountId: user.email!,
                    userId: user.id,
                    access_token: hashedPassword
                }
            });
        }

        // Clear verification token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken: null
            }
        });

        return NextResponse.json(
            { message: 'Password reset successful' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Failed to reset password' },
            { status: 500 }
        );
    }
} 