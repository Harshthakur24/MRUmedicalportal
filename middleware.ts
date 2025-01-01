import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// Extend NextApiRequest to include student
interface ExtendedRequest extends NextApiRequest {
  student?: any;
}

export function verifyToken(req: ExtendedRequest, res: NextApiResponse, next: () => void) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing!' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.student = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

export default withAuth(
  function middleware(req) {
    // Handle role-based access here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    "/submit-report",
    "/dashboard",
    "/api/reports/:path*"
  ],
}; 