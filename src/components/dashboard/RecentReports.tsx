import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { MedicalReport } from "@/types/dashboard";
import { useSession } from "next-auth/react";

interface RecentReportsProps {
    data: MedicalReport[] | undefined;
}

export default function RecentReports({ data }: RecentReportsProps) {
    const { data: session } = useSession();
    if (!data?.length) return null;

    return (
        <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.map((report) => (
                        <div
                            key={report.id}
                            className="flex items-center justify-between border-b pb-4"
                        >
                            <div>
                                <p className="font-medium">{report.disease}</p>
                                {session?.user.role !== 'STUDENT' && (
                                    <p className="text-sm text-gray-600">
                                        {report.studentName} - {report.department} Year {report.year}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">
                                    {formatDate(report.dateOfAbsence)} - {formatDate(report.dateTo)}
                                </p>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-sm ${report.status === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : report.status === 'APPROVED' || 'COMPLETED'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {report.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 