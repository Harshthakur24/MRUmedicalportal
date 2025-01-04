'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                return;
            }

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
            } catch (error) {
                setStatus('error');
                toast.error('Failed to verify email');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex flex-col bg-[#004a7c]/10">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center text-[#004a7c]">
                            {status === 'loading' && 'Verifying Email'}
                            {status === 'success' && 'Email Verified'}
                            {status === 'error' && 'Verification Failed'}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {status === 'loading' && 'Please wait while we verify your email address...'}
                            {status === 'success' && 'Your email has been successfully verified.'}
                            {status === 'error' && 'We could not verify your email address.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        {status === 'loading' && (
                            <Loader2 className="h-12 w-12 animate-spin text-[#004a7c]" />
                        )}
                        {status === 'success' && (
                            <>
                                <CheckCircle className="h-12 w-12 text-green-500" />
                                <Button
                                    onClick={() => router.push('/auth/login')}
                                    className="w-full bg-[#004a7c] hover:bg-[#004a7c]/90"
                                >
                                    Continue to Login
                                </Button>
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <XCircle className="h-12 w-12 text-red-500" />
                                <Button
                                    onClick={() => router.push('/auth/login')}
                                    className="w-full bg-[#004a7c] hover:bg-[#004a7c]/90"
                                >
                                    Back to Login
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 