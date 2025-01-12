import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(base64Data: string): Promise<string> {
    try {
        // Remove data:image/[type];base64, prefix if present
        const base64String = base64Data.includes('base64,') 
            ? base64Data.split('base64,')[1] 
            : base64Data;

        const result = await cloudinary.uploader.upload(
            `data:image/png;base64,${base64String}`,
            {
                folder: 'medical_certificates',
                resource_type: 'auto'
            }
        );

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload file to cloud storage');
    }
}

export default cloudinary; 