import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password, name, rollNumber, department, year } = data;

    // Validate required fields
    if (!email || !password || !name || !rollNumber || !department || !year) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.student.findFirst({
      where: {
        OR: [
          { email },
          { rollNumber }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }
      if (existingUser.rollNumber === rollNumber) {
        return NextResponse.json(
          { error: 'Roll number already registered' },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.student.create({
      data: {
        email,
        name,
        password: hashedPassword,
        rollNumber,
        department,
        year: Number(year),
        role: 'STUDENT',
      },
    });

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        rollNumber: user.rollNumber,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 