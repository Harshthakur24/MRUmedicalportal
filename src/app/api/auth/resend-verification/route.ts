import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        // Find user with the old verification token
        const user = await db.user.findFirst({
            where: {
                verificationToken: token,
                emailVerified: null
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid verification token' },
                { status: 400 }
            );
        }

        // Generate new verification token
        const newVerificationToken = randomBytes(32).toString('hex');

        // Update user with new verification token
        await db.user.update({
            where: { id: user.id },
            data: {
                verificationToken: newVerificationToken
            }
        });

        // Send new verification email
        await sendVerificationEmail(user.email, newVerificationToken);

        return NextResponse.json({
            message: 'Verification email resent successfully'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json(
            { error: 'Failed to resend verification email' },
            { status: 500 }
        );
    }
} 