import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setIsSubmitted(true);
            toast.success('Password reset link sent to your email!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#004a7c]/10 to-white">
                <div className="flex-1 flex items-center justify-center px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-xl border-2 border-[#004a7c]/10">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl text-center text-[#004a7c]">
                                    Check Your Email
                                </CardTitle>
                                <CardDescription className="text-center">
                                    We have sent a password reset link to your email address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    onClick={() => router.push('/auth/login')}
                                    className="w-full bg-gradient-to-r from-[#004a7c] to-[#0056b3] hover:from-[#0056b3] hover:to-[#004a7c] text-white shadow-lg transition-all duration-300"
                                >
                                    Return to Login
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsSubmitted(false)}
                                    className="w-full"
                                >
                                    Try Another Email
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

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
                                Forgot Password
                            </CardTitle>
                            <CardDescription className="text-center">
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        className="w-full bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-300"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#004a7c] to-[#0056b3] hover:from-[#0056b3] hover:to-[#004a7c] text-white shadow-lg transition-all duration-300"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push('/auth/login')}
                                        className="w-full hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Login
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            <Toaster position="top-center" />
        </div>
    );
} 