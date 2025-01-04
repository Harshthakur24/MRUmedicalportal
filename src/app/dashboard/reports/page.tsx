'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Report {
    id: string;
    studentName: string;
    submissionDate: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    medicalCertificate: string;
}

const ReportsSkeleton = () => {
    return (
        <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gray-200 rounded-full h-8 w-8"></div>
                            <Skeleton className="h-5 w-24 md:w-36" />
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-gray-200 rounded-md h-6 w-20 md:w-24"></div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="space-y-2">
                            <div className="bg-gray-200 rounded-md h-4 w-full max-w-[180px] md:max-w-[250px]"></div>
                            <div className="bg-gray-200 rounded-md h-4 w-full max-w-[140px] md:max-w-[200px]"></div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-gray-200 rounded-md h-6 w-16 md:w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                            <div className="bg-gray-200 rounded-md h-8 w-20 md:w-24"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    )
}

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/reports');
            if (!response.ok) throw new Error('Failed to fetch reports');
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reason.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (isLoading && reports.length === 0) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <ReportsSkeleton />
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
                <button
                    onClick={fetchReports}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg border hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by student name or reason..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        {isLoading ? (
                            <ReportsSkeleton />
                        ) : (
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{report.studentName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(report.submissionDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="max-w-xs truncate">{report.reason}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${report.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    report.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {report.status === 'PENDING' ? (
                                                <Link
                                                    href={`/dashboard/reports/${report.id}`}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                                >
                                                    Review Report
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/dashboard/reports/${report.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
                {!isLoading && filteredReports.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No reports found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
} 