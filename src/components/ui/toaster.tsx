import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
    return (
        <HotToaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
                // Default options for all toasts
                className: '',
                duration: 5000,
                style: {
                    background: '#363636',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                },
                // Custom success toast styling
                success: {
                    style: {
                        background: '#059669',
                    },
                },
                // Custom error toast styling
                error: {
                    style: {
                        background: '#dc2626',
                    },
                },
            }}
        />
    );
} 