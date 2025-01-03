import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    try {
        const report = await prisma.medicalReport.findUnique({
            where: { id }
        });

        if (!report) {
            return new Response(
                JSON.stringify({ error: 'Report not found' }), 
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify(report),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error fetching report:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch report' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    try {
        const { status, comment } = await request.json();

        const updatedReport = await prisma.medicalReport.update({
            where: { id },
            data: {
                status,
                reviewComment: comment,
                reviewedAt: new Date(),
            },
        });

        return new Response(
            JSON.stringify(updatedReport),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error updating report:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update report' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
