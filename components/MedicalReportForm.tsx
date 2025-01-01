'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MedicalReportForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

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
            router.push('/my-reports');
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Absence</label>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm text-gray-500">From</label>
                            <Input
                                type="date"
                                name="dateFrom"
                                required
                                className="mt-1"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-gray-500">To</label>
                            <Input
                                type="date"
                                name="dateTo"
                                required
                                className="mt-1"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Disease/Reason</label>
                    <Textarea
                        name="reason"
                        required
                        className="mt-1"
                        placeholder="Describe your medical condition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Doctor Details</label>
                    <Input
                        name="doctorName"
                        required
                        className="mt-1"
                        placeholder="Doctor's Name"
                    />
                    <Input
                        name="doctorAddress"
                        required
                        className="mt-1"
                        placeholder="Hospital/Clinic Address"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
                    <Input
                        type="file"
                        name="files"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="mt-1"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Upload medical certificate and other relevant documents (PDF, JPG, PNG)
                    </p>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? 'Submitting...' : 'Submit Report'}
            </Button>
        </form>
    );
} 