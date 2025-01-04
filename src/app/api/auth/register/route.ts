import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/resend';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log('Registration request:', data);

        const { name, email, password, rollNumber, department, class: studentClass, year, role } = data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Generate verification token
        const verificationToken = randomBytes(32).toString('hex');
        console.log('Generated verification token:', { email, verificationToken });

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Create user with verification token
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                rollNumber,
                department,
                class: studentClass,
                year: Number(year),
                role,
                verificationToken
            }
        });

        console.log('User created:', { userId: user.id, email: user.email });

        try {
            // Send verification email
            const emailResult = await sendVerificationEmail(email, verificationToken);
            console.log('Verification email sent:', emailResult);

            return NextResponse.json(
                { 
                    message: 'User created successfully. Please check your email to verify your account.',
                    user: { id: user.id, email: user.email } 
                },
                { status: 201 }
            );
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            
            // Still return success since user was created
            return NextResponse.json(
                { 
                    message: 'User created successfully, but failed to send verification email. Please contact support.',
                    user: { id: user.id, email: user.email } 
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Error creating user', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 