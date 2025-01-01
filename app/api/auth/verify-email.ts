import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;
    try {
      const student = await prisma.student.findFirst({ where: { verificationToken: token } });
      if (!student) {
        return res.status(400).json({ error: 'Invalid token' });
      }
      await prisma.student.update({
        where: { id: student.id },
        data: { emailVerified: new Date(), verificationToken: null },
      });
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 