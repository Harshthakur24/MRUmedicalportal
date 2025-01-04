'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send reset email');
            }

            setIsSubmitted(true);
            toast.success('Password reset link sent to your email');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col bg-[#004a7c]/10">
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center text-[#004a7c]">
                                Check your email
                            </CardTitle>
                            <CardDescription className="text-center">
                                We have sent a password reset link to your email address.
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
        <div className="min-h-screen flex flex-col bg-[#004a7c]/10">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center font-bold text-[#004a7c]">
                            Forgot Password
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#004a7c] hover:bg-[#004a7c]/90 h-10 text-white font-bold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                            <div className="text-center">
                                <Link
                                    href="/auth/login"
                                    className="text-sm text-[#004a7c] hover:underline"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 