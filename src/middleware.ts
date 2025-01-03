import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequestWithAuth } from 'next-auth/middleware';

// Standalone middleware to protect routes
export default async function middleware(req: NextRequestWithAuth) {
    // Skip auth for reports and review routes
    if (req.nextUrl.pathname.includes('/reports') || 
        req.nextUrl.pathname.includes('/review')) {
        return NextResponse.next();
    }

    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    // Allow access to auth pages
    if (isAuthPage) {
        return null;
    }

    // Require authentication for other protected routes
    if (!isAuth) {
        return NextResponse.redirect(
            new URL('/auth/login', req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/reports/:path*',
        '/api/auth/:path*'
    ]
} 