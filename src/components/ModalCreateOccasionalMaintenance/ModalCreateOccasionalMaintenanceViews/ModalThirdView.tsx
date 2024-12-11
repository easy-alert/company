// REACT
import { useEffect, useState } from 'react';

// LIBS
import { useDropzone } from 'react-dropzone';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { Image } from '@components/Image';
import { IconButton } from '@components/Buttons/IconButton';
import { DotLoading } from '@components/Loadings/DotLoading';

// GLOBAL UTILS
import { applyMask, uploadManyFiles } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// STYLES
import { Input } from '@components/Inputs/Input';
import { ImagePreview } from '@components/ImagePreview';
import * as Style from '../styles';

// TYPES
import type { IModalThirdView } from '../types';

function ModalThirdView({
  occasionalMaintenanceData,
  handleOccasionalMaintenanceDataChange,
  handleSetView,
  handleCreateOccasionalMaintenance,
}: IModalThirdView) {
  const [onFileQuery, setOnFileQuery] = useState<boolean>(false);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    disabled: onFileQuery || occasionalMaintenanceData.inProgress,
  });

  const {
    acceptedFiles: acceptedImages,
    getRootProps: getRootPropsImages,
    getInputProps: getInputPropsImages,
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'audio/flac': ['.flac'], // Colocado isso pro celular abrir as opções de camera corretamente.
    },
    disabled: onImageQuery || occasionalMaintenanceData.inProgress,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const uploadAcceptedFiles = async () => {
        setOnFileQuery(true);

        const formattedFiles = [...occasionalMaintenanceData.reportData.files];

        const uploadedFiles = await uploadManyFiles(acceptedFiles);

        uploadedFiles.forEach((file) => {
          formattedFiles.push({
            name: file.originalname,
            originalName: file.originalname,
            url: file.Location,
          });
        });

        handleOccasionalMaintenanceDataChange({
          primaryKey: 'reportData',
          secondaryKey: 'files',
          value: formattedFiles,
        });

        setOnFileQuery(false);
      };

      uploadAcceptedFiles();
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (acceptedImages.length > 0) {
      const uploadAcceptedImages = async () => {
        setOnImageQuery(true);

        const uploadedImages = await uploadManyFiles(acceptedImages);

        const formattedImages = [...occasionalMaintenanceData.reportData.images];

        uploadedImages.forEach((file) => {
          formattedImages.push({
            name: file.originalname,
            originalName: file.originalname,
            url: file.Location,
          });
        });

        handleOccasionalMaintenanceDataChange({
          primaryKey: 'reportData',
          secondaryKey: 'images',
          value: formattedImages,
        });

        setOnImageQuery(false);
      };

      uploadAcceptedImages();
    }
  }, [acceptedImages]);

  return (
    <>
      <Input
        label="Custo"
        placeholder="Ex: R$ 100,00"
        maxLength={20}
        value={occasionalMaintenanceData.reportData.cost}
        onChange={(e) => {
          handleOccasionalMaintenanceDataChange({
            primaryKey: 'reportData',
            value: applyMask({ mask: 'BRL', value: e.target.value }).value,
            secondaryKey: 'cost',
          });
        }}
      />

      <Style.Row disabled={onFileQuery}>
        <h6>Anexar</h6>
        <Style.FileRow>
          <Style.DragAndDropZoneFile {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />

            <Image img={icon.addFile} width="40px" height="32px" radius="0" />
          </Style.DragAndDropZoneFile>

          {(occasionalMaintenanceData.reportData.files.length > 0 || onFileQuery) && (
            <Style.FileAndImageRow>
              {occasionalMaintenanceData.reportData.files.map((file, i: number) => (
                <Style.Tag title={file.name} key={file.originalName}>
                  <p className="p3">{file.name}</p>
                  <IconButton
                    size="16px"
                    icon={icon.xBlack}
                    onClick={() => {
                      handleOccasionalMaintenanceDataChange({
                        primaryKey: 'reportData',
                        secondaryKey: 'files',
                        value: occasionalMaintenanceData.reportData.files.filter(
                          (_, index) => index !== i,
                        ),
                      });
                    }}
                  />
                </Style.Tag>
              ))}

              {onFileQuery &&
                acceptedFiles.map((file) => (
                  <Style.FileLoadingTag key={file.name}>
                    <DotLoading />
                  </Style.FileLoadingTag>
                ))}
            </Style.FileAndImageRow>
          )}
        </Style.FileRow>
      </Style.Row>

      <Style.Row disabled={onImageQuery}>
        <h6>Imagens</h6>

        <Style.FileAndImageRow>
          <Style.DragAndDropZoneImage {...getRootPropsImages({ className: 'dropzone' })}>
            <input {...getInputPropsImages()} />
            <Image img={icon.addImage} width="40px" height="38px" radius="0" />
          </Style.DragAndDropZoneImage>

          {occasionalMaintenanceData.reportData.images.map((image, i: number) => (
            <ImagePreview
              key={image.originalName}
              width="97px"
              height="97px"
              imageCustomName={image.name}
              src={image.url}
              onTrashClick={() => {
                handleOccasionalMaintenanceDataChange({
                  primaryKey: 'reportData',
                  secondaryKey: 'images',
                  value: occasionalMaintenanceData.reportData.images.filter(
                    (_, index) => index !== i,
                  ),
                });
              }}
            />
          ))}

          {onImageQuery &&
            acceptedImages.map((e) => (
              <Style.ImageLoadingTag key={e.name}>
                <DotLoading />
              </Style.ImageLoadingTag>
            ))}
        </Style.FileAndImageRow>
      </Style.Row>

      <Style.ButtonContainer>
        <Button
          label="Voltar"
          bgColor="transparent"
          textColor="actionBlue"
          onClick={() => handleSetView(2)}
        />

        <Button
          label="Finalizar manutenção"
          disable={onFileQuery || onImageQuery}
          onClick={() =>
            handleCreateOccasionalMaintenance({ occasionalMaintenanceType: 'finished' })
          }
        />
      </Style.ButtonContainer>
    </>
  );
}

export default ModalThirdView;
