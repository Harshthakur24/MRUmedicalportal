'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Report {
    id: string;
    studentName: string;
    rollNumber: string;
    dateOfAbsence: string;
    dateTo: string;
    reason: string;
    doctorName: string;
    doctorAddress: string;
    medicalCertificate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    parentName: string;
    parentContact: string;
    studentContact: string;
    className: string;
    section: string;
    disease: string;
    workingDays: number;
    t1Reexam: boolean;
    t1Subjects?: string;
    t2Reexam: boolean;
    t2Subjects?: string;
    submissionDate: string;
    reviewComment?: string;
}

interface ReportReviewModalProps {
    report: Report;
    isOpen: boolean;
    onClose: () => void;
}

export default function ReportReviewModal({ report, isOpen, onClose }: ReportReviewModalProps) {
    const router = useRouter();
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStatusUpdate = async (status: 'APPROVED' | 'REJECTED') => {
        if (status === 'REJECTED' && !comment.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/reports/${report.id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    comment: comment.trim()
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to update report');
            }

            toast.success(`Report ${status.toLowerCase()} successfully`);
            onClose();
            router.push('/dashboard/reports');
            router.refresh();
        } catch (error) {
            console.error(`Failed to ${status.toLowerCase()} report:`, error);
            toast.error(`Failed to ${status.toLowerCase()} report`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Review Medical Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Student Name</Label>
                            <div className="mt-1 text-sm">{report.studentName}</div>
                        </div>
                        <div>
                            <Label>Roll Number</Label>
                            <div className="mt-1 text-sm">{report.rollNumber}</div>
                        </div>
                        <div>
                            <Label>Class</Label>
                            <div className="mt-1 text-sm">{report.className}</div>
                        </div>
                        <div>
                            <Label>Section</Label>
                            <div className="mt-1 text-sm">{report.section}</div>
                        </div>
                        <div>
                            <Label>Student Contact</Label>
                            <div className="mt-1 text-sm">{report.studentContact}</div>
                        </div>
                        <div>
                            <Label>Parent Contact</Label>
                            <div className="mt-1 text-sm">{report.parentContact}</div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Parent Name</Label>
                        <div className="text-sm">{report.parentName}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Date of Absence</Label>
                            <div className="mt-1 text-sm">
                                {new Date(report.dateOfAbsence).toLocaleDateString()}
                            </div>
                        </div>
                        <div>
                            <Label>To Date</Label>
                            <div className="mt-1 text-sm">
                                {new Date(report.dateTo).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label>Working Days Missed</Label>
                        <div className="mt-1 text-sm">{report.workingDays} days</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Disease/Reason</Label>
                        <div className="text-sm">{report.disease}</div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Doctor&apos;s Name</Label>
                        <div className="text-sm">{report.doctorName}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Doctor&apos;s Address</Label>
                        <div className="text-sm">{report.doctorAddress}</div>
                    </div>

                    {report.t1Reexam && (
                        <div className="space-y-2">
                            <Label>T1 Re-exam Subjects</Label>
                            <div className="text-sm">{report.t1Subjects}</div>
                        </div>
                    )}

                    {report.t2Reexam && (
                        <div className="space-y-2">
                            <Label>T2 Re-exam Subjects</Label>
                            <div className="text-sm">{report.t2Subjects}</div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Medical Certificate</Label>
                        <div className="text-sm">
                            <a
                                href={report.medicalCertificate}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                View Certificate
                            </a>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Submission Date</Label>
                        <div className="text-sm">
                            {new Date(report.submissionDate).toLocaleString()}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Review Comment</Label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Enter your review comments here..."
                            className="mt-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className={`text-sm font-medium ${report.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {report.status}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => handleStatusUpdate('APPROVED')}
                            disabled={loading}
                        >
                            {loading ? 'Approving...' : 'Approve Report'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleStatusUpdate('REJECTED')}
                            disabled={loading}
                        >
                            {loading ? 'Rejecting...' : 'Reject Report'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 