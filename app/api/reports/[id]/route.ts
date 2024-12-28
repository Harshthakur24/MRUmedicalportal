import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'HOD') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, comments } = await req.json();
    
    const report = await prisma.medicalReport.update({
      where: { id: params.id },
      data: {
        status,
        comments,
        reviewerId: session.user.id,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 