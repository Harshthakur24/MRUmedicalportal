import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL is not defined');
}

const ADMIN_EMAIL = 'thakur2004harsh@gmail.com';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    try {
        const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
        console.log('Sending verification email:', { email, confirmLink });

        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ADMIN_EMAIL,
            subject: `Verify email for ${email}`,
            html: `
                <h2>Verify email for ${email}</h2>
                <p>Click the link below to verify the email address:</p>
                <a href="${confirmLink}">${confirmLink}</a>
                <p>User email: ${email}</p>
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
            from: 'onboarding@resend.dev',
            to: ADMIN_EMAIL,
            subject: `Password reset for ${email}`,
            html: `
                <h2>Password reset for ${email}</h2>
                <p>Click the link below to reset the password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>User email: ${email}</p>
                <p>This link will expire in 1 hour.</p>
            `
        });

        console.log('Password reset email sent:', result);
        return result;
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
    }
}; 