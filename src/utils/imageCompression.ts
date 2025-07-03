import imageCompression from 'browser-image-compression';

// Only compress these formats (add BMP if needed)
const compressibleTypes = ['image/jpeg', 'image/png', 'image/webp'];

const maxSizeMB = import.meta.env.VITE_MAX_IMAGE_SIZE_MB;
const maxWidthOrHeight = import.meta.env.VITE_MAX_DIMENSION;

// Type for browser-image-compression options (not exported by the lib)
type ImageCompressionOptions = {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
  webpQuality?: number;
  initialQuality?: number;
  preserveExif?: boolean;
  maxIteration?: number;
  exifOrientation?: number;
  [key: string]: any;
};

export const compressImageIfNeeded = async (
  file: File,
  optionsOverride: Partial<ImageCompressionOptions> = {},
): Promise<File> => {
  // Skip unsupported types including GIF (preserves animations)
  if (!compressibleTypes.includes(file.type)) return file;

  // If the file is webp, convert to png (or jpeg if you prefer)
  const shouldConvertWebp = file.type === 'image/webp';
  const outputType = shouldConvertWebp ? 'image/png' : optionsOverride.fileType || file.type;

  const options: ImageCompressionOptions = {
    maxSizeMB: parseFloat(maxSizeMB || '1'),
    maxWidthOrHeight: parseInt(maxWidthOrHeight || '1920', 10),
    useWebWorker: true,
    fileType: outputType,
    webpQuality: 80,
    initialQuality: 0.85,
    preserveExif: false,
    maxIteration: 15,
    exifOrientation: 1,
    ...optionsOverride,
  };

  try {
    const compressed = await imageCompression(file, options);
    if (compressed.size < file.size) {
      // Use the correct extension for the new file type
      let newName = file.name;
      if (shouldConvertWebp) {
        newName = file.name.replace(/\.webp$/i, '.png');
      }
      return new File([compressed], newName, { type: compressed.type });
    }
    return file;
  } catch (error) {
    console.error('Compression error:', error);
    return file;
  }
};
