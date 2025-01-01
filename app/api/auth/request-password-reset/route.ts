import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email-sender';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    console.log('Received password reset request for:', email);

    const student = await prisma.student.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!student) {
      console.log('No student found with email:', email);
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive a password reset link.' },
        { status: 200 }
      );
    }

    const resetToken = generateToken();
    console.log('Generated reset token for:', email);

    await prisma.student.update({
      where: { id: student.id },
      data: { 
        resetPasswordToken: resetToken,
        resetPasswordExpires: new Date(Date.now() + 3600000)
      },
    });

    console.log('Attempting to send reset email to:', email);
    await sendPasswordResetEmail(email, resetToken);
    console.log('Reset email sent successfully to:', email);

    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive a password reset link.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
} 