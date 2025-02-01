'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { DefaultSession } from 'next-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Report {
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    currentApprovalLevel: string;
}

interface ReportReviewModalProps {
    report: Report;
    onClose: () => void;
}

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            role: string;
            department?: string | null;
            rollNumber?: string | null;
            year?: string | null;
            school?: string | null;
        }
    }
}

export default function ReportReviewModal({ report, onClose }: ReportReviewModalProps) {
    const { data: sessionData } = useSession();
    const userRole = sessionData?.user?.role;
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReview = async (action: 'approve' | 'reject') => {
        if (!comment.trim() && action === 'reject') {
            toast.error('Please provide a comment for rejection');
            return;
        }

        try {
            setIsSubmitting(true);

            let endpoint = '';
            switch (userRole) {
                case 'PROGRAM_COORDINATOR':
                    endpoint = `/api/reports/${report.id}/approve/program-coordinator`;
                    break;
                case 'HOD':
                    endpoint = `/api/reports/${report.id}/approve/hod`;
                    break;
                case 'DEAN_ACADEMICS':
                    endpoint = `/api/reports/${report.id}/approve/dean`;
                    break;
                default:
                    throw new Error('Unauthorized role');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: action === 'approve', comment }),
            });

            if (!response.ok) throw new Error('Failed to review report');

            toast.success(
                action === 'approve'
                    ? 'Medical report has been approved ✅'
                    : 'Medical report has been rejected ❌'
            );

            onClose();
        } catch (error) {
            toast.error('Failed to submit review');
            console.error('Review error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Review Medical Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div>
                        <label htmlFor="comment" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            Review Comment
                            <span className="ml-2 text-xs text-gray-500">(Required for rejection)</span>
                        </label>
                        <Textarea
                            id="comment"
                            rows={4}
                            className="mt-2"
                            placeholder="Enter your review comment here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={() => handleReview('approve')}
                            disabled={isSubmitting || report.status === 'APPROVED'}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            {report.status === 'APPROVED' ? 'Already Approved' : 'Approve Report'}
                        </Button>
                        <Button
                            onClick={() => handleReview('reject')}
                            disabled={isSubmitting || report.status === 'REJECTED'}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <XCircle className="w-4 h-4 mr-2" />
                            )}
                            {report.status === 'REJECTED' ? 'Already Rejected' : 'Reject Report'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 