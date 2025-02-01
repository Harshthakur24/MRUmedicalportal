import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        console.log('Received verification request with token:', token);

        if (!token) {
            console.log('No token provided in request');
            return NextResponse.json(
                { error: 'Verification token is missing' },
                { status: 400 }
            );
        }

        // Find user with the verification token
        const user = await db.user.findFirst({
            where: {
                verificationToken: token,
            },
            select: {
                id: true,
                email: true,
                emailVerified: true,
                verificationToken: true
            }
        });

        console.log('Found user:', user);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid verification token' },
                { status: 400 }
            );
        }

        if (user.emailVerified) {
            return NextResponse.json(
                { error: 'Email is already verified' },
                { status: 400 }
            );
        }

        // Update user as verified
        const updatedUser = await db.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null // Clear the token after verification
            },
            select: {
                id: true,
                email: true,
                emailVerified: true
            }
        });

        console.log('User verified successfully:', updatedUser);

        return NextResponse.json({
            message: 'Email verified successfully. You can now log in to your account.',
            user: { id: updatedUser.id, email: updatedUser.email }
        });

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Error verifying email' },
            { status: 500 }
        );
    }
} 