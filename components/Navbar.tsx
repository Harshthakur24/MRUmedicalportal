'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Error logging out');
        }
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-gray-800">
                            Medical Reports Portal
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {status === 'loading' ? (
                            <div>Loading...</div>
                        ) : session ? (
                            <>
                                <span className="text-gray-600">
                                    Welcome, {session.user.name}
                                </span>
                                <Link
                                    href="/submit-report"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Submit Report
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 