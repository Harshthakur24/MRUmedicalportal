import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { message: 'Verification token is required' },
                { status: 400 }
            );
        }

        // Find user with verification token
        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid verification token' },
                { status: 400 }
            );
        }

        // Update user's email verification status
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null
            }
        });

        return NextResponse.json(
            { message: 'Email verified successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json(
            { message: 'Failed to verify email' },
            { status: 500 }
        );
    }
} 