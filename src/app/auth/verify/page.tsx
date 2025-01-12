import { Suspense } from 'react';
import VerifyForm from './VerifyForm';

export default function VerifyPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                    </div>
                }
            >
                <VerifyForm />
            </Suspense>
        </div>
    );
} 