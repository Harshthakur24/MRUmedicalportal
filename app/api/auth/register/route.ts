import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      password, 
      rollNumber, 
      department, 
      year,
      confirmPassword 
    } = body;

    // Debug log
    console.log('Registration attempt with:', { name, email, rollNumber, department, year });

    // Validate required fields
    if (!name || !email || !password || !rollNumber || !department || !year) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await prisma.student.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { rollNumber: rollNumber.trim() }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or Roll Number already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const studentData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      rollNumber: rollNumber.trim(),
      department: department.trim(),
      year: parseInt(year.toString()),
      role: Role.STUDENT,
    };

    // Debug log
    console.log('Attempting to create student with:', { ...studentData, password: '[HIDDEN]' });

    const student = await prisma.student.create({
      data: studentData
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful'
    }, { status: 201 });

  } catch (error: any) {
    // Detailed error logging
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email or Roll Number already exists' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Registration failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 