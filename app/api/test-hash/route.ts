import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    
    if (!password) {
        return NextResponse.json({ error: 'No password provided' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    return NextResponse.json({ 
        original: password,
        hashed: hashedPassword
    });
} 