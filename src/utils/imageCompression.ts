import imageCompression from 'browser-image-compression';

// Only compress these formats (add BMP if needed)
const compressibleTypes = ['image/jpeg', 'image/png', 'image/webp'];

const maxSizeMB = import.meta.env.VITE_MAX_IMAGE_SIZE_MB;
const maxWidthOrHeight = import.meta.env.VITE_MAX_DIMENSION;

export const compressImageIfNeeded = async (file: File): Promise<File> => {
  // Skip unsupported types including GIF (preserves animations)
  if (!compressibleTypes.includes(file.type)) return file;

  const options = {
    maxSizeMB: parseFloat(maxSizeMB || '1'), // Target size
    maxWidthOrHeight: parseInt(maxWidthOrHeight || '1920', 10), // Limits dimensions
    useWebWorker: true, // Faster compression
    fileType: 'image/webp', // Convert to modern format
    webpQuality: 80, // 80% quality (ideal quality/size tradeoff)
    initialQuality: 0.85, // Higher initial quality for heavy compression
    preserveExif: false, // Strip metadata
    maxIteration: 15, // Faster compression cycles
    exifOrientation: 1, // Maintain correct orientation
  };

  try {
    const compressed = await imageCompression(file, options);

    // Fallback to original if compression yields larger file
    return compressed.size < file.size ? compressed : file;
  } catch (error) {
    console.error('Compression error:', error);

    return file; // Fallback to original
  }
};
