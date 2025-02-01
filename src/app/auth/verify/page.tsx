'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
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
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Card className="w-[380px]">
                <CardHeader>
                    <CardTitle>Email Verification</CardTitle>
                    <CardDescription>
                        {status === 'verifying' && 'Verify your email address to continue'}
                        {status === 'success' && 'Your email has been verified'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-gray-500">{message}</p>
                    <div className="flex justify-center">
                        <Link href="/auth/login">
                            <Button variant={status === 'success' ? 'default' : 'outline'}>
                                {status === 'success' ? 'Go to Login' : 'Back to Login'}
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 