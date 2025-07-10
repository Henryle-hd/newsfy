import { useState, useRef, useCallback } from 'react';
import { Upload, X, ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onUploadSuccess: (result: {
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    originalName?: string;
  }) => void;
  onUploadError?: (error: string) => void;
  onUploadStart?: () => void;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  placeholder?: string;
  previewHeight?: string;
  showPreview?: boolean;
  initialImageUrl?: string;
  variant?: 'default' | 'avatar' | 'banner';
  disabled?: boolean;
}

export default function ImageUpload({
  onUploadSuccess,
  onUploadError,
  onUploadStart,
  maxSizeInMB = 100,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  placeholder = 'Click to upload, drag & drop, or paste an image',
  previewHeight = '200px',
  showPreview = true,
  initialImageUrl = '',
  variant = 'default',
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
    }
    
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }
    
    return null;
  }, [acceptedFormats, maxSizeInMB]);

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onUploadError?.(validationError);
      return;
    }

    setError('');
    setIsUploading(true);
    setUploadSuccess(false);
    onUploadStart?.();

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPreviewUrl(data.url);
        setUploadSuccess(true);
        onUploadSuccess(data);
        
        // Show success state briefly
        setTimeout(() => setUploadSuccess(false), 2000);
      } else {
        const errorMsg = data.error || 'Upload failed';
        setError(errorMsg);
        onUploadError?.(errorMsg);
      }
    } catch (err) {
        console.error('Upload error:', err);
      const errorMsg = 'Upload failed. Please try again.';
      setError(errorMsg);
      onUploadError?.(errorMsg);
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, onUploadSuccess, onUploadError, onUploadStart]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadFile(files[0]);
  }, [uploadFile]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(false);
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [disabled, handleFileSelect]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (disabled) return;
    
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          uploadFile(file);
          break;
        }
      }
    }
  }, [disabled, uploadFile]);

  const removeImage = useCallback(() => {
    if (disabled) return;
    setPreviewUrl('');
    setError('');
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [disabled]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'avatar':
        return {
          container: 'w-32 h-32 rounded-full',
          preview: 'w-32 h-32 rounded-full object-cover',
          dropzone: 'rounded-full border-2',
        };
      case 'banner':
        return {
          container: 'w-full aspect-[3/1]',
          preview: 'w-full h-full object-cover rounded-lg',
          dropzone: 'rounded-lg border-2 min-h-[120px]',
        };
      default:
        return {
          container: 'w-full',
          preview: `w-full object-cover rounded-lg h-auto ${previewHeight}`,
          dropzone: 'rounded-lg border-2 min-h-[200px]',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`relative ${styles.container}`}>
      <input
      title='Upload Image'
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {previewUrl && showPreview ? (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Preview"
            className={styles.preview}
            style={{ height: variant === 'default' ? previewHeight : undefined }}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/10 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex gap-2">
              <button
              title='Change Image'
                onClick={handleClick}
                className="p-2 bg-white  hover:bg-gray-100 rounded-full hover:bg-opacity-30 transition-colors cursor-pointer"
                disabled={disabled}
              >
                <Upload className="w-5 h-5 text-black" />
              </button>
              <button
              title='Change Image'
                onClick={removeImage}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-full hover:bg-opacity-100 transition-colors cursor-pointer"
                disabled={disabled}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Success indicator */}
          {uploadSuccess && (
            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          ref={dropZoneRef}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          tabIndex={0}
          className={`
            ${styles.dropzone}
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 border-dashed'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400 hover:bg-gray-50'}
            transition-all duration-200 ease-in-out
            flex flex-col items-center justify-center p-6 text-center
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          `}
          style={{ height: variant === 'default' ? previewHeight : undefined }}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-full">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-500">
                  {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} up to {maxSizeInMB}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File info */}
      {previewUrl && !error && !isUploading && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Click to change • Drag & drop • Paste from clipboard
        </div>
      )}
    </div>
  );
}