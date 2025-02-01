import nodemailer from 'nodemailer';

if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error('Gmail credentials are not defined in environment variables');
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('NEXT_PUBLIC_APP_URL is not defined');
}

// Create reusable transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Verify SMTP connection configuration
transporter.verify((error: Error | null) => {
    if (error) {
        console.error('SMTP connection error:', error);
        console.log('\nTo fix this error:');
        console.log('1. Go to https://myaccount.google.com/security');
        console.log('2. Enable 2-Step Verification if not already enabled');
        console.log('3. Go to Security -> 2-Step Verification -> App passwords');
        console.log('4. Generate a new App Password for "Mail" and "Other (Custom name)"');
        console.log('5. Use that 16-character App Password in your .env file for GMAIL_PASS\n');
    } else {
        console.log('SMTP server is ready to send emails');
    }
});

export async function sendVerificationEmail(email: string, token: string) {
    if (!token) {
        throw new Error('Verification token is required');
    }

    try {
        const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;
        console.log('Preparing verification email:', { email, token, confirmLink });

        const mailOptions = {
            from: `"MRU Medical Portal" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Verify your email address',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; margin-bottom: 20px;">Verify your email address</h2>
                    <p style="color: #666; margin-bottom: 20px;">Click the button below to verify your email address and complete your registration.</p>
                    <a href="${confirmLink}" 
                       style="background-color: #004a7c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Verify Email
                    </a>
                    <p style="color: #666; margin-top: 20px;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="color: #666; word-break: break-all;">
                        ${confirmLink}
                    </p>
                    <p style="color: #999; margin-top: 20px; font-size: 12px;">
                        If you didn't request this email, you can safely ignore it.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        return info;
    } catch (error: any) {
        console.error('Failed to send verification email:', error);
        if (error.code === 'EAUTH') {
            throw new Error('Email configuration error: Please check Gmail App Password setup');
        }
        throw error;
    }
}

export async function sendPasswordResetEmail(email: string, token: string) {
    if (!token) {
        throw new Error('Reset token is required');
    }

    try {
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
        console.log('Preparing password reset email:', { email, token, resetLink });

        const mailOptions = {
            from: `"MRU Medical Portal" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Reset your password',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; margin-bottom: 20px;">Reset your password</h2>
                    <p style="color: #666; margin-bottom: 20px;">Click the button below to reset your password.</p>
                    <a href="${resetLink}" 
                       style="background-color: #004a7c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Reset Password
                    </a>
                    <p style="color: #666; margin-top: 20px;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="color: #666; word-break: break-all;">
                        ${resetLink}
                    </p>
                    <p style="color: #999; margin-top: 20px; font-size: 12px;">
                        This link will expire in 24 hours.
                    </p>
                    <p style="color: #999; font-size: 12px;">
                        If you didn't request this email, you can safely ignore it.
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
    }
} 