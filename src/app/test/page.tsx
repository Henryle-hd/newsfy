"use client"
import ImageUpload from '@/components/ImageUpload';

export default function TestPage() {
  const handleUploadSuccess = (result: {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    originalName?: string;
  }) => {
    alert(`Uploaded image URL: ${result.url}`);
  };

  return (
    <div className="container mx-auto p-4 mt-20 max-w-xl h-full">
      <ImageUpload 
        onUploadSuccess={handleUploadSuccess}
        maxSizeInMB={5}
        placeholder="Upload test image here"
        // variant='avatar'
        previewHeight='400px'
      />
    </div>
  );
}