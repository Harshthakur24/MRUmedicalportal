import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { Prisma } from '@prisma/client';

type StudentSelect = {
    id: true;
    name: true;
    email: true;
    department: true;
    rollNumber: true;
    year: true;
};

type ReportWithStudent = Prisma.MedicalReportGetPayload<{
    include: {
        student: {
            select: StudentSelect;
        };
    };
}>;

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
        const session = await auth();
        if (!session?.user) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized' }), 
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const studentSelect = {
            id: true,
            name: true,
            email: true,
            department: true,
            rollNumber: true,
            year: true
        } as const;

        let reports: ReportWithStudent[] = [];
        
        // STUDENT: Can only see their own reports
        if (session.user.role === 'STUDENT') {
            reports = await prisma.medicalReport.findMany({
                where: {
                    studentId: session.user.id
                },
                include: {
                    student: {
                        select: studentSelect
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }
        
        // PROGRAM_COORDINATOR: Can see pending reports and reports they've approved
        else if (session.user.role === 'PROGRAM_COORDINATOR' && session.user.department) {
            const departmentCondition = session.user.department === 'CST' 
                ? { in: ['CST', 'CSE'] }
                : session.user.department;

            reports = await prisma.medicalReport.findMany({
                where: {
                    student: {
                        department: departmentCondition
                    },
                    OR: [
                        {
                            // Reports needing PC approval
                            status: 'PENDING',
                            currentApprovalLevel: 'PROGRAM_COORDINATOR',
                            approvedByProgramCoordinator: false
                        },
                        {
                            // Reports approved by this PC
                            approvedByProgramCoordinator: true,
                            department: departmentCondition
                        }
                    ]
                },
                include: {
                    student: {
                        select: studentSelect
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }
        
        // HOD: Can see pending reports and reports they've approved
        else if (session.user.role === 'HOD' && session.user.department) {
            const departmentCondition = session.user.department === 'CST' 
                ? { in: ['CST', 'CSE'] }
                : session.user.department;

            reports = await prisma.medicalReport.findMany({
                where: {
                    student: {
                        department: departmentCondition
                    },
                    OR: [
                        {
                            // Reports needing HOD approval
                            status: 'PENDING',
                            currentApprovalLevel: 'HOD',
                            approvedByProgramCoordinator: true,
                            approvedByHOD: false
                        },
                        {
                            // Reports approved by this HOD
                            approvedByHOD: true,
                            department: departmentCondition
                        }
                    ]
                },
                include: {
                    student: {
                        select: studentSelect
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }
        
        // DEAN: Can see pending reports and reports they've approved
        else if (session.user.role === 'DEAN_ACADEMICS') {
            reports = await prisma.medicalReport.findMany({
                where: {
                    OR: [
                        {
                            // Reports needing Dean approval
                            status: 'PENDING',
                            currentApprovalLevel: 'DEAN_ACADEMICS',
                            approvedByProgramCoordinator: true,
                            approvedByHOD: true,
                            approvedByDeanAcademics: false
                        },
                        {
                            // Reports approved by Dean
                            approvedByDeanAcademics: true
                        }
                    ]
                },
                include: {
                    student: {
                        select: studentSelect
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }

        // Remove sensitive student information from response
        const sanitizedReports = reports.map(report => ({
            ...report,
            student: {
                ...report.student,
                name: undefined,
                rollNumber: undefined
            }
        }));

        return new NextResponse(
            JSON.stringify(sanitizedReports),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error fetching reports:', error);
        return new NextResponse(
            JSON.stringify({ error: 'Failed to fetch reports' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
} 