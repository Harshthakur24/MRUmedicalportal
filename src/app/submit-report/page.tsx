'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MedicalReportForm from "@/components/MedicalReportForm";

export default function SubmitReportPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen p-6 bg-[#004a7c]/10">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-[#004a7c]">
                            Medical Report Submission & Request for Re-Exams
                        </CardTitle>
                        <CardDescription>
                            Please fill out the form below to submit your medical report or request a re-examination
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MedicalReportForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 