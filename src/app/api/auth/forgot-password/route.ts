import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/resend';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'No account found with this email' },
                { status: 404 }
            );
        }

        // Generate reset token
        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour from now

        // Save reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires
            }
        });

        // Send reset email
        await sendPasswordResetEmail(email, token);

        return NextResponse.json(
            { message: 'Password reset email sent' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password reset request error:', error);
        return NextResponse.json(
            { message: 'Failed to process password reset request' },
            { status: 500 }
        );
    }
} 