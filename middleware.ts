import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Allow access to auth-related pages
        if (path.startsWith('/auth/')) {
            return NextResponse.next();
        }

        // Require authentication for dashboard and api routes
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        // Allow access to dashboard for all authenticated users
        if (path.startsWith('/dashboard')) {
            return NextResponse.next();
        }

        // Allow access to API routes for authenticated users
        if (path.startsWith('/api/')) {
            return NextResponse.next();
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
);

export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*']
}; 