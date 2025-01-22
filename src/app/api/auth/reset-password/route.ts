import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Received reset request:", body); // Debug log

        const { token, password } = body;

        if (!token || !password) {
            console.log("Missing token or password"); // Debug log
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            );
        }

        // Find the user by reset token and ensure it hasn't expired
        const user = await prisma.user.findFirst({
            where: { 
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            console.log("Invalid or expired token:", token); // Debug log
            return NextResponse.json(
                { error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await hash(password, 12);

        // Update the user's password and clear the reset token
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { 
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        console.log("Password updated for user:", updatedUser.email); // Debug log

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Password reset error:", error);
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        );
    }
} 