'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft, Clock, User, FileText, Calendar, CheckCircle, XCircle,
    Phone, UserCircle, Building, Stethoscope, CalendarDays, BookOpen,
    Download, Eye
} from 'lucide-react';
import { toast } from 'sonner';

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
    section: string;
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

    const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
        if (!comment.trim() && status === 'REJECTED') {
            toast.error('Please provide a comment for rejection');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/reports/${params.id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    comment,
                }),
            });

            if (!response.ok) throw new Error('Failed to review report');

            toast.success(
                status === 'APPROVED'
                    ? 'Medical report has been approved'
                    : 'Medical report has been rejected'
            );

            setTimeout(() => {
                router.push('/dashboard/reports');
            }, 1500);

        } catch (error) {
            toast.error('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                        <div className="flex justify-between items-start">
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
                                <div className="flex space-x-2">
                                    <a
                                        href={report.medicalCertificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Certificate
                                    </a>
                                    <a
                                        href={report.medicalCertificate}
                                        download
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors"
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
                                                {report.className} - {report.section}
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

                        {report.status === 'PENDING' && (
                            <div className="p-6 bg-gray-50 border-t border-gray-200">
                                <div className="max-w-3xl mx-auto">
                                    <div className="mb-8">
                                        <label
                                            htmlFor="comment"
                                            className="text-sm font-medium text-gray-700 mb-2 flex items-center"
                                        >
                                            <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                            Review Comment
                                            {report.status === 'PENDING' && (
                                                <span className="ml-2 text-xs text-gray-500">(Required for rejection)</span>
                                            )}
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                id="comment"
                                                rows={4}
                                                className="block w-full px-4 py-3 text-gray-900 placeholder-gray-400 border border-gray-300 
                                                           rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                                           transition duration-200 ease-in-out resize-none
                                                           hover:border-gray-400 shadow-sm
                                                           text-sm leading-relaxed"
                                                placeholder="Enter your detailed review comments here..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                                {comment.length} characters
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Provide clear and specific feedback about your decision.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end space-x-4">
                                        <button
                                            onClick={() => handleReview('REJECTED')}
                                            disabled={isSubmitting}
                                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject Report
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReview('APPROVED')}
                                            disabled={isSubmitting}
                                            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Approve Report
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 