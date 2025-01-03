'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FormData = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register, handleSubmit } = useForm<FormData>();
    const [rememberMe, setRememberMe] = useState(false);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error);
                return;
            }

            toast.success('Login successful!');
            router.push('/submit-report');
            router.refresh();
        } catch (error) {
            toast.error('Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#004a7c]/10">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center text-[#004a7c]">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    {...register('email')}
                                    placeholder="Email"
                                    required
                                    disabled={loading}
                                    className="border-[#004a7c]/20 focus:border-[#004a7c] focus:ring-[#004a7c]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    {...register('password')}
                                    placeholder="Password"
                                    required
                                    disabled={loading}
                                    className="border-[#004a7c]/20 focus:border-[#004a7c] focus:ring-[#004a7c]"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="rounded border-[#004a7c]/20 text-[#004a7c] focus:ring-[#004a7c]"
                                    />
                                    <label htmlFor="remember" className="text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-[#004a7c] hover:text-[#004a7c]/80 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#004a7c] hover:bg-[#004a7c]/90 h-10 text-white"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                            <div className="mt-4 text-center text-sm text-gray-600">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/auth/register"
                                    className="text-[#004a7c] hover:text-[#004a7c]/80 hover:underline"
                                >
                                    Register
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 