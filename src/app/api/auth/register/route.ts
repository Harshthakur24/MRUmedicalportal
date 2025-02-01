import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

// Store pending registrations in memory (in production, use Redis or similar)
const pendingRegistrations = new Map();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            email,
            password,
            school,
            department,
            year,
            rollNumber,
            className,
            studentContact,
            parentName,
            parentContact
        } = body;

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Generate verification token
        const verificationToken = randomBytes(32).toString('hex');
        console.log('Generated verification token:', verificationToken);

        // Create user with verification token
        const user = await db.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                school,
                department,
                year: year || '',
                rollNumber: rollNumber || '',
                className: className || '',
                studentContact: studentContact || '',
                parentName: parentName || '',
                parentContact: parentContact || '',
                role: 'STUDENT',
                verificationToken,
                emailVerified: null
            },
            select: {
                id: true,
                email: true,
                verificationToken: true
            }
        });

        console.log('Created user:', user);

        try {
            // Send verification email
            await sendVerificationEmail(email, verificationToken);
            console.log('Verification email sent successfully');
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Delete the user if email sending fails
            await db.user.delete({
                where: { id: user.id }
            });
            throw emailError;
        }

        return NextResponse.json(
            { 
                message: 'Registration successful. Please check your email to verify your account.',
                user: { id: user.id, email: user.email }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Error during registration process' },
            { status: 500 }
        );
    }
}

// Export pendingRegistrations for use in verify endpoint
export { pendingRegistrations }; 