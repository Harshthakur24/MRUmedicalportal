'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function MedicalReportForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    console.log('Session in form:', session);

    if (status === "unauthenticated") {
        return <div>Please sign in to submit a report</div>;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formElement = e.currentTarget;
            const formData = new FormData(formElement);

            const response = await fetch('/api/reports', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit report');
            }

            toast.success('Report submitted successfully');
            formElement.reset();
            router.push('/');
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit report');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Student&apos;s Name</Label>
                            <Input
                                name="studentName"
                                required
                                placeholder="Enter your name"
                                defaultValue={session?.user?.name || ''}
                            />
                        </div>
                        <div>
                            <Label>Parent&apos;s Name</Label>
                            <Input
                                name="parentName"
                                required
                                placeholder="Enter parent's name"
                            />
                        </div>

                        <div>
                            <Label>Roll Number</Label>
                            <Input
                                name="rollNumber"
                                required
                                placeholder="Enter your roll number"
                            />
                        </div>
                        <div>
                            <Label>Parent&apos;s Contact</Label>
                            <Input
                                name="parentContact"
                                required
                                placeholder="Enter parent's contact"
                            />
                        </div>
                        <div>
                            <Label>Class</Label>
                            <Input
                                name="className"
                                required
                                placeholder="Enter your class"
                            />
                        </div>
                        <div>
                            <Label>Section</Label>
                            <Input
                                name="section"
                                required
                                placeholder="Enter your section"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Absence Details */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Absence Details</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Date of Absence</Label>
                                <Input
                                    type="date"
                                    name="dateOfAbsence"
                                    required
                                />
                            </div>
                            <div>
                                <Label>To Date</Label>
                                <Input type="date" name="dateTo" required />
                            </div>
                        </div>
                        <div>
                            <Label>Working Days Missed</Label>
                            <Input type="number" name="workingDays" required min="0" />
                        </div>
                        <div>
                            <Label>Disease/Reason</Label>
                            <Textarea name="disease" required placeholder="Describe your medical condition" />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Medical Details */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Medical Details</h3>
                    <div className="space-y-4">
                        <div>
                            <Label>Doctor&apos;s Name</Label>
                            <Input name="doctorName" required placeholder="Enter doctor's name" />
                        </div>
                        <div>
                            <Label>Address of Doctor/Hospital</Label>
                            <Input name="doctorAddress" required placeholder="Enter hospital/clinic address" />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Re-examination Details */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Re-examination Requests</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="needsT1Reexam"
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label>Request T1 Re-examination</Label>
                            </div>
                            <Input
                                name="t1Subjects"
                                placeholder="Enter subjects (if requesting re-exam)"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="needsT2Reexam"
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label>Request T2 Re-examination</Label>
                            </div>
                            <Input
                                name="t2Subjects"
                                placeholder="Enter subjects (if requesting re-exam)"
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Documents */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Documents</h3>
                    <div>
                        <Label>Upload Medical Certificate</Label>
                        <Input
                            type="file"
                            name="files.medicalCertificate"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="mt-2"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Upload medical certificate (PDF, JPG, PNG)
                        </p>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-[#004a7c] hover:bg-[#003a61] text-white"
                disabled={isLoading}
            >
                {isLoading ? "Submitting..." : "Submit Report"}
            </Button>
        </form>
    );
} 