import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    try {
        const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
        console.log('Sending verification email:', { email, confirmLink });

        const result = await resend.emails.send({
            from: 'MRU Medical Portal <onboarding@resend.dev>',
            to: email,
            subject: 'Verify your email address',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; margin-bottom: 20px;">Verify your email address</h2>
                    <p style="color: #666; margin-bottom: 20px;">Click the button below to verify your email address and complete your registration.</p>
                    <a href="${confirmLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
                    <p style="color: #999; margin-top: 20px; font-size: 12px;">If you didn't request this email, you can safely ignore it.</p>
                </div>
            `
        });

        console.log('Verification email sent:', result);
        return result;
    } catch (error) {
        console.error('Failed to send verification email:', error);
        throw error;
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    try {
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
        console.log('Sending password reset email:', { email, resetLink });

        const result = await resend.emails.send({
            from: 'MRU Medical Portal <onboarding@resend.dev>',
            to: email,
            subject: 'Reset your password',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; margin-bottom: 20px;">Reset your password</h2>
                    <p style="color: #666; margin-bottom: 20px;">Click the button below to reset your password.</p>
                    <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
                    <p style="color: #999; margin-top: 20px; font-size: 12px;">This link will expire in 1 hour.</p>
                    <p style="color: #999; font-size: 12px;">If you didn't request this email, you can safely ignore it.</p>
                </div>
            `
        });

        console.log('Password reset email sent:', result);
        return result;
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
    }
}; 