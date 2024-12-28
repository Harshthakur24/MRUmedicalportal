'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="min-h-screen flex flex-col">


            {/* Login Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold text-[#004a7c]">Welcome Back</CardTitle>
                        <CardDescription className="text-gray-600">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="email">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="password">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        className="h-4 w-4 rounded border-gray-300 text-[#004a7c] focus:ring-[#004a7c]"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-[#004a7c] hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Button
                                className="w-full bg-[#004a7c] hover:bg-[#003a61] text-white py-2 rounded-md transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
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
    )
} 