'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';

type FormData = {
    studentName: string;
    rollNumber: string;
    dateOfAbsence: string;
    dateTo: string;
    reason: string;
    doctorName: string;
    doctorAddress: string;
    parentName: string;
    parentContact: string;
    studentContact: string;
    className: string;
    section: string;
    disease: string;
    workingDays: number;
    t1Reexam: boolean;
    t1Subjects?: string;
    t2Reexam: boolean;
    t2Subjects?: string;
};

export default function MedicalReportForm() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit } = useForm<FormData>();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size should be less than 5MB');
                return;
            }
            setFile(file);
        }
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            if (!file) {
                toast.error('Please upload a medical certificate');
                setLoading(false);
                return;
            }

            // Convert file to base64
            const fileBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    try {
                        const base64String = reader.result as string;
                        if (!base64String) {
                            throw new Error('Failed to read file');
                        }
                        const base64Data = base64String.split(',')[1];
                        if (!base64Data) {
                            throw new Error('Invalid file format');
                        }
                        resolve(base64Data);
                    } catch (e) {
                        reject(e);
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
            });

            const requestData = {
                studentName: String(data.studentName || ''),
                rollNumber: String(data.rollNumber || ''),
                dateOfAbsence: String(data.dateOfAbsence || ''),
                dateTo: String(data.dateTo || ''),
                reason: String(data.reason || ''),
                doctorName: String(data.doctorName || ''),
                doctorAddress: String(data.doctorAddress || ''),
                parentName: String(data.parentName || ''),
                parentContact: String(data.parentContact || ''),
                studentContact: String(data.studentContact || ''),
                className: String(data.className || ''),
                section: String(data.section || ''),
                disease: String(data.disease || ''),
                workingDays: Number(data.workingDays) || 0,
                t1Reexam: Boolean(data.t1Reexam),
                t1Subjects: String(data.t1Subjects || ''),
                t2Reexam: Boolean(data.t2Reexam),
                t2Subjects: String(data.t2Subjects || ''),
                medicalCertificate: {
                    data: fileBase64,
                    filename: String(file.name),
                    contentType: String(file.type)
                }
            };

            const response = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to submit report');
            }

            toast.success('Report submitted successfully');
            router.push('/dashboard/reports');
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Student&apos;s Name</Label>
                            <Input
                                {...register('studentName')}
                                required
                                placeholder="Enter your name"
                                defaultValue={session?.user?.name || ''}
                            />
                        </div>
                        <div>
                            <Label>Parent&apos;s Name</Label>
                            <Input
                                {...register('parentName')}
                                required
                                placeholder="Enter parent's name"
                            />
                        </div>

                        <div>
                            <Label>Roll Number</Label>
                            <Input
                                {...register('rollNumber')}
                                required
                                placeholder="Enter your roll number"
                                defaultValue={session?.user?.rollNumber || ''}
                            />
                        </div>
                        <div>
                            <Label>Student Contact</Label>
                            <Input
                                {...register('studentContact')}
                                required
                                placeholder="Enter your contact number"
                                type="tel"
                            />
                        </div>
                        <div>
                            <Label>Parent&apos;s Contact</Label>
                            <Input
                                {...register('parentContact')}
                                required
                                placeholder="Enter parent's contact"
                                type="tel"
                            />
                        </div>
                        <div>
                            <Label>Class</Label>
                            <Input
                                {...register('className')}
                                required
                                placeholder="Enter your class (e.g., CSE)"
                            />
                        </div>
                        <div>
                            <Label>Section</Label>
                            <Input
                                {...register('section')}
                                required
                                placeholder="Enter your section (e.g., A)"
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
                                    {...register('dateOfAbsence')}
                                    type="date"
                                    required
                                />
                            </div>
                            <div>
                                <Label>To Date</Label>
                                <Input
                                    {...register('dateTo')}
                                    type="date"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Working Days Missed</Label>
                            <Input
                                {...register('workingDays', {
                                    valueAsNumber: true,
                                    required: true
                                })}
                                type="number"
                                min="0"
                            />
                        </div>
                        <div>
                            <Label>Disease/Reason</Label>
                            <Textarea
                                {...register('disease')}
                                required
                                placeholder="Describe your medical condition"
                            />
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
                            <Input
                                {...register('doctorName')}
                                required
                                placeholder="Enter doctor's name"
                            />
                        </div>
                        <div>
                            <Label>Address of Doctor/Hospital</Label>
                            <Input
                                {...register('doctorAddress')}
                                required
                                placeholder="Enter hospital/clinic address"
                            />
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
                                    {...register('t1Reexam')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label>Request T1 Re-examination</Label>
                            </div>
                            <Input
                                {...register('t1Subjects')}
                                placeholder="Enter subjects (if requesting re-exam)"
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    {...register('t2Reexam')}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label>Request T2 Re-examination</Label>
                            </div>
                            <Input
                                {...register('t2Subjects')}
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
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="mt-2"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Upload medical certificate (PDF, JPG, PNG, max 5MB)
                        </p>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#004a7c] hover:bg-[#003a61] text-white h-10"
            >
                {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
        </form>
    );
} 