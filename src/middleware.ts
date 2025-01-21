import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Allow access to auth-related pages and API routes
        if (path.startsWith('/auth/') || path.startsWith('/api/auth/')) {
            return NextResponse.next();
        }

        // Require authentication for protected routes
        if (!token) {
            if (path.startsWith('/api/')) {
                return new NextResponse(
                    JSON.stringify({ error: 'Authentication required' }),
                    { status: 401, headers: { 'content-type': 'application/json' } }
                );
            }
            return NextResponse.redirect(new URL('/auth/login', req.url));
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
    matcher: [
        '/dashboard/:path*',
        '/api/:path*',
        '/submit-report/:path*'
    ]
}; 