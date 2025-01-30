'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { Upload, X, Loader2, FileText } from 'lucide-react';

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
                if (responseData.error?.includes('timed out')) {
                    throw new Error('File upload timed out. Please try with a smaller file or better connection.');
                }
                throw new Error(responseData.error || 'Failed to submit report');
            }

            toast.success('Medical report submitted successfully!', {
                style: {
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                position: 'top-center',
                duration: 3000,
            });

            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit report', {
                style: {
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
                position: 'top-center',
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                                    <Label>Request Semester 1 Re-examination</Label>
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
                                    <Label>Request Semester 2 Re-examination</Label>
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
                        <div className="w-full">
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={`group w-full min-h-[200px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 
                                        ${file
                                            ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                                            : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                                        } hover:border-[#004a7c] hover:shadow-lg transform hover:scale-[1.01]`}
                                >
                                    {!file ? (
                                        <div className="space-y-4 text-center">
                                            <div className="transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2 transition-colors group-hover:text-[#004a7c]" />
                                            </div>
                                            <div className="animate-fade-in">
                                                <p className="text-base text-gray-600">
                                                    <span className="font-semibold text-[#004a7c] group-hover:underline">
                                                        Click to upload
                                                    </span>
                                                    {" "}or drag and drop
                                                </p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    PDF, JPG, PNG (max 5MB)
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full animate-fade-in-up">
                                            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-blue-50 rounded-lg transform transition-transform duration-300 group-hover:rotate-6">
                                                        <FileText className="h-8 w-8 text-[#004a7c]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-medium text-gray-700 truncate max-w-[200px]">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setFile(null);
                                                    }}
                                                    className="p-2 hover:bg-red-50 rounded-full transition-colors duration-300 group"
                                                >
                                                    <X className="h-6 w-6 text-gray-400 group-hover:text-red-500 transform transition-transform duration-300 group-hover:rotate-90" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </label>
                                {fileError && (
                                    <div className="mt-2 text-sm text-red-500 flex items-center space-x-2 animate-fade-in">
                                        <svg
                                            className="h-4 w-4 animate-pulse"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{fileError}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#004a7c] hover:bg-[#003a61] text-white h-12 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:shadow-lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <FileText className="h-5 w-5" />
                            <span>Submit Report</span>
                        </>
                    )}
                </Button>
            </form>

            <div id="toast-container" className="fixed top-4 right-4 z-[9999]">
                <Toaster
                    position="top-center"
                    toastOptions={{
                        className: '',
                        style: {
                            background: '#fff',
                            color: '#333',
                            border: '1px solid #e2e8f0',
                            padding: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        },
                    }}
                />
            </div>
        </>
    );
} 