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
  label?: string;
  showMessage?: boolean;
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
  label,
  showMessage,
}: IDragAndDropFiles) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      getAcceptedFiles({ acceptedFiles });
    },
    [getAcceptedFiles],
  );

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
    <Style.Background>
      {label && <h6>{label}</h6>}

      <Style.DragAndDropZone
        {...getRootProps({ className: 'dropzone' })}
        disabled={loading || disabled}
        width={width}
        height={height}
      >
        <input {...getInputProps()} />

        <Style.Content>
          {loading ? (
            <DotSpinLoading />
          ) : (
            <>
              <ImageComponent
                src={onlyImages ? icon.addImage : icon.addFile}
                width="40px"
                height={onlyImages ? '38px' : '32px'}
                radius="0"
              />
              {showMessage && (
                <Style.ContentMessage>
                  <p className="p3">Clique para selecionar ou arraste e solte aqui.</p>
                  {onlyImages && <p className="p3">Formatos aceitos: JPG, JPEG ou PNG.</p>}
                </Style.ContentMessage>
              )}
            </>
          )}
        </Style.Content>
      </Style.DragAndDropZone>

      {!!error && (
        <Style.ErrorMessage>
          <p className="p3">{error}</p>
        </Style.ErrorMessage>
      )}
    </Style.Background>
  );
};
