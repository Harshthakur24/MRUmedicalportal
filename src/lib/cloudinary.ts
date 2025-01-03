import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadFile {
    data: string;
    filename: string;
    contentType: string;
}

export const uploadToCloudinary = async (file: UploadFile): Promise<string> => {
    try {
        const result = await cloudinary.uploader.upload(
            `data:${file.contentType};base64,${file.data}`,
            {
                folder: 'medical-certificates',
                resource_type: 'auto',
                allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
                public_id: `med_cert_${Date.now()}`,
            }
        );
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload file');
    }
};

export default cloudinary; 