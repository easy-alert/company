/* eslint-disable react/no-array-index-key */
// LIBS
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { useEffect, useState } from 'react';
import { Button } from '../../../../components/Buttons/Button';
import { Input } from '../../../../components/Inputs/Input';
import { Modal } from '../../../../components/Modal';
import { EventTag } from '../EventTag';
import { Image } from '../../../../components/Image';
import { DotLoading } from '../../../../components/Loadings/DotLoading';

// STYLES
import * as Style from './styles';
import { icon } from '../../../../assets/icons';

// TYPES
import { IFileAndImage, IModalMaintenanceReport } from './utils/types';
import { IconButton } from '../../../../components/Buttons/IconButton';
import { uploadFile } from '../../../../utils/functions';

export const ModalMaintenanceReport = ({
  setModal,
  selectedMaintenanceId,
}: IModalMaintenanceReport) => {
  const [files, setFiles] = useState<IFileAndImage[]>([]);
  const [onFileQuery, setOnFileQuery] = useState<boolean>(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    disabled: onFileQuery,
  });

  const [images, setImages] = useState<IFileAndImage[]>([]);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const {
    acceptedFiles: acceptedImages,
    getRootProps: getRootPropsImages,
    getInputProps: getInputPropsImages,
  } = useDropzone({
    multiple: false,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    disabled: onImageQuery,
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const uploadAcceptedFiles = async () => {
        setOnFileQuery(true);

        const { Location: fileUrl, originalname: originalName } = await uploadFile(
          acceptedFiles[0],
        );

        setFiles((prevState) => {
          let newState = [...prevState];
          newState = [...newState, { name: originalName, url: fileUrl }];
          return newState;
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

        const { Location: fileUrl, originalname: originalName } = await uploadFile(
          acceptedImages[0],
        );

        setImages((prevState) => {
          let newState = [...prevState];
          newState = [...newState, { name: originalName, url: fileUrl }];
          return newState;
        });
        setOnImageQuery(false);
      };

      uploadAcceptedImages();
    }
  }, [acceptedImages]);

  return (
    <Modal title="Detalhes de manutenção" setModal={setModal}>
      <Style.Container>
        <h3>{selectedMaintenanceId}</h3>
        <Style.StatusTagWrapper>
          {/* if pra se for feita em atraso, mostrar o concluída */}
          <EventTag status="Concluída" />
          <EventTag status="Feita em atraso" />
        </Style.StatusTagWrapper>
        <Style.Content>
          <Style.Row>
            <h6>Categoria</h6>
            <p className="p2">Sistemas Hidrossanitários</p>
          </Style.Row>
          <Style.Row>
            <h6>Elemento</h6>
            <p className="p2">Tubulações</p>
          </Style.Row>
          <Style.Row>
            <h6>Responsável</h6>
            <p className="p2">Equipe de manutenção local</p>
          </Style.Row>
          <Style.Row>
            <h6>Atividade</h6>
            <p className="p2">
              Verificar as tubulações de água potável e servida para detectar obstruções, falhas,
              entupimentos e problemas de fixação. Reconstruir a sua integridade, se necessário.
            </p>
          </Style.Row>
          <Style.Row>
            <h6>Prazo da manutenção</h6>
            <p className="p2">20/01/2023</p>
          </Style.Row>
          <Style.Row>
            <Input label="Observações" placeholder="Digite aqui" maxLength={50} />
          </Style.Row>
          <Style.Row disabled={onFileQuery}>
            <h6>Anexar</h6>
            <Style.DragAndDropZoneFile {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />

              <Style.DragAndDropFileContent>
                <Image img={icon.addFile} width="60px" height="48px" radius="0" />
                <p className="p2">Clique ou arraste para enviar seu arquivo.</p>
              </Style.DragAndDropFileContent>
            </Style.DragAndDropZoneFile>

            <Style.FileAndImageRow>
              {files.map((e, i: number) => (
                <Style.Tag title={e.name} key={i}>
                  <p className="p3">{e.name}</p>
                  <IconButton
                    size="16px"
                    icon={icon.xBlack}
                    onClick={() => {
                      setFiles((prevState) => {
                        const newState = [...prevState];
                        newState.splice(i, 1);
                        return newState;
                      });
                    }}
                  />
                </Style.Tag>
              ))}
              {onFileQuery && (
                <Style.FileLoadingTag>
                  <DotLoading />
                </Style.FileLoadingTag>
              )}
            </Style.FileAndImageRow>
          </Style.Row>
          <Style.Row disabled={onImageQuery}>
            <h6>Imagens</h6>

            <Style.FileAndImageRow>
              {images.map((e, i: number) => (
                <Style.ImageTag key={i}>
                  <img src={e.url} alt="" />
                  <p title={e.name} className="p6">
                    {e.name}
                  </p>
                  <Style.IconButtonHover>
                    <IconButton
                      icon={icon.trashWithBg}
                      onClick={() => {
                        setImages((prevState) => {
                          const newState = [...prevState];
                          newState.splice(i, 1);
                          return newState;
                        });
                      }}
                    />
                  </Style.IconButtonHover>
                </Style.ImageTag>
              ))}

              {onImageQuery && (
                <Style.ImageLoadingTag>
                  <DotLoading />
                </Style.ImageLoadingTag>
              )}

              <Style.DragAndDropZoneImage {...getRootPropsImages({ className: 'dropzone' })}>
                <input {...getInputPropsImages()} />
                <Image img={icon.addImage} width="50px" height="48px" radius="0" />
              </Style.DragAndDropZoneImage>
            </Style.FileAndImageRow>
          </Style.Row>
        </Style.Content>
        <Button label="Enviar relato" center disable={onFileQuery || onImageQuery} />
      </Style.Container>
    </Modal>
  );
};
