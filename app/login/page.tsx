'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                remember: rememberMe,
                redirect: false,
            });

            if (res?.error) {
                toast.error("Invalid credentials");
                setIsLoading(false);
                return;
            }

            toast.success("Logged in successfully");

            // Redirect based on user role
            const user = await fetch('/api/auth/me').then(res => res.json());

            if (user.role === 'HOD') {
                router.push('/hod');
            } else if (user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/'); // Default route for students
            }

            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold text-[#004a7c]">Welcome Back</CardTitle>
                        <CardDescription className="text-gray-600">
                            Sign in to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-[#004a7c] focus:ring-[#004a7c]"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <Link href="/forgot-password" className="text-sm text-[#004a7c] hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#004a7c] hover:bg-[#003a61] text-white py-2 rounded-md transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-[#004a7c] hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 