import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // Validate required fields
        const requiredFields = [
            'dateOfAbsence',
            'dateTo',
            'doctorName',
            'doctorAddress',
            'parentName',
            'parentContact',
            'studentContact',
            'className',
            'disease',
            'workingDays'
        ];

        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Upload medical certificate to Cloudinary
        let medicalCertificateUrl = '';
        if (data.medicalCertificate?.data) {
            try {
                // Remove data:image/[type];base64, prefix if present
                const base64String = data.medicalCertificate.data.includes('base64,') 
                    ? data.medicalCertificate.data.split('base64,')[1] 
                    : data.medicalCertificate.data;

                const uploadResponse = await cloudinary.uploader.upload(
                    `data:${data.medicalCertificate.contentType};base64,${base64String}`,
                    {
                        folder: 'medical_certificates',
                        resource_type: 'auto'
                    }
                );
                medicalCertificateUrl = uploadResponse.secure_url;
            } catch (error) {
                console.error('Failed to upload medical certificate:', error);
                return NextResponse.json(
                    { error: 'Failed to upload medical certificate. Please try again.' },
                    { status: 500 }
                );
            }
        } else {
            return NextResponse.json(
                { error: 'Medical certificate is required' },
                { status: 400 }
            );
        }
        
        // Create medical report
        const report = await prisma.medicalReport.create({
            data: {
                studentId: session.user.id,
                dateOfAbsence: new Date(data.dateOfAbsence),
                dateTo: new Date(data.dateTo),
                doctorName: data.doctorName,
                doctorAddress: data.doctorAddress,
                medicalCertificate: medicalCertificateUrl,
                parentName: data.parentName,
                parentContact: data.parentContact,
                studentContact: data.studentContact,
                className: data.className,
                disease: data.disease,
                workingDays: parseInt(data.workingDays),
                t1Reexam: Boolean(data.t1Reexam),
                t1Subjects: data.t1Subjects || null,
                t2Reexam: Boolean(data.t2Reexam),
                t2Subjects: data.t2Subjects || null,
                department: session.user.department || '',
                status: 'PENDING',
                currentApprovalLevel: 'PROGRAM_COORDINATOR'
            },
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                        department: true,
                        rollNumber: true,
                        year: true
                    }
                }
            }
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json(
            { error: 'Failed to create report' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let reports;
        if (session.user.role === 'STUDENT') {
            reports = await prisma.medicalReport.findMany({
                where: { studentId: session.user.id },
                include: {
                    student: {
                        select: {
                            name: true,
                            email: true,
                            department: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        } else if (session.user.role === 'PROGRAM_COORDINATOR') {
            reports = await prisma.medicalReport.findMany({
                where: session.user.department ? {
                    department: session.user.department,
                    OR: [
                        { approvedByProgramCoordinator: false },
                        { 
                            approvedByProgramCoordinator: true,
                            approvedByHOD: false,
                            approvedByDeanAcademics: false
                        },
                        {
                            approvedByProgramCoordinator: true,
                            approvedByHOD: true,
                            approvedByDeanAcademics: false
                        }
                    ]
                } : {
                    OR: [
                        { approvedByProgramCoordinator: false },
                        { 
                            approvedByProgramCoordinator: true,
                            approvedByHOD: false,
                            approvedByDeanAcademics: false
                        }
                    ]
                },
                include: {
                    student: {
                        select: {
                            name: true,
                            email: true,
                            department: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        } else if (session.user.role === 'HOD' && session.user.department) {

            reports = await prisma.medicalReport.findMany({
                where: {
                    department: session.user.department,
                    approvedByProgramCoordinator: true,
                    OR: [
                        { approvedByHOD: false, approvedByDeanAcademics: false }, // Pending HOD approval
                        { approvedByHOD: true, approvedByDeanAcademics: false }   // Already approved by HOD
                    ]
                },
                include: {
                    student: {
                        select: {
                            name: true,
                            email: true,
                            department: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        } else if (session.user.role === 'DEAN_ACADEMICS' && session.user.department) {
            // For Dean: Show all reports approved by both PC and HOD, including those approved by Dean
            reports = await prisma.medicalReport.findMany({
                where: {
                    department: session.user.department,
                    approvedByProgramCoordinator: true,
                    approvedByHOD: true,
                    OR: [
                        { approvedByDeanAcademics: false }, // Pending Dean approval
                        { approvedByDeanAcademics: true }   // Already approved by Dean
                    ]
                },
                include: {
                    student: {
                        select: {
                            name: true,
                            email: true,
                            department: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            // For Admin
            reports = await prisma.medicalReport.findMany({
                include: {
                    student: {
                        select: {
                            name: true,
                            email: true,
                            department: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reports' },
            { status: 500 }
        );
    }
} 