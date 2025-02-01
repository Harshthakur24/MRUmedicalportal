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

        // Require authentication for all protected routes
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }

        // Handle admin routes (PC, HOD, DEAN_ACADEMICS)
        if (path.startsWith('/dashboard/reports')) {
            const isAdmin = ['PROGRAM_COORDINATOR', 'HOD', 'DEAN_ACADEMICS'].includes(token.role);
            if (!isAdmin) {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
            return NextResponse.next();
        }

        // Handle student dashboard
        if (path.startsWith('/dashboard') && token.role === 'STUDENT') {
            return NextResponse.next();
        }

        // Handle API routes
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
    matcher: [
        '/dashboard/:path*',
        '/api/:path*',
        '/submit-report/:path*'
    ]
}; 