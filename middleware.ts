import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Allow access to HOD routes only for HOD users
      if (req.nextUrl.pathname.startsWith('/hod')) {
        return token?.role === 'HOD';
      }
      // For other protected routes, just check if user is logged in
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/submit-report",
    "/dashboard",
    "/hod/:path*",
    "/api/reports/:path*"
  ],
}; 