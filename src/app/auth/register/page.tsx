'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    department: string;
    year: string;
    rollNumber: string;
    className: string;
    studentContact?: string;
    parentName?: string;
    parentContact?: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        year: '',
        rollNumber: '',
        className: '',
        studentContact: '',
        parentName: '',
        parentContact: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.department ||
            !formData.year || !formData.rollNumber || !formData.className) {
            toast.error('Please fill in all required fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            toast.success('Registration successful! Please verify your email.');
            // Redirect to verify page with email parameter
            router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);

        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#004a7c]/10">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center text-[#004a7c]">
                            Student Registration
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your details to create an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department *</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) => handleSelectChange('department', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CSE">Computer Science</SelectItem>
                                            <SelectItem value="ECE">Electronics</SelectItem>
                                            <SelectItem value="MECH">Mechanical</SelectItem>
                                            <SelectItem value="CIVIL">Civil</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Year *</Label>
                                    <Select
                                        value={formData.year}
                                        onValueChange={(value) => handleSelectChange('year', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">First Year</SelectItem>
                                            <SelectItem value="2">Second Year</SelectItem>
                                            <SelectItem value="3">Third Year</SelectItem>
                                            <SelectItem value="4">Fourth Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rollNumber">Roll Number *</Label>
                                    <Input
                                        id="rollNumber"
                                        name="rollNumber"
                                        value={formData.rollNumber}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="className">Class/Section *</Label>
                                    <Input
                                        id="className"
                                        name="className"
                                        value={formData.className}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="studentContact">Student Contact</Label>
                                    <Input
                                        id="studentContact"
                                        name="studentContact"
                                        value={formData.studentContact}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parentName">Parent Name</Label>
                                    <Input
                                        id="parentName"
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parentContact">Parent Contact</Label>
                                    <Input
                                        id="parentContact"
                                        name="parentContact"
                                        value={formData.parentContact}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#004a7c] hover:bg-[#004a7c]/90 h-10 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    'Register'
                                )}
                            </Button>

                            <div className="text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="text-[#004a7c] hover:underline">
                                    Login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 