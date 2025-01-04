'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Role } from '@prisma/client';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<Role>('STUDENT');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                role,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid credentials');
                return;
            }

            toast.success('Login Successful!', {
                description: 'Redirecting to dashboard...'
            });

            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (error) {
            toast.error('An error occurred during login');
        } finally {
            setIsLoading(false);
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
                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                type="button"
                                onClick={() => setRole('STUDENT')}
                                className={`px-4 py-2 rounded-md transition-colors ${role === 'STUDENT'
                                    ? 'bg-[#004a7c] text-white'
                                    : 'bg-white text-[#004a7c] border border-[#004a7c]/20 hover:bg-[#004a7c]/10'
                                    }`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('HOD')}
                                className={`px-4 py-2 rounded-md transition-colors ${role === 'HOD'
                                    ? 'bg-[#004a7c] text-white'
                                    : 'bg-white text-[#004a7c] border border-[#004a7c]/20 hover:bg-[#004a7c]/10'
                                    }`}
                            >
                                Admin
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    autoComplete="email"
                                    className="border-[#004a7c]/20 focus:border-[#004a7c] focus:ring-[#004a7c]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
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
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
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