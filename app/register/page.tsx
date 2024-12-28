'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="min-h-screen flex flex-col">

            {/* Registration Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-[#004a7c]/10">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold text-[#004a7c]">Create Account</CardTitle>
                        <CardDescription className="text-gray-600">
                            Enter your details to register for an account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="firstName">
                                        First Name
                                    </label>
                                    <Input
                                        id="firstName"
                                        placeholder="First Name"
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="lastName">
                                        Last Name
                                    </label>
                                    <Input
                                        id="lastName"
                                        placeholder="Last Name"
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                    />
                                </div>
                            </div>
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
                                <label className="text-sm font-medium text-gray-700" htmlFor="studentId">
                                    Student ID
                                </label>
                                <Input
                                    id="studentId"
                                    placeholder="Enter your student ID"
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
                                    placeholder="Create a password"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#004a7c]"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="h-4 w-4 rounded border-gray-300 text-[#004a7c] focus:ring-[#004a7c]"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-[#004a7c] hover:underline">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-[#004a7c] hover:underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                            <Button
                                className="w-full bg-[#004a7c] hover:bg-[#003a61] text-white py-2 rounded-md transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                            <div className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/login" className="text-[#004a7c] hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 