'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/request-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setEmail('');
            } else {
                toast.error(data.error || 'Failed to process request');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while processing your request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-md mx-auto mt-8 p-6">
            <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </form>
        </div>
    );
} 