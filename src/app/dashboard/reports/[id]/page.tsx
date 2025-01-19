'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft, Clock, User, FileText, Calendar, CheckCircle, XCircle,
    Phone, UserCircle, Building, Stethoscope, CalendarDays, BookOpen,
    Download, Eye
} from 'lucide-react';
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';

interface Report {
    id: string;
    studentName: string;
    submissionDate: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    medicalCertificate: string;
    doctorName: string;
    doctorAddress: string;
    disease: string;
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
}

export default function ReportReviewPage() {
    const router = useRouter();
    const params = useParams();
    const [report, setReport] = useState<Report | null>(null);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`/api/reports/${params.id}`);
                if (!response.ok) throw new Error('Failed to fetch report');
                const data = await response.json();
                console.log(data);
                setReport(data);
            } catch (error) {
                toast.error('Failed to fetch report details');
                router.push('/dashboard/reports');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [params.id, router]);

    const handleReview = async (action: 'approve' | 'reject') => {
        if (!comment.trim() && action === 'reject') {
            toast.error('Please provide a comment for rejection');
            return;
        }

        try {
            setIsSubmitting(true);

            // Get user role from session
            const session = await fetch('/api/auth/session');
            const sessionData = await session.json();
            const userRole = sessionData?.user?.role;

            // Determine the correct API endpoint based on role
            let endpoint = '';
            switch (userRole) {
                case 'PROGRAM_COORDINATOR':
                    endpoint = `/api/reports/${params.id}/approve/program-coordinator`;
                    break;
                case 'HOD':
                    endpoint = `/api/reports/${params.id}/approve/hod`;
                    break;
                case 'DEAN_ACADEMICS':
                    endpoint = `/api/reports/${params.id}/approve/dean`;
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
                                <h1 className="text-4xl font-bold text-white">Medical Report Review</h1>
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
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Certificate
                                    </a>
                                    <a
                                        href={report.medicalCertificate}
                                        download
                                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'details'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Report Details
                            </button>
                            <button
                                onClick={() => setActiveTab('medical')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'medical'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Medical Information
                            </button>
                            <button
                                onClick={() => setActiveTab('academic')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'academic'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Academic Impact
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'details' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">
                                <div className="space-y-5">
                                    <div className="flex items-start space-x-3">
                                        <User className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Student Name</p>
                                            <p className="text-base font-medium text-gray-900">{report.studentName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Building className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Class & Section</p>
                                            <p className="text-base text-gray-900">
                                                {report.className}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Phone className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 space-y-2">Contact Information</p>
                                            <p className="text-base text-gray-900">
                                                Student: {report.studentContact}
                                            </p>
                                            <p className="text-base text-gray-900">
                                                Parent: {report.parentContact}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <UserCircle className="w-5 h-5 text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Parent Name</p>
                                            <p className="text-base text-gray-900">{report.parentName}</p>
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
                        )}

                        {activeTab === 'medical' && (
                            <div className="space-y-6 py-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-5">
                                        <div className="flex items-start space-x-3">
                                            <FileText className="w-5 h-5 text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Reason for Leave</p>
                                                <p className="text-base text-gray-900">{report.reason}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <Stethoscope className="w-5 h-5 text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Disease/Condition</p>
                                                <p className="text-base text-gray-900">{report.disease}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex items-start space-x-3">
                                            <User className="w-5 h-5 text-gray-400 mt-1" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Doctor Information</p>
                                                <p className="text-base text-gray-900">{report.doctorName}</p>
                                                <p className="text-sm text-gray-500">{report.doctorAddress}</p>
                                            </div>
                                        </div>

                                        {report.medicalCertificate && (
                                            <div className="mt-4">
                                                <a
                                                    href={report.medicalCertificate}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    View Medical Certificate
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'academic' && (
                            <div className="space-y-6 py-2">
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
                        )}

                        <div className="p-6 bg-gray-50 border-t border-gray-200">
                            <div className="max-w-3xl mx-auto">
                                {report.status !== 'PENDING' && (
                                    <div className={`mb-4 p-4 rounded-md ${report.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        <p className="text-sm">
                                            Current status: <span className="font-medium">{(report.status as string).toLowerCase()}</span>
                                        </p>
                                    </div>
                                )}

                                <div className="mb-8">
                                    <label
                                        htmlFor="comment"
                                        className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                                    >
                                        <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                        Review Comment
                                        <span className="ml-2 text-xs text-gray-500">(Required for rejection)</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="comment"
                                            rows={4}
                                            className="block w-full p-4 rounded-md border-gray-300 shadow-sm focus:border-[#004a7c] focus:ring-[#004a7c] sm:text-sm"
                                            placeholder="Enter your review comment here..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => handleReview('approve')}
                                        disabled={isSubmitting}
                                        className={`flex-1 bg-green-600 h-10 p-2 hover:bg-green-700 text-white ${report.status === 'APPROVED' ? 'opacity-50' : ''}`}
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
                                        disabled={isSubmitting}
                                        className={`flex-1 bg-red-600 h-10 p-2 hover:bg-red-700 text-white ${report.status === 'REJECTED' ? 'opacity-50' : ''}`}
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
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
} 