'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function VerifyForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'verifying' | 'success'>('verifying');
    const [message, setMessage] = useState('Please check your email for the verification link.');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (!token) {
                    setStatus('verifying');
                    setMessage('Please check your email for the verification link.');
                    return;
                }

                const response = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`);
                if (response.ok) {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now log in to your account.');
                }
            } catch (error) {
                // Even if there's an error, keep showing the verification message
                setStatus('verifying');
                setMessage('Please check your email for the verification link.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#004a7c]/10 to-white">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl border-2 border-[#004a7c]/10 hover:shadow-2xl transition-shadow duration-300">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center font-bold text-[#004a7c]">
                                Email Verification
                            </CardTitle>
                            <CardDescription className="text-center">
                                {status === 'verifying' && 'Verify your email address to continue'}
                                {status === 'success' && 'Your email has been verified'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <p className="text-sm text-center text-gray-600">{message}</p>
                            <div className="flex justify-center">
                                <Link href="/auth/login">
                                    <Button
                                        variant={status === 'success' ? 'default' : 'outline'}
                                        className={status === 'success'
                                            ? "w-full bg-gradient-to-r from-[#004a7c] to-[#0056b3] hover:from-[#0056b3] hover:to-[#004a7c] text-white shadow-lg transition-all duration-300"
                                            : "w-full hover:bg-gray-50 transition-colors duration-200"
                                        }
                                    >
                                        {status === 'success' ? 'Go to Login' : 'Back to Login'}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#004a7c]/10 to-white">
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl border-2 border-[#004a7c]/10">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center font-bold text-[#004a7c]">
                                Email Verification
                            </CardTitle>
                            <CardDescription className="text-center">
                                Loading...
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        }>
            <VerifyForm />
        </Suspense>
    );
} 