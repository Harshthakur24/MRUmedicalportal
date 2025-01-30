import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {
            name,
            email,
            password,
            department,
            year,
            rollNumber,
            className,
            studentContact,
            parentName,
            parentContact
        } = data;

        // Validate required fields
        if (!name || !email || !password || !department || !year || !rollNumber || !className) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);
        
        // Generate verification token
        const verificationToken = randomBytes(32).toString('hex');

        // Use transaction to ensure both user and account are created
        const createdUser = await prisma.$transaction(async (prisma) => {
            // Create user first
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    role: 'STUDENT',
                    verificationToken,
                    department,
                    rollNumber,
                    year,
                    studentContact,
                    parentName,
                    parentContact,
                    className,
                    emailVerified: null // Ensure email is not verified by default
                }
            });

            // Create account with hashed password
            await prisma.account.create({
                data: {
                    userId: user.id,
                    type: 'credentials',
                    provider: 'credentials',
                    providerAccountId: email,
                    access_token: hashedPassword
                }
            });

            return user;
        });

        // Send verification email
        await sendVerificationEmail(createdUser.email!, verificationToken);

        return NextResponse.json({ 
            message: 'Registration successful. Please check your email to verify your account.' 
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Failed to register user. Please try again.' },
            { status: 500 }
        );
    }
} 