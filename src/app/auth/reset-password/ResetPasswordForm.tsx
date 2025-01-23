'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';

export default function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            toast.success('Password reset successfully!', {
                position: 'top-center',
            });
            router.push('/auth/login');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to reset password', {
                position: 'top-center',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#004a7c]/10 to-white">
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl border-2 border-[#004a7c]/10">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl text-center text-[#004a7c]">
                                    Invalid Reset Link
                                </CardTitle>
                                <CardDescription className="text-center">
                                    This password reset link is invalid or has expired.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    onClick={() => router.push('/auth/forgot-password')}
                                    className="w-full bg-gradient-to-r from-[#004a7c] to-[#0056b3] hover:from-[#0056b3] hover:to-[#004a7c] text-white shadow-lg transition-all duration-300"
                                >
                                    Request New Reset Link
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/auth/login')}
                                    className="w-full"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Login
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl border-2 border-[#004a7c]/10 hover:shadow-2xl transition-shadow duration-300">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center font-bold text-[#004a7c]">
                                Reset Password
                            </CardTitle>
                            <CardDescription className="text-center">
                                Enter your new password below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="New password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="w-full pr-10 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#004a7c] transition-colors duration-200"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            placeholder="Confirm new password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="w-full bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#004a7c] to-[#0056b3] hover:from-[#0056b3] hover:to-[#004a7c] text-white shadow-lg transition-all duration-300 h-10"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Resetting...
                                            </>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/auth/login')}
                                        className="w-full h-10 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Login
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            <Toaster position="top-center" />
        </div>
    );
} 