'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
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
    doctorName: string;
    doctorAddress: string;
    parentName: string;
    parentContact: string;
    studentContact: string;
    className: string;
    disease: string;
    workingDays: number;
    t1Reexam: boolean;
    t1Subjects?: string;
    t2Reexam: boolean;
    t2Subjects?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export default function MedicalReportForm() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit } = useForm<FormData>();
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string>('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFileError('');

        if (!selectedFile) {
            setFile(null);
            return;
        }

        // Validate file size
        if (selectedFile.size > MAX_FILE_SIZE) {
            setFileError('File size should be less than 5MB');
            setFile(null);
            return;
        }

        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
            setFileError('Only PDF, JPG, and PNG files are allowed');
            setFile(null);
            return;
        }

        setFile(selectedFile);
    };

    const onSubmit = async (data: FormData) => {
        if (!file) {
            setFileError('Please upload a medical certificate');
            return;
        }

        setLoading(true);
        try {
            // Convert file to base64
            const fileBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const base64String = reader.result as string;
                    const base64Data = base64String.split(',')[1];
                    if (!base64Data) {
                        reject(new Error('Failed to convert file to base64'));
                        return;
                    }
                    resolve(base64Data);
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
            });

            const requestData = {
                studentName: data.studentName || session?.user?.name || '',
                rollNumber: data.rollNumber || session?.user?.rollNumber || '',
                dateOfAbsence: data.dateOfAbsence,
                dateTo: data.dateTo,
                doctorName: data.doctorName,
                doctorAddress: data.doctorAddress,
                parentName: data.parentName,
                parentContact: data.parentContact,
                studentContact: data.studentContact,
                className: data.className,
                disease: data.disease,
                workingDays: Number(data.workingDays),
                t1Reexam: Boolean(data.t1Reexam),
                t1Subjects: data.t1Subjects || '',
                t2Reexam: Boolean(data.t2Reexam),
                t2Subjects: data.t2Subjects || '',
                medicalCertificate: {
                    data: fileBase64,
                    filename: file.name,
                    contentType: file.type
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
            router.push('/dashboard');
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
                            <Label>Parent&apos;s Contact</Label>
                            <Input
                                {...register('parentContact')}
                                required
                                placeholder="Enter parent's contact"
                                type="tel"
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
                            <Label>Class & Section</Label>
                            <Input
                                {...register('className')}
                                required
                                placeholder="Enter your class (e.g., CSE-4C)"
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
                        {fileError && (
                            <p className="text-sm text-red-500 mt-1">{fileError}</p>
                        )}
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
            <Toaster position="top-center" />
        </form>
    );
} 