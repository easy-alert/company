import { useState } from 'react';

// GLOBAL COMPONENTS
import { DragAndDropFiles } from '@components/DragAndDropFiles';
import { Button } from '@components/Buttons/Button';
import { ImagePreview } from '@components/ImagePreview';
import { Modal } from '@components/Modal';
import { DotLoading } from '@components/Loadings/DotLoading';

// GLOBAL UTILS
import { uploadManyFiles } from '@utils/functions';

// STYLES
import { Content } from '../styles';
import * as Style from './styles';

interface ModalSendReportProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  checklist: { title: string; tasks: { id: string; task: string }[] };
}

export const ModalSendReport = ({ setModal, checklist }: ModalSendReportProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const [imagesToUploadCount, setImagesToUploadCount] = useState<number>(0);

  const handleAcceptedFiles = async ({ acceptedFiles }: { acceptedFiles: File[] }) => {
    setImagesToUploadCount(acceptedFiles.length);
    setOnImageQuery(true);

    try {
      const uploadedFilesResponse = await uploadManyFiles(acceptedFiles);
      const formattedUploadedFiles = uploadedFilesResponse.map(({ Location, originalname }) => ({
        name: originalname,
        url: Location,
      }));

      setUploadedFiles((prev) => [...prev, ...formattedUploadedFiles]);
    } catch (error) {
      // Tratamento de erro
    } finally {
      setOnImageQuery(false);
      setImagesToUploadCount(0);
    }
  };

  return (
    <Modal setModal={setModal} title="Enviar relato">
      <Content>
        <h3>Plaza Milano</h3>
        <p>
          <strong>Presidente</strong>
        </p>

        {checklist && (
          <div>
            <h4>{checklist.title}</h4>
            <ul>
              {checklist.tasks.map(({ id, task }) => (
                <li key={id}>{task}</li>
              ))}
            </ul>
          </div>
        )}

        <Style.InputText>
          <p className="p3">Responsável</p>
          <input type="text" />
        </Style.InputText>

        <p>
          <strong>Imagens</strong>
        </p>
        <Style.Row>
          <Style.FileAndImageRow>
            <DragAndDropFiles
              width="132px"
              height="136px"
              onlyImages
              getAcceptedFiles={handleAcceptedFiles}
              disabled={onImageQuery}
            />
            {uploadedFiles.length > 0 &&
              uploadedFiles.map((image, index) => (
                <ImagePreview
                  key={image.url}
                  src={image.url}
                  downloadUrl={image.url}
                  imageCustomName={image.name}
                  width="132px"
                  height="136px"
                  onTrashClick={() => {
                    setUploadedFiles((prev) => {
                      const newState = [...prev];
                      newState.splice(index, 1);
                      return newState;
                    });
                  }}
                />
              ))}
            {onImageQuery &&
              [...Array(imagesToUploadCount).keys()].map((e) => (
                <Style.ImageLoadingTag key={e}>
                  <DotLoading />
                </Style.ImageLoadingTag>
              ))}
          </Style.FileAndImageRow>
        </Style.Row>

        <Style.ContainerBtn>
          <Button label="Iniciar execução" bgColor="transparent" textColor="actionBlue" />
          <Button label="Salvar" bgColor="transparent" textColor="actionBlue" />
          <Button label="Finalizar manutenção" />
        </Style.ContainerBtn>
      </Content>
    </Modal>
  );
};
