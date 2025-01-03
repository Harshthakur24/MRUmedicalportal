'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    rollNumber: string;
    department: string;
    year: number;
};

export default function Register() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register, handleSubmit } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        if (data.password !== data.confirmPassword) {
            toast.error('Password Mismatch', {
                description: "The passwords you entered don't match. Please try again.",
                duration: 3000
            });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to register');
            }

            toast.success('Registration Successful!', {
                description: "Your account has been created. Redirecting to login page...",
                duration: 3000
            });

            setTimeout(() => {
                router.push('/auth/login');
            }, 1500);
        } catch (error) {
            toast.error('Registration Failed', {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again later.",
                duration: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#004a7c]/10">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold text-[#004a7c]">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Enter your details to register for an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <Input
                                    {...register('name')}
                                    placeholder="Enter your full name"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input
                                    {...register('email')}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Student ID
                                </label>
                                <Input
                                    {...register('rollNumber')}
                                    placeholder="Enter your student ID"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Input
                                    {...register('password')}
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <Input
                                    {...register('confirmPassword')}
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Department
                                </label>
                                <Input
                                    {...register('department')}
                                    placeholder="Enter your department"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Year
                                </label>
                                <Input
                                    {...register('year', { valueAsNumber: true })}
                                    type="number"
                                    placeholder="Enter your year"
                                    min="1"
                                    max="4"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="h-4 w-4 rounded border-gray-300 text-[#004a7c] focus:ring-[#004a7c]"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-[#004a7c] hover:underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-[#004a7c] hover:underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#004a7c] hover:bg-[#003a61] text-white py-2 rounded-md transition-colors h-10"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </Button>

                            <div className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-[#004a7c] hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 