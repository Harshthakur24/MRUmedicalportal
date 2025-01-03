import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ReportReviewModalProps {
    report: {
        id: string;
        studentName: string;
        submittedDate: string;
        reason: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onReviewComplete: () => void;
}

export function ReportReviewModal({
    report,
    isOpen,
    onClose,
    onReviewComplete
}: ReportReviewModalProps) {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/reports/${report.id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    comment,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to review report');
            }

            toast.success(
                status === 'REJECTED'
                    ? 'Report rejected successfully'
                    : 'Report approved successfully'
            );
            onReviewComplete();
            onClose();
        } catch (error) {
            toast.error('Failed to review report');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Review Medical Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Student</h4>
                        <p>{report.studentName}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Submitted Date</h4>
                        <p>{new Date(report.submittedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Reason</h4>
                        <p>{report.reason}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Review Comment</h4>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Enter your comments here..."
                            className="mt-2"
                        />
                    </div>
                </div>
                <DialogFooter className="space-x-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleReview('REJECTED')}
                        disabled={isSubmitting}
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={() => handleReview('APPROVED')}
                        disabled={isSubmitting}
                    >
                        Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 