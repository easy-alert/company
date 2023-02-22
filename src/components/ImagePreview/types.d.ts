export interface IImagePreview {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  src: any;
  width: string;
  height: string;
  imageCustomName: string;
  imageOriginalName?: string;
  downloadUrl?: string;
  onTrashClick?: () => void;
  maxHeight?: string;
  maxWidth?: string;
}
