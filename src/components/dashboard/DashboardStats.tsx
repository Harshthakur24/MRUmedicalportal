import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle } from "lucide-react";
import { DashboardData } from "@/types/dashboard";

interface DashboardStatsProps {
    data: DashboardData | null;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
    if (!data) return null;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Reports
                    </CardTitle>
                    <FileText className="h-4 w-4 text-[#004a7c]" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-[#004a7c]">
                        {data.totalReports}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Pending Reports
                    </CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                        {data.pendingReports}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Approved Reports
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {data.approvedReports}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 