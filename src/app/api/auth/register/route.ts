import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

type School = 'Engineering' | 'Law' | 'Science' | 'Education' | 'Management';
type DepartmentMap = { [K in School]: string[] };

const VALID_SCHOOLS: School[] = ['Engineering', 'Law', 'Science', 'Education', 'Management'];
const DEPARTMENT_BY_SCHOOL: DepartmentMap = {
    Engineering: ['CSE', 'ECE', 'MECH', 'CIVIL'],
    Science: ['Maths', 'Chemistry', 'Physics'],
    Law: ['LLB', 'LLM'],
    Education: ['Education', 'Humanities'],
    Management: ['BBA', 'MBA', 'Commerce']
};

export async function POST(req: Request) {
    try {
        const data = await req.json();
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
        } = data;

        // Enhanced validation
        if (!name || !email || !password || !school || !year || !rollNumber || !className) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate school
        if (!VALID_SCHOOLS.includes(school)) {
            return NextResponse.json(
                { error: 'Invalid school selected' },
                { status: 400 }
            );
        }

        // Validate department if school is Engineering or Science
        if ((school === 'Engineering' || school === 'Science') && 
            (!department || !DEPARTMENT_BY_SCHOOL[school as School].includes(department))) {
            return NextResponse.json(
                { error: 'Invalid department for selected school' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
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
                    school,
                    department,
                    rollNumber,
                    year,
                    studentContact,
                    parentName,
                    parentContact,
                    className,
                    emailVerified: null
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