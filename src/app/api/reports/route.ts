import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }), 
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
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
                return new NextResponse(
                    JSON.stringify({ error: `Missing required field: ${field}` }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
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
                        resource_type: 'auto',
                        timeout: 60000,
                        chunk_size: 6000000
                    }
                );
                medicalCertificateUrl = uploadResponse.secure_url;
            } catch (error) {
                console.error('Failed to upload medical certificate:', error);
                let errorMessage = 'Failed to upload medical certificate.';
                if (error instanceof Error && error.name === 'TimeoutError') {
                    errorMessage = 'Upload timed out. Please try again with a smaller file or better connection.';
                }
                return new NextResponse(
                    JSON.stringify({ error: errorMessage }),
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }
        } else {
            return new NextResponse(
                JSON.stringify({ error: 'Medical certificate is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
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

        return new NextResponse(
            JSON.stringify(report),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error creating report:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to create report' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let reports;
        const baseQuery = {
            include: {
                student: {
                    select: {
                        name: true,
                        rollNumber: true,
                        className: true,
                    }
                }
            }
        };

        switch (session.user.role) {
            case 'PROGRAM_COORDINATOR':
                // Program Coordinator can only see:
                // 1. Pending reports assigned to them
                // 2. Reports rejected by HOD and sent back to them
                reports = await prisma.medicalReport.findMany({
                    where: {
                        OR: [
                            {
                                status: 'PENDING',
                                currentApprovalLevel: 'PROGRAM_COORDINATOR',
                                approvedByProgramCoordinator: false
                            },
                            {
                                status: 'PENDING',
                                currentApprovalLevel: 'PROGRAM_COORDINATOR',
                                approvedByProgramCoordinator: true,
                                approvedByHOD: false
                            }
                        ],
                        status: {
                            not: 'COMPLETED'
                        }
                    },
                    ...baseQuery
                });
                break;

            case 'HOD':
                // HOD can only see:
                // 1. Reports approved by Program Coordinator
                // 2. Not yet approved by Dean
                // 3. Not completed
                reports = await prisma.medicalReport.findMany({
                    where: {
                        approvedByProgramCoordinator: true,
                        approvedByDeanAcademics: false,
                        status: {
                            not: 'COMPLETED'
                        },
                        OR: [
                            {
                                status: 'PENDING',
                                currentApprovalLevel: 'HOD'
                            },
                            {
                                status: 'PENDING',
                                approvedByHOD: false
                            }
                        ]
                    },
                    ...baseQuery
                });
                break;

            case 'DEAN_ACADEMICS':
                // Dean can only see:
                // 1. Reports approved by HOD
                // 2. Not yet completed
                reports = await prisma.medicalReport.findMany({
                    where: {
                        approvedByHOD: true,
                        OR: [
                            {
                                status: 'PENDING',
                                currentApprovalLevel: 'DEAN_ACADEMICS'
                            },
                            {
                                status: 'PENDING',
                                approvedByDeanAcademics: false
                            },
                            {
                                status: 'COMPLETED',
                                approvedByDeanAcademics: true
                            }
                        ]
                    },
                    ...baseQuery
                });
                break;

            case 'STUDENT':
                // Students can see their own reports
                reports = await prisma.medicalReport.findMany({
                    where: {
                        studentId: session.user.id
                    },
                    ...baseQuery
                });
                break;

            default:
                return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
        }
        
        console.log('API Response:', JSON.stringify(reports, null, 2));
        return NextResponse.json(reports);
    } catch (error) {
        console.error('Failed to fetch reports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reports' },
            { status: 500 }
        );
    }
} 