import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files');
    
    // Extract all form fields
    const data = {
      dateFrom: formData.get('dateFrom') as string,
      dateTo: formData.get('dateTo') as string,
      reason: formData.get('disease') as string, // Using disease as reason
      doctorName: formData.get('doctorName') as string,
      doctorAddress: formData.get('doctorAddress') as string,
      parentName: formData.get('parentName') as string,
      parentContact: formData.get('parentContact') as string,
      studentContact: formData.get('studentContact') as string,
      class: formData.get('class') as string,
      section: formData.get('section') as string,
      disease: formData.get('disease') as string,
      workingDays: parseInt(formData.get('workingDays') as string),
      t1Reexam: formData.get('t1Reexam') === 'true',
      t1Subjects: formData.get('t1Subjects') as string,
      t2Reexam: formData.get('t2Reexam') === 'true',
      t2Subjects: formData.get('t2Subjects') as string,
    };

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const fileUrls = await Promise.all(
      files.map(file => uploadToCloudinary(file as File))
    );

    const report = await prisma.medicalReport.create({
      data: {
        studentId: 'mockUserId', // Replace with actual user ID from session
        dateOfAbsence: new Date(data.dateFrom),
        dateTo: new Date(data.dateTo),
        reason: data.reason,
        doctorName: data.doctorName,
        doctorAddress: data.doctorAddress,
        medicalCertificate: fileUrls[0],
        otherReports: fileUrls.slice(1),
        status: 'PENDING',
        // Add new fields
        parentName: data.parentName,
        parentContact: data.parentContact,
        studentContact: data.studentContact,
        class: data.class,
        section: data.section,
        disease: data.disease,
        workingDays: data.workingDays,
        t1Reexam: data.t1Reexam,
        t1Subjects: data.t1Subjects,
        t2Reexam: data.t2Reexam,
        t2Subjects: data.t2Subjects,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}