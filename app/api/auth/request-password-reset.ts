import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { generateToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;
    try {
      const student = await prisma.student.findUnique({ where: { email } });
      if (!student) {
        return res.status(400).json({ error: 'Invalid email' });
      }
      const token = generateToken();
      await prisma.student.update({
        where: { id: student.id },
        data: { resetPasswordToken: token },
      });
      await sendPasswordResetEmail(student.email, token);
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 