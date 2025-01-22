import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            // Return success even if user not found for security
            return NextResponse.json(
                { message: 'If an account exists with this email, a password reset link has been sent.' },
                { status: 200 }
            );
        }

        // Generate reset token and set expiry to 24 hours
        const resetToken = randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Save reset token and expiry
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
                verificationToken: null // Clear old token if exists
            }
        });

        // Send reset email
        await sendPasswordResetEmail(email, resetToken);

        return NextResponse.json(
            { message: 'If an account exists with this email, a password reset link has been sent.' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Password reset request error:', error);
        return NextResponse.json(
            { error: 'Failed to process password reset request' },
            { status: 500 }
        );
    }
} 