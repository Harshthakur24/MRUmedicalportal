'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Role, School } from '@prisma/client';

type FormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    rollNumber: string;
    department: School;
    class: string;
    year: number;
};

type UserRole = Role;

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<UserRole>('STUDENT');
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormData>({
        mode: 'onBlur',
        defaultValues: {
            department: 'ENGINEERING'
        }
    });

    const password = watch('password');

    const onSubmit = async (data: FormData) => {
        if (data.password !== data.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...data, role }),
            });

            if (response.ok) {
                toast.success('Registration successful!', {
                    description: 'Redirecting to login page...'
                });
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                const error = await response.json();
                toast.error(error.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('An error occurred during registration');
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
                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                type="button"
                                onClick={() => setRole('STUDENT')}
                                className={`px-4 py-2 rounded-md transition-colors ${role === 'STUDENT'
                                    ? 'bg-[#004a7c] text-white'
                                    : 'bg-white text-[#004a7c] border border-[#004a7c]/20 hover:bg-[#004a7c]/10'
                                    }`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('HOD')}
                                className={`px-4 py-2 rounded-md transition-colors ${role === 'HOD'
                                    ? 'bg-[#004a7c] text-white'
                                    : 'bg-white text-[#004a7c] border border-[#004a7c]/20 hover:bg-[#004a7c]/10'
                                    }`}
                            >
                                Admin
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <Input
                                    {...register('name', {
                                        required: 'Name is required',
                                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                                    })}
                                    placeholder="Enter your full name"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Roll Number
                                </label>
                                <Input
                                    {...register('rollNumber')}
                                    placeholder="Enter your roll number"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <Input
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 8, message: 'Password must be at least 8 characters' }
                                    })}
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <Input
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value => value === password || 'Passwords do not match'
                                    })}
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Class
                                </label>
                                <Input
                                    {...register('class', {
                                        required: 'Class is required'
                                    })}
                                    placeholder="Enter your class"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                                {errors.class && (
                                    <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Department
                                </label>
                                <select
                                    {...register('department', {
                                        required: 'Department is required'
                                    })}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c] bg-white"
                                >
                                    <option value="ENGINEERING">School of Engineering</option>
                                    <option value="LAW">School of Law</option>
                                    <option value="SCIENCE">School of Science</option>
                                    <option value="EDUCATION_AND_HUMANITIES">School of Education & Humanities</option>
                                    <option value="MANAGEMENT_AND_COMMERCE">School of Management & Commerce</option>
                                </select>
                                {errors.department && (
                                    <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                                )}
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
                                className="w-full bg-[#004a7c] hover:bg-[#003a61] text-white py-2 rounded-md transition-all duration-300 h-10 hover:scale-105"
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