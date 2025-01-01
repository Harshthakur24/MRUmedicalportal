'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function VerifyEmailPage() {
    const [isVerifying, setIsVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get('token') || '';

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                toast.error('Invalid verification link');
                setIsVerifying(false);
                return;
            }

            try {
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    throw new Error('Failed to verify email');
                }

                setVerified(true);
                toast.success('Email verified successfully');
                setTimeout(() => router.push('/login'), 2000);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to verify email');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyEmail();
    }, [token, router]);

    const handleResendVerification = async () => {
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: localStorage.getItem('pendingVerificationEmail') }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend verification email');
            }

            toast.success('Verification email sent');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to resend verification email');
        }
    };

    if (isVerifying) {
        return (
            <div className="container max-w-md mx-auto mt-8 p-6 text-center">
                <p>Verifying your email...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-md mx-auto mt-8 p-6 text-center">
            {verified ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
                    <p>Redirecting to login...</p>
                </div>
            ) : (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
                    <p className="mb-4">Unable to verify your email. The link may have expired.</p>
                    <Button onClick={handleResendVerification}>
                        Resend Verification Email
                    </Button>
                </div>
            )}
        </div>
    );
} 