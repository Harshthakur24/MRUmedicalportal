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

        // Handle admin routes
        if (path.startsWith('/admin/')) {
            const isAdmin = ['PROGRAM_COORDINATOR', 'HOD', 'DEAN_ACADEMICS', 'ADMIN'].includes(token.role);
            if (!isAdmin) {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }

        // Handle student routes
        if (path.startsWith('/dashboard/') && !path.startsWith('/dashboard/reports/')) {
            if (token.role !== 'STUDENT') {
                return NextResponse.redirect(new URL('/admin/dashboard', req.url));
            }
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
        '/admin/:path*',
        '/api/:path*',
        '/submit-report/:path*'
    ]
}; 