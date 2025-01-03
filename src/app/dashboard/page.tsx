'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentReports from "@/components/dashboard/RecentReports";
import { Loader2 } from "lucide-react";
import { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard');
                if (!response.ok) throw new Error('Failed to fetch dashboard data');
                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) {
            fetchDashboardData();
        }
    }, [session]);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#004a7c]" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen p-6 bg-[#004a7c]/10">
            <div className="max-w-7xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-[#004a7c]">
                    Welcome, {session.user.name}
                </h1>
                <DashboardStats data={dashboardData} />
                <RecentReports data={dashboardData?.recentReports} />
            </div>
        </div>
    );
} 