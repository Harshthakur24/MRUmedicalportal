'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { BarChart, LineChart } from "@/components/ui/charts";
import {
    Loader2, FileText, Clock, AlertCircle,
    CheckCircle2, Search, Download, RefreshCw,
    TrendingUp, Building
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AdminDashboardData {
    totalReports: number;
    pendingReports: number;
    approvedReports: number;
    rejectedReports: number;
    averageApprovalTime: number;
    recentReports: MedicalReport[];
    monthlyStats: MonthlyStats[];
    departmentStats: DepartmentStats[];
    approvalTimeStats: ApprovalTimeStats[];
}

interface MedicalReport {
    id: string;
    studentName: string;
    department: string;
    submissionDate: string;
    status: string;
    disease: string;
    approvedByProgramCoordinator: boolean;
    approvedByHOD: boolean;
    approvedByDeanAcademics: boolean;
    programCoordinatorApprovalDate?: string;
    hodApprovalDate?: string;
    deanApprovalDate?: string;
}

interface MonthlyStats {
    month: string;
    total: number;
    approved: number;
    rejected: number;
}

interface DepartmentStats {
    department: string;
    total: number;
    approved: number;
    rejected: number;
    averageApprovalTime: number;
}

interface ApprovalTimeStats {
    stage: string;
    averageTime: number;
    minTime: number;
    maxTime: number;
}

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [dateRange, setDateRange] = useState("all");

    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData();
    }, [session]);

    const fetchDashboardData = async () => {
        if (session?.user?.role !== "ADMIN") return;
        setLoading(true);
        try {
            const response = await fetch('/api/admin/dashboard');
            if (!response.ok) throw new Error('Failed to fetch dashboard data');
            const data = await response.json();
            setDashboardData(data);
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter reports based on search and filters
    const filteredReports = useMemo(() => {
        if (!dashboardData?.recentReports) return [];

        return dashboardData.recentReports.filter(report => {
            const matchesSearch =
                report.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.department.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || report.status.toLowerCase() === statusFilter.toLowerCase();
            const matchesDepartment = departmentFilter === "all" || report.department === departmentFilter;

            let matchesDate = true;
            const reportDate = new Date(report.submissionDate);
            const today = new Date();

            switch (dateRange) {
                case "today":
                    matchesDate = reportDate.toDateString() === today.toDateString();
                    break;
                case "week":
                    const weekAgo = new Date(today.setDate(today.getDate() - 7));
                    matchesDate = reportDate >= weekAgo;
                    break;
                case "month":
                    matchesDate = reportDate.getMonth() === today.getMonth() &&
                        reportDate.getFullYear() === today.getFullYear();
                    break;
                case "year":
                    matchesDate = reportDate.getFullYear() === today.getFullYear();
                    break;
            }

            return matchesSearch && matchesStatus && matchesDepartment && matchesDate;
        });
    }, [dashboardData?.recentReports, searchTerm, statusFilter, departmentFilter, dateRange]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#004a7c]" />
            </div>
        );
    }

    if (!session || session.user.role !== "ADMIN") return null;

    return (
        <div className="min-h-screen p-6 bg-gradient-to-b from-[#004a7c]/10 to-white">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header with Stats Summary */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-[#004a7c]">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Welcome back, {session.user.name}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchDashboardData}
                                disabled={loading}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const csvContent = "data:text/csv;charset=utf-8,"
                                        + filteredReports.map(row =>
                                            [row.studentName, row.department, row.disease, formatDate(row.submissionDate), row.status].join(",")
                                        ).join("\n");
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", `medical-reports-${new Date().toISOString().split('T')[0]}.csv`);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export Data
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FileText className="h-8 w-8 text-[#004a7c]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Reports</p>
                                        <h3 className="text-2xl font-bold">{dashboardData?.totalReports || 0}</h3>
                                        <p className="text-xs text-gray-400 mt-1">All time submissions</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-yellow-50 rounded-lg">
                                        <AlertCircle className="h-8 w-8 text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Pending Reports</p>
                                        <h3 className="text-2xl font-bold">{dashboardData?.pendingReports || 0}</h3>
                                        <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Approved Reports</p>
                                        <h3 className="text-2xl font-bold">{dashboardData?.approvedReports || 0}</h3>
                                        <p className="text-xs text-gray-400 mt-1">Successfully processed</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Clock className="h-8 w-8 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Avg. Processing Time</p>
                                        <h3 className="text-2xl font-bold">{dashboardData?.averageApprovalTime || 0} days</h3>
                                        <p className="text-xs text-gray-400 mt-1">From submission to approval</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by name, disease, or department..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {dashboardData?.departmentStats.map(stat => (
                                        <SelectItem key={stat.department} value={stat.department}>
                                            {stat.department}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={dateRange} onValueChange={setDateRange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Date range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs for Different Views */}
                <Tabs defaultValue="reports" className="space-y-6">
                    <TabsList className="bg-white/50 p-1 space-x-2">
                        <TabsTrigger value="reports" className="data-[state=active]:bg-[#004a7c] data-[state=active]:text-white">
                            <FileText className="h-4 w-4 mr-2" />
                            Reports Overview
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-[#004a7c] data-[state=active]:text-white">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="departments" className="data-[state=active]:bg-[#004a7c] data-[state=active]:text-white">
                            <Building className="h-4 w-4 mr-2" />
                            Department Stats
                        </TabsTrigger>
                        <TabsTrigger value="approval-times" className="data-[state=active]:bg-[#004a7c] data-[state=active]:text-white">
                            <Clock className="h-4 w-4 mr-2" />
                            Approval Times
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="reports" className="space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Medical Reports
                                    <span className="text-sm font-normal text-gray-500 ml-2">
                                        ({filteredReports.length} reports)
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={filteredReports}
                                    columns={[
                                        {
                                            header: "Student Name",
                                            accessorKey: "studentName",
                                        },
                                        {
                                            header: "Department",
                                            accessorKey: "department",
                                        },
                                        {
                                            header: "Disease",
                                            accessorKey: "disease",
                                        },
                                        {
                                            header: "Submission Date",
                                            accessorKey: "submissionDate",
                                            cell: ({ row }) => formatDate(row.original.submissionDate),
                                        },
                                        {
                                            header: "Status",
                                            accessorKey: "status",
                                            cell: ({ row }) => (
                                                <span className={`px-2 py-1 rounded-full text-xs ${row.original.status === 'APPROVED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : row.original.status === 'REJECTED'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {row.original.status}
                                                </span>
                                            ),
                                        },
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Monthly Report Trends
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <LineChart
                                        data={dashboardData?.monthlyStats || []}
                                        xAxis="month"
                                        series={[
                                            { key: "total", label: "Total Reports" },
                                            { key: "approved", label: "Approved" },
                                            { key: "rejected", label: "Rejected" },
                                        ]}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Status Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <BarChart
                                        data={[
                                            { stage: 'Approved', value: dashboardData?.approvedReports || 0 },
                                            { stage: 'Pending', value: dashboardData?.pendingReports || 0 },
                                            { stage: 'Rejected', value: dashboardData?.rejectedReports || 0 },
                                        ]}
                                        xAxis="stage"
                                        series={[
                                            { key: "value", label: "Reports" }
                                        ]}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="departments" className="space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    Department-wise Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[500px]">
                                <BarChart
                                    data={dashboardData?.departmentStats || []}
                                    xAxis="department"
                                    series={[
                                        { key: "total", label: "Total Reports" },
                                        { key: "approved", label: "Approved" },
                                        { key: "rejected", label: "Rejected" },
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="approval-times" className="space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Processing Time Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[500px]">
                                <BarChart
                                    data={dashboardData?.approvalTimeStats || []}
                                    xAxis="stage"
                                    series={[
                                        { key: "averageTime", label: "Average Time (days)" },
                                        { key: "minTime", label: "Minimum Time (days)" },
                                        { key: "maxTime", label: "Maximum Time (days)" },
                                    ]}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 