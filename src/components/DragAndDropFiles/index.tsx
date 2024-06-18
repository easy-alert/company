import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as Style from './styles';
import { icon } from '../../assets/icons';
import { ImageComponent } from '../ImageComponent';
import { DotSpinLoading } from '../Loadings/DotSpinLoading';

interface IDragAndDropFiles {
  loading?: boolean;
  disabled?: boolean;
  getAcceptedFiles: ({ acceptedFiles }: { acceptedFiles: File[] }) => void;
  onlyImages?: boolean;
  multiple?: boolean;
  error?: any;
  width?: string;
  height?: string;
}

export const DragAndDropFiles = ({
  getAcceptedFiles,
  disabled = false,
  loading = false,
  onlyImages = false,
  multiple = true,
  error,
  width,
  height,
}: IDragAndDropFiles) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    getAcceptedFiles({ acceptedFiles });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    disabled: loading || disabled,
    multiple,
    onDrop,
    accept: onlyImages
      ? {
          'image/png': ['.png'],
          'image/jpg': ['.jpg'],
          'image/jpeg': ['.jpeg'],
          'audio/flac': ['.flac'], // Colocado isso pro celular abrir as opções de camera corretamente.
        }
      : undefined,
  });

  return (
    <>
      <Style.DragAndDropZone
        {...getRootProps({ className: 'dropzone' })}
        width={width}
        height={height}
      >
        <input {...getInputProps()} />

        <Style.Content>
          {loading ? (
            <DotSpinLoading />
          ) : (
            <ImageComponent
              src={onlyImages ? icon.addImage : icon.addFile}
              width={onlyImages ? '48px' : '60px'}
              height={onlyImages ? '46px' : '48px'}
              radius="0"
            />
          )}
        </Style.Content>
      </Style.DragAndDropZone>
      {!!error && (
        <Style.ErrorMessage>
          <p className="p3">{error}</p>
        </Style.ErrorMessage>
      )}
    </>
  );
};
