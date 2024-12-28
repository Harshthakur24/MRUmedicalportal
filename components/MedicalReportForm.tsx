'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { uploadToStorage } from '@/lib/storage';

export default function MedicalReportForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<{
        medicalCertificate?: File;
        opdIpdSlip?: File;
        dischargeSlip?: File;
        otherReports: File[];
    }>({
        otherReports: [],
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Upload files first
            const medicalCertificateUrl = files.medicalCertificate
                ? await uploadToStorage(files.medicalCertificate)
                : '';

            const opdIpdSlipUrl = files.opdIpdSlip
                ? await uploadToStorage(files.opdIpdSlip)
                : '';

            const dischargeSlipUrl = files.dischargeSlip
                ? await uploadToStorage(files.dischargeSlip)
                : '';

            const otherReportUrls = await Promise.all(
                files.otherReports.map(file => uploadToStorage(file))
            );

            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parentName: formData.get('parentName'),
                    class: formData.get('class'),
                    section: formData.get('section'),
                    disease: formData.get('disease'),
                    doctorName: formData.get('doctorName'),
                    doctorAddress: formData.get('doctorAddress'),
                    dateFrom: formData.get('dateFrom'),
                    dateTo: formData.get('dateTo'),
                    workingDays: parseInt(formData.get('workingDays') as string),
                    t1Reexam: formData.get('t1Reexam') === 'yes',
                    t1Subjects: formData.get('t1Subjects'),
                    t2Reexam: formData.get('t2Reexam') === 'yes',
                    t2Subjects: formData.get('t2Subjects'),
                    studentContact: formData.get('studentContact'),
                    parentContact: formData.get('parentContact'),
                    medicalCertificate: medicalCertificateUrl,
                    opdIpdSlip: opdIpdSlipUrl,
                    dischargeSlip: dischargeSlipUrl,
                    otherReports: otherReportUrls,
                }),
            });

            if (response.ok) {
                toast.success('Medical report submitted successfully');
                router.push('/dashboard');
            } else {
                const data = await response.json();
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('Failed to submit medical report');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-center">Medical Report Submission</h2>

            {/* Student Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Parent&apos;s Name</label>
                    <input
                        type="text"
                        name="parentName"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                {/* Add all other form fields similarly */}

                {/* File Uploads */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Medical Certificate</label>
                    <input
                        type="file"
                        required
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setFiles(prev => ({ ...prev, medicalCertificate: file }));
                            }
                        }}
                        className="mt-1 block w-full"
                    />
                </div>

                {/* Add other file upload fields similarly */}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {isLoading ? 'Submitting...' : 'Submit Report'}
            </button>
        </form>
    );
} 