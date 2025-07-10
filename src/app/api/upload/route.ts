// pages/api/upload.ts (or app/api/upload/route.ts for App Router)
import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    // Parse the form data
    // const form = 
    formidable({
      maxFileSize: 100 * 1024 * 1024, // 100MB limit
      filter: ({ mimetype }) => {
        // Allow only images
        return Boolean(mimetype && mimetype.includes('image'));
      },
    });

    const data = await req.formData();
    const file = data.get('image') as unknown as globalThis.File;

    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'No image file provided' 
      }, { status: 400 });
    }

    // Create a temporary file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join(os.tmpdir(), file.name);
    fs.writeFileSync(tempPath, buffer);

    // Upload to Cloudinary
    const result: UploadApiResponse = await cloudinary.uploader.upload(tempPath, {
      folder: 'uploads', // Optional: organize uploads in a folder
      resource_type: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' }, // Resize large images
        { quality: 'auto' }, // Optimize quality
      ],
    });

    // Clean up temporary file
    fs.unlinkSync(tempPath);

    // Just return the image URL - don't save to DB yet
    // The frontend will use this URL when creating the article
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      size: file.size,
      originalName: file.name,
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Upload failed' 
    }, { status: 500 });
  }
}