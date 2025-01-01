'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rollNumber: '',
        department: '',
        year: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate form data
            if (!formData.name || !formData.email || !formData.password ||
                !formData.rollNumber || !formData.department || !formData.year) {
                toast.error('All fields are required');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Registration successful! Please login.');
                router.push('/login');
            } else {
                toast.error(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Something went wrong during registration');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen flex flex-col">

            {/* Registration Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold text-[#004a7c]">Create Account</CardTitle>
                        <CardDescription className="text-gray-600">
                            Enter your details to register for an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="name">
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    placeholder="Enter your full name"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="rollNumber">
                                    Student ID
                                </label>
                                <Input
                                    id="rollNumber"
                                    placeholder="Enter your student ID"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    value={formData.rollNumber}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="department">
                                    Department
                                </label>
                                <Input
                                    id="department"
                                    placeholder="Enter your department"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="year">
                                    Year
                                </label>
                                <Input
                                    id="year"
                                    type="number"
                                    placeholder="Enter your year"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    value={formData.year}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="terms"
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
                                className="w-full bg-[#004a7c] hover:bg-[#003a61] text-white py-2 rounded-md transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/login" className="text-[#004a7c] hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 