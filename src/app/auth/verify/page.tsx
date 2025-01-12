'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Mail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const [status, setStatus] = useState<'waiting' | 'verifying' | 'success' | 'error'>('waiting');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                // If no token, we're waiting for user to check their email
                return;
            }

            setStatus('verifying');
            try {
                const response = await fetch('/api/auth/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    throw new Error('Failed to verify email');
                }

                setStatus('success');
                toast.success('Email verified successfully');

                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } catch (error) {
                setStatus('error');
                toast.error('Failed to verify email');
            }
        };

        verifyEmail();
    }, [token, router]);

    if (status === 'waiting') {
        return (
            <div className="min-h-screen flex flex-col bg-[#004a7c]/10">
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center text-[#004a7c]">
                                Check Your Email
                            </CardTitle>
                            <CardDescription className="text-center">
                                We&apos;ve sent a verification link to{' '}
                                <span className="font-medium">{email}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center space-y-4">
                            <Mail className="h-12 w-12 text-[#004a7c] animate-bounce" />
                            <p className="text-center text-sm text-gray-600">
                                Please check your email and click the verification link to complete your registration.
                            </p>
                            <p className="text-center text-sm text-gray-500">
                                Didn&apos;t receive the email? Check your spam folder or{' '}
                                <button
                                    onClick={() => router.refresh()}
                                    className="text-[#004a7c] hover:underline"
                                >
                                    try again
                                </button>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
            <div className="w-full max-w-md">
                <Card className="p-8">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p>
                            {status === 'success'
                                ? "Your email has been verified successfully!"
                                : "Verifying your email..."}
                        </p>
                        <p>
                            {status === 'error'
                                ? "Could not verify your email. Please try again."
                                : ""}
                        </p>
                        <Button
                            onClick={() => router.push('/auth/login')}
                            className="mt-4"
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 