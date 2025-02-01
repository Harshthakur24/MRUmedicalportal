'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Download, FileText, User, Calendar, Clock, Phone, UserCircle, Building, Stethoscope, CalendarDays, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { use } from 'react';

interface Report {
    id: string;
    student: {
        name: string;
        email: string;
        department: string;
        className: string;
        rollNumber: string;
    };
    submissionDate: string;
    disease: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    medicalCertificate: string;
    doctorName: string;
    doctorAddress: string;
    dateOfAbsence: string;
    dateTo: string;
    workingDays: number;
    parentName: string;
    parentContact: string;
    studentContact: string;
    className: string;
    t1Reexam: boolean;
    t2Reexam: boolean;
    t1Subjects?: string;
    t2Subjects?: string;
    currentApprovalLevel: string;
    approvedByProgramCoordinator: boolean;
    approvedByHOD: boolean;
    approvedByDeanAcademics: boolean;
    programCoordinatorComment?: string;
    hodComment?: string;
    deanAcademicsComment?: string;
}

export default function ReportDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const resolvedParams = use(params);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const response = await fetch(`/api/reports/${resolvedParams.id}`);
            if (!response.ok) throw new Error('Failed to fetch report');
            const data = await response.json();
            setReport(data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch report details');
            router.push('/dashboard/reports');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReview = async (action: 'approve' | 'reject') => {
        if (!comment.trim() && action === 'reject') {
            toast.error('Please provide a comment for rejection');
            return;
        }

        try {
            setIsSubmitting(true);

            let endpoint = '';
            switch (session?.user?.role) {
                case 'PROGRAM_COORDINATOR':
                    endpoint = `/api/reports/${resolvedParams.id}/approve/program-coordinator`;
                    break;
                case 'HOD':
                    endpoint = `/api/reports/${resolvedParams.id}/approve/hod`;
                    break;
                case 'DEAN_ACADEMICS':
                    endpoint = `/api/reports/${resolvedParams.id}/approve/dean`;
                    break;
                default:
                    throw new Error('Unauthorized role');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    approved: action === 'approve',
                    comment
                }),
            });

            if (!response.ok) throw new Error('Failed to review report');

            const updatedReport = await response.json();
            setReport(updatedReport);

            toast.success(
                action === 'approve'
                    ? 'Medical report has been approved ✅'
                    : 'Medical report has been rejected ❌'
            );

            router.refresh();
        } catch (error) {
            toast.error('Failed to submit review');
            console.error('Review error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = async () => {
        if (!report) return;

        try {
            const response = await fetch(`/api/reports/${resolvedParams.id}`, {
                headers: {
                    'download': 'true'
                }
            });

            if (!response.ok) throw new Error('Failed to download file');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `medical-report-${resolvedParams.id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download report');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#004a7c]" />
            </div>
        );
    }

    if (!report) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => router.push('/dashboard/reports')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Reports
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                                <h1 className="text-4xl font-bold text-white">Medical Report Details</h1>
                                <p className="text-indigo-100 mt-1">Review and process the medical report submission</p>
                                <div className="mt-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                        ${report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            report.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {report.status}
                                    </span>
                                </div>
                            </div>
                            {report.medicalCertificate && (
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <a
                                        href={report.medicalCertificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        View Certificate
                                    </a>
                                    <Button
                                        onClick={handleDownload}
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                            <div className="space-y-5">
                                <div className="flex items-start space-x-3">
                                    <User className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Student Name</p>
                                        <p className="text-base font-medium text-gray-900">{report?.student?.name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Building className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Class & Section</p>
                                        <p className="text-base text-gray-900">{report?.className || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Contact Information</p>
                                        <p className="text-base text-gray-900">Student: {report?.studentContact || 'N/A'}</p>
                                        <p className="text-base text-gray-900">Parent: {report?.parentContact || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <UserCircle className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Parent Name</p>
                                        <p className="text-base text-gray-900">{report?.parentName || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Submission Date</p>
                                        <p className="text-base text-gray-900">
                                            {new Date(report.submissionDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <CalendarDays className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Absence Period</p>
                                        <p className="text-base text-gray-900">
                                            From: {new Date(report.dateOfAbsence).toLocaleDateString()}
                                        </p>
                                        <p className="text-base text-gray-900">
                                            To: {new Date(report.dateTo).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            ({report.workingDays} working days)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Stethoscope className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Disease/Reason</p>
                                        <p className="text-base text-gray-900">{report.disease}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Clock className="w-5 h-5 text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <span className={`mt-1 px-3 py-1 inline-flex text-sm font-medium rounded-full 
                                            ${report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                report.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Re-examination Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-5">
                                    <div className="flex items-start space-x-3">
                                        <BookOpen className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Term 1 Re-examination</p>
                                            <p className="text-base text-gray-900">
                                                {report.t1Reexam ? 'Required' : 'Not Required'}
                                            </p>
                                            {report.t1Reexam && report.t1Subjects && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Subjects: {report.t1Subjects}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex items-start space-x-3">
                                        <BookOpen className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Term 2 Re-examination</p>
                                            <p className="text-base text-gray-900">
                                                {report.t2Reexam ? 'Required' : 'Not Required'}
                                            </p>
                                            {report.t2Reexam && report.t2Subjects && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Subjects: {report.t2Subjects}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {session?.user?.role === report.currentApprovalLevel && report.status === 'PENDING' && (
                            <div className="mt-8 space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Review Comment
                                        <span className="text-xs text-gray-500 ml-2">(Required for rejection)</span>
                                    </label>
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Enter your review comment here..."
                                        className="min-h-[100px]"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => handleReview('approve')}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                        )}
                                        Approve Report
                                    </Button>
                                    <Button
                                        onClick={() => handleReview('reject')}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <XCircle className="w-4 h-4 mr-2" />
                                        )}
                                        Reject Report
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
}