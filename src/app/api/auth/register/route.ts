import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { Role, School } from '@prisma/client';

export async function POST(req: Request) {
    try {
        if (!req.body) {
            return NextResponse.json(
                { message: 'Request body is missing' },
                { status: 400 }
            );
        }

        const data = await req.json();
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'password', 'rollNumber', 'department', 'class', 'year', 'role'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            return NextResponse.json(
                { message: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        const { name, email, password, rollNumber, department, class: studentClass, year, role } = data;

        // Validate email format
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

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

        // Validate role
        if (!Object.values(Role).includes(role as Role)) {
            return NextResponse.json(
                { message: 'Invalid role specified' },
                { status: 400 }
            );
        }

        // Validate department
        if (!Object.values(School).includes(department as School)) {
            return NextResponse.json(
                { message: 'Invalid department specified' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Create user with all fields including class
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                rollNumber,
                department: department as School,
                class: studentClass,
                year: Number(year),
                role: role as Role
            }
        });

        return NextResponse.json(
            { message: 'User created successfully', user: { id: user.id, email: user.email } },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Error creating user', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 