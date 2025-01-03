import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find student
    const student = await prisma.student.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token using the utility function
    const token = generateToken({ 
      studentId: student.id,
      email: student.email,
      role: student.role 
    });

    // Return success response with token and student data
    return NextResponse.json({
      success: true,
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: student.role,
        rollNumber: student.rollNumber,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong during login' },
      { status: 500 }
    );
  }
} 