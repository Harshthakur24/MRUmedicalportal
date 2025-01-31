import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';

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
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Create user
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                school,
                department,
                year,
                rollNumber,
                className,
                studentContact,
                parentName,
                parentContact,
                role: 'STUDENT' // Default role
            }
        });

        return NextResponse.json(
            { message: 'User created successfully', user: { id: user.id, email: user.email } },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Error creating user' },
            { status: 500 }
        );
    }
} 