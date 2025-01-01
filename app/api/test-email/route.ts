import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email-sender';

export async function GET(req: NextRequest) {
  try {
    // Replace with your actual email for testing
    await sendPasswordResetEmail('thakur2004harsh@gmail.com', 'test-token');
    
    return NextResponse.json({ 
      message: 'Test email sent successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
} 