import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token, newPassword } = req.body;
    try {
      const student = await prisma.student.findFirst({ where: { resetPasswordToken: token } });
      if (!student) {
        return res.status(400).json({ error: 'Invalid token' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.student.update({
        where: { id: student.id },
        data: { password: hashedPassword, resetPasswordToken: null },
      });
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 