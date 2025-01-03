import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { authOptions } from '@/lib/auth.config';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        console.log('Session:', session); // Debug log
        
        if (!session?.user?.id) {
            console.log('No session or user ID'); // Debug log
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Add this debug log
        console.log('Authenticated user:', {
            id: session.user.id,
            name: session.user.name,
            rollNumber: session.user.rollNumber
        });

        let data;
        try {
            const rawData = await req.text();
            data = JSON.parse(rawData);
        } catch (error) {
            console.error('Failed to parse request data:', error);
            return NextResponse.json(
                { error: 'Invalid request format' },
                { status: 400 }
            );
        }

        if (!data || typeof data !== 'object') {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 }
            );
        }

        if (!data.medicalCertificate?.data) {
            return NextResponse.json(
                { error: 'Medical certificate is required' },
                { status: 400 }
            );
        }

        try {
            const medicalCertificateUrl = await uploadToCloudinary({
                data: data.medicalCertificate.data,
                filename: data.medicalCertificate.filename || 'medical_certificate',
                contentType: data.medicalCertificate.contentType || 'application/octet-stream'
            });

            const report = await prisma.medicalReport.create({
                data: {
                    studentId: session.user.id,
                    studentName: data.studentName || session.user.name || '',
                    rollNumber: data.rollNumber || session.user.rollNumber || '',
                    dateOfAbsence: new Date(data.dateOfAbsence || Date.now()),
                    dateTo: new Date(data.dateTo || Date.now()),
                    reason: data.reason || data.disease || '',
                    doctorName: data.doctorName || '',
                    doctorAddress: data.doctorAddress || '',
                    medicalCertificate: medicalCertificateUrl,
                    parentName: data.parentName || '',
                    parentContact: data.parentContact || '',
                    studentContact: data.studentContact || '',
                    className: data.className || '',
                    disease: data.disease || data.reason || '',
                    workingDays: Number(data.workingDays) || 0,
                    t1Reexam: Boolean(data.t1Reexam),
                    t1Subjects: data.t1Subjects || '',
                    t2Reexam: Boolean(data.t2Reexam),
                    t2Subjects: data.t2Subjects || '',
                    status: 'PENDING',
                    otherReports: [],
                },
            });

            return NextResponse.json(
                { 
                    success: true, 
                    message: 'Report submitted successfully',
                    data: report 
                },
                { status: 201 }
            );
        } catch (error) {
            console.error('Operation failed:', error);
            return NextResponse.json(
                { error: 'Failed to process request' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Request error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const reports = await prisma.medicalReport.findMany({
            orderBy: {
                submissionDate: 'desc'
            },
            select: {
                id: true,
                studentName: true,
                submissionDate: true,
                reason: true,
                status: true,
                medicalCertificate: true
            }
        });

        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reports' },
            { status: 500 }
        );
    }
} 