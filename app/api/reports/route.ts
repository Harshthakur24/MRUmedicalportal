import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Add detailed logging
    console.log('Session:', session);
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        sessionDetails: process.env.NODE_ENV === 'development' ? session : undefined
      }, { status: 401 });
    }

    const formData = await req.formData();
    
    // Verify student exists first
    const student = await prisma.student.findUnique({
      where: { id: session.user.id }
    });


    if (!student) {
      return NextResponse.json({ 
        error: 'Student not found',
        userId: session.user.id, // Add this for debugging
        details: process.env.NODE_ENV === 'development' ? 'No student found with the provided ID' : undefined
      }, { status: 404 });
    }

    const medicalCertificateFile = formData.get('files.medicalCertificate') as File;
    if (!medicalCertificateFile) {
      return NextResponse.json({ error: 'Medical certificate is required' }, { status: 400 });
    }

    const medicalCertificateUrl = await uploadToCloudinary(medicalCertificateFile);

    const report = await prisma.medicalReport.create({
      data: {
        studentId: student.id,
        studentName: student.name || formData.get('studentName') as string,
        rollNumber: formData.get('rollNumber') as string,
        dateOfAbsence: new Date(formData.get('dateOfAbsence') as string),
        dateTo: new Date(formData.get('dateTo') as string),
        reason: formData.get('disease') as string,
        doctorName: formData.get('doctorName') as string,
        doctorAddress: formData.get('doctorAddress') as string,
        medicalCertificate: medicalCertificateUrl,
        otherReports: [],
        status: 'PENDING',
        parentName: formData.get('parentName') as string,
        parentContact: formData.get('parentContact') as string,
        studentContact: formData.get('studentContact') as string || '',
        className: formData.get('className') as string,
        section: formData.get('section') as string,
        disease: formData.get('disease') as string,
        workingDays: parseInt(formData.get('workingDays') as string),
        t1Reexam: formData.get('needsT1Reexam') === 'on',
        t1Subjects: formData.get('t1Subjects') as string || null,
        t2Reexam: formData.get('needsT2Reexam') === 'on',
        t2Subjects: formData.get('t2Subjects') as string || null,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json({ 
      error: 'Failed to submit report',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}