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
import { IFiles, IModalMaintenanceInfo } from './utils/types';
import { IconButton } from '../../../../components/Buttons/IconButton';
import { uploadFile } from '../../../../utils/functions';

export const ModalMaintenanceInfo = ({
  setModal,
  selectedMaintenanceId,
}: IModalMaintenanceInfo) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
  });

  const [onFileQuery, setOnFileQuery] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [files, setFiles] = useState<IFiles[]>([]);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const upload = async () => {
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

      upload();
    }
  }, [acceptedFiles]);

  return (
    <Modal title="Detalhes de manutenção" setModal={setModal}>
      <Style.Container>
        <h3>{selectedMaintenanceId}</h3>
        <Style.TagWrapper>
          {/* if pra se for feita em atraso, mostrar o concluída */}
          <EventTag status="Concluída" />
          <EventTag status="Feita em atraso" />
        </Style.TagWrapper>
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
          <Style.Row>
            <h6>Anexar</h6>
            <Style.DragAndDropZone
              {...getRootProps({ className: 'dropzone' })}
              onFileQuery={onFileQuery}
            >
              <input {...getInputProps()} />

              <Style.DragAndDropContent>
                <Image img={icon.addFile} width="60px" height="48px" radius="0" />
                <p className="p2">Clique ou arraste para enviar seu arquivo.</p>
              </Style.DragAndDropContent>
            </Style.DragAndDropZone>

            <Style.FileRow>
              {files.map((e, i: number) => (
                // eslint-disable-next-line react/no-array-index-key
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
                <Style.LoadingTag>
                  <DotLoading />
                </Style.LoadingTag>
              )}
            </Style.FileRow>
          </Style.Row>
          <Style.Row>
            <h6>Imagens</h6>
            <p className="p2">2</p>
          </Style.Row>
        </Style.Content>
        <Button label="Enviar relato" center disable={onFileQuery} />
      </Style.Container>
    </Modal>
  );
};
