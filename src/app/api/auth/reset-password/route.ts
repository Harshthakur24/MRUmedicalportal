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
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hash(password, 10);

        // Update user's password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
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