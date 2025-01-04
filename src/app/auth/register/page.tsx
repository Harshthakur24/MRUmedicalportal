'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Role, School } from '@prisma/client';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<Role>('STUDENT');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rollNumber: '',
        department: null as unknown as School,
        class: '',
        year: 0
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'year' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
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
                body: JSON.stringify({ ...formData, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setIsSubmitted(true);
            toast.success('Registration successful!', {
                description: 'Please check your email to verify your account.'
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col bg-[#004a7c]/10">
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center text-[#004a7c]">
                                Verify Your Email
                            </CardTitle>
                            <CardDescription className="text-center">
                                We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-center text-sm text-gray-600">
                                Didn&apos;t receive the email? Check your spam folder or{' '}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-[#004a7c] hover:underline"
                                >
                                    try again
                                </button>
                            </p>
                            <div className="text-center">
                                <Link
                                    href="/auth/login"
                                    className="text-sm text-[#004a7c] hover:underline"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#004a7c]/5 to-[#004a7c]/10">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-3xl bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200">
                    <CardHeader className="space-y-4 pb-6">
                        <CardTitle className="text-3xl font-bold text-center text-[#004a7c]">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-center text-base">
                            Enter your details to register for an account
                        </CardDescription>
                        <Tabs defaultValue="STUDENT" className="w-full" onValueChange={(value) => setRole(value as Role)}>
                            <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100/80 rounded-lg relative overflow-hidden">
                                <div
                                    className="absolute inset-y-1 w-[calc(50%-4px)] bg-[#004a7c] rounded-md transition-all duration-1800 ease-in-out"
                                    style={{
                                        transform: role === 'STUDENT' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))',
                                        boxShadow: '0 2px 4px rgba(0,74,124,0.1)'
                                    }}
                                />
                                <TabsTrigger
                                    value="STUDENT"
                                    className="relative z-10 rounded-md transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:text-gray-600 hover:text-[#004a7c] data-[state=active]:font-medium"
                                >
                                    Student
                                </TabsTrigger>
                                <TabsTrigger
                                    value="HOD"
                                    className="relative z-10 rounded-md transition-all duration-300 data-[state=active]:text-white data-[state=inactive]:text-gray-600 hover:text-[#004a7c] data-[state=active]:font-medium"
                                >
                                    Admin
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="space-y-6 w-full px-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        className="h-11 focus-visible:ring-[#004a7c] hover:border-[#004a7c]/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        className="h-11 focus-visible:ring-[#004a7c] hover:border-[#004a7c]/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="rollNumber" className="text-sm font-medium">Roll Number</Label>
                                    <Input
                                        id="rollNumber"
                                        name="rollNumber"
                                        placeholder="Enter your roll number"
                                        value={formData.rollNumber}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        className="h-11 focus-visible:ring-[#004a7c] hover:border-[#004a7c]/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                                    <Select
                                        name="department"
                                        value={formData.department}
                                        onValueChange={(value) => handleInputChange({
                                            target: { name: 'department', value }
                                        } as React.ChangeEvent<HTMLSelectElement>)}
                                    >
                                        <SelectTrigger className="h-11 focus:ring-[#004a7c] hover:border-[#004a7c]/50 transition-colors">
                                            <SelectValue placeholder="Select your department" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="ENGINEERING" className="hover:bg-[#004a7c]/10 cursor-pointer transition-colors">School of Engineering</SelectItem>
                                            <SelectItem value="LAW" className="hover:bg-[#004a7c]/10 cursor-pointer transition-colors">School of Law</SelectItem>
                                            <SelectItem value="SCIENCE" className="hover:bg-[#004a7c]/10 cursor-pointer transition-colors">School of Science</SelectItem>
                                            <SelectItem value="EDUCATION_AND_HUMANITIES" className="hover:bg-[#004a7c]/10 cursor-pointer transition-colors">School of Education & Humanities</SelectItem>
                                            <SelectItem value="MANAGEMENT_AND_COMMERCE" className="hover:bg-[#004a7c]/10 cursor-pointer transition-colors">School of Management & Commerce</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="class" className="text-sm font-medium">Class</Label>
                                    <Input
                                        id="class"
                                        name="class"
                                        placeholder="Enter your class"
                                        value={formData.class}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        className="h-11 focus-visible:ring-[#004a7c] hover:border-[#004a7c]/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="year" className="text-sm font-medium">Year</Label>
                                    <Select
                                        name="year"
                                        value={formData.year ? formData.year.toString() : ""}
                                        onValueChange={(value) => handleInputChange({
                                            target: { name: 'year', value }
                                        } as React.ChangeEvent<HTMLSelectElement>)}
                                    >
                                        <SelectTrigger className="h-11 focus:ring-[#004a7c] hover:border-[#004a7c]/50 transition-colors">
                                            <SelectValue placeholder="Select your year" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="1" className="hover:bg-[#004a7c]/10 cursor-pointer transition-colors">First Year</SelectItem>
                                            <SelectItem value="2" className="hover:bg-[#004a7c]/10 cursor-pointer transition-colors">Second Year</SelectItem>
                                            <SelectItem value="3" className="hover:bg-[#004a7c]/10 cursor-pointer transition-colors">Third Year</SelectItem>
                                            <SelectItem value="4" className="hover:bg-[#004a7c]/10 cursor-pointer transition-colors">Fourth Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        className="h-11 focus-visible:ring-[#004a7c] hover:border-[#004a7c]/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                        className="h-11 focus-visible:ring-[#004a7c] hover:border-[#004a7c]/50 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <Button
                                    type="submit"
                                    className="w-full bg-[#004a7c] hover:bg-[#004a7c]/90 h-12 text-white text-lg font-medium mt-8"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        'Register'
                                    )}
                                </Button>
                                <div className="text-center text-sm text-gray-600 pt-4">
                                    Already have an account?{' '}
                                    <Link
                                        href="/auth/login"
                                        className="text-[#004a7c] hover:text-[#004a7c]/80 hover:underline font-medium"
                                    >
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 