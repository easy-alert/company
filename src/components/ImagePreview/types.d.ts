export interface IImagePreview {
  src: string;
  width: string;
  height: string;
  imageCustomName: string;
  imageOriginalName?: string;
  downloadUrl?: string;
  onTrashClick?: () => void;
  maxHeight?: string;
  maxWidth?: string;
}
