import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/middleware';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  verifyToken(req, res, () => {
    res.status(200).json({ message: 'This is a protected route' });
  });
} 