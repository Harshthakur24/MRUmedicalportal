import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

type UpdateData = {
    name?: string;
    studentContact?: string;
    parentName?: string;
    parentContact?: string;
    className?: string;
    department?: string;
};

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                rollNumber: true,
                studentContact: true,
                parentName: true,
                parentContact: true,
                className: true,
                image: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json() as UpdateData;
        
        // Only allow updating specific fields based on user role
        const allowedFields: Record<string, (keyof UpdateData)[]> = {
            STUDENT: ['name', 'studentContact', 'parentName', 'parentContact', 'className'],
            PROGRAM_COORDINATOR: ['name', 'department'],
            HOD: ['name', 'department'],
            DEAN_ACADEMICS: ['name']
        };

        const role = session.user.role as keyof typeof allowedFields;
        const updateData: Prisma.UserUpdateInput = {};

        // Filter out fields that aren't allowed for the user's role
        Object.keys(data).forEach(key => {
            if (allowedFields[role].includes(key as keyof UpdateData)) {
                updateData[key as keyof Prisma.UserUpdateInput] = data[key as keyof UpdateData];
            }
        });

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                rollNumber: true,
                studentContact: true,
                parentName: true,
                parentContact: true,
                className: true,
                image: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
} 