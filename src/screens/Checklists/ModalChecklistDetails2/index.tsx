import { useEffect, useState } from 'react';

// SERVICES
import { getChecklists } from '@services/apis/getChecklists';

// GLOBAL COMPONENTS
import { DragAndDropFiles } from '@components/DragAndDropFiles';
import { Button } from '@components/Buttons/Button';
import { ImagePreview } from '@components/ImagePreview';
import { Modal } from '@components/Modal';
import { Image } from '@components/Image';
import { InputCheckbox } from '@components/Inputs/InputCheckbox';
import { LoadingWrapper } from '@components/Loadings/LoadingWrapper';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { DotLoading } from '@components/Loadings/DotLoading';

// GLOBAL UTILS
import { uploadManyFiles } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// GLOBAL TYPES
import { IChecklist } from '@customTypes/IChecklist';

// STYLES
import { InputRadio } from '@components/Inputs/InputRadio';
import { deleteChecklist } from '@services/apis/deleteCheclkist';
import * as Style from './styles';

interface ModalSendReportProps {
  buildingId: string;
  checklistId: string;
  handleModals: (modal: string, modalState: boolean) => void;
}

type TDeleteMode = 'this' | 'all' | 'thisAndFollowing' | '';

export const ModalChecklistDetails2 = ({
  buildingId,
  checklistId,
  handleModals,
}: ModalSendReportProps) => {
  const [checklist, setChecklist] = useState<IChecklist>({});

  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const [imagesToUploadCount, setImagesToUploadCount] = useState<number>(0);

  const [modalDeleteButton, setModalDeleteButton] = useState(false);

  const [deleteMode, setDeleteMode] = useState<TDeleteMode>('');

  const [loading, setLoading] = useState<boolean>(false);

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

  const handleChangeChecklistItem = (id: string) => {
    setChecklist((prev) => {
      const newState = { ...prev };

      if (!newState.checklistItem) {
        return newState;
      }

      const itemIndex = newState.checklistItem.findIndex((item) => item.id === id);

      newState.checklistItem[itemIndex].status =
        newState.checklistItem[itemIndex].status === 'completed' ? 'pending' : 'completed';

      return newState;
    });
  };

  useEffect(() => {
    setLoading(true);

    const handleGetChecklist = async () => {
      try {
        const responseData = await getChecklists({ buildingId, checklistId });

        setChecklist(responseData[0]);
      } finally {
        setLoading(false);
      }
    };

    if (checklistId) {
      handleGetChecklist();
    }
  }, [buildingId, checklistId]);

  if (modalDeleteButton) {
    const inputs = [
      { id: '1', name: 'mode', value: 'this', label: 'Este checklist' },
      { id: '2', name: 'mode', value: 'thisAndFollowing', label: 'Este e os checklists seguintes' },
      { id: '3', name: 'mode', value: 'all', label: 'Todos os checklists' },
    ];

    const handleRadioChange = (value: TDeleteMode) => {
      setDeleteMode(value);
    };

    const handleDeleteChecklist = async () => {
      setLoading(true);

      try {
        await deleteChecklist({ checklistId, deleteMode });
      } finally {
        setLoading(false);
        handleModals('modalChecklistDetails', false);
      }
    };

    return (
      <Modal
        title="Excluir checklist"
        setModal={(modalState) => handleModals('modalChecklistDetails', modalState)}
      >
        {loading ? (
          <LoadingWrapper minHeight="300px">
            <DotSpinLoading />
          </LoadingWrapper>
        ) : (
          <Style.Content>
            <Style.DeleteCheckboxContainer>
              {inputs.map((input) => (
                <InputRadio
                  id={input.id}
                  key={input.value}
                  value={input.value}
                  name={input.name}
                  label={input.label}
                  checked={deleteMode === input.value}
                  onChange={(evt) => handleRadioChange(evt.target.value as TDeleteMode)}
                />
              ))}
            </Style.DeleteCheckboxContainer>

            <Style.ContainerBtn>
              <Button
                label="Cancelar"
                bgColor="transparent"
                textColor="actionBlue"
                loading={loading}
                onClick={() => setModalDeleteButton(false)}
              />
              <Button label="Excluir" loading={loading} onClick={handleDeleteChecklist} />
            </Style.ContainerBtn>
          </Style.Content>
        )}
      </Modal>
    );
  }

  return (
    <Modal
      title="Enviar relato"
      deleteButton
      setModal={(modalState) => handleModals('modalChecklistDetails', modalState)}
      handleDelete={(modalState) => setModalDeleteButton(modalState)}
    >
      {loading ? (
        <LoadingWrapper minHeight="300px">
          <DotSpinLoading />
        </LoadingWrapper>
      ) : (
        <Style.Content>
          <h3>Plaza Milano</h3>

          <Style.ChecklistContainer>
            <Style.ChecklistTitle>{checklist.name}</Style.ChecklistTitle>

            <Style.ProgressBarContainer>
              <Style.ProgressBar>
                <Style.ProgressText>
                  {`${Math.floor(
                    ((checklist?.checklistItem?.filter((item) => item.status === 'completed')
                      .length || 0) /
                      (checklist?.checklistItem?.length || 1)) *
                      100,
                  )}%`}
                </Style.ProgressText>

                <Style.Progress
                  style={{
                    width: `${
                      ((checklist?.checklistItem?.filter((item) => item.status === 'completed')
                        .length || 0) /
                        (checklist?.checklistItem?.length || 1)) *
                      100
                    }%`,
                  }}
                />
              </Style.ProgressBar>

              <Style.ProgressText>
                {`${
                  checklist?.checklistItem?.filter((item) => item.status === 'completed').length
                } / ${checklist?.checklistItem?.length} itens concluídos`}
              </Style.ProgressText>
            </Style.ProgressBarContainer>

            <Style.ChecklistItemContainer>
              {checklist?.checklistItem?.map((item) => (
                <Style.ChecklistItem key={item.id}>
                  <InputCheckbox onChange={() => handleChangeChecklistItem(item.id!)} />
                  <p>{item.name}</p>
                </Style.ChecklistItem>
              ))}
            </Style.ChecklistItemContainer>
          </Style.ChecklistContainer>

          <Style.UserResponsibleContainer>
            <h3>Usuário Responsável</h3>

            <Style.UserResponsibleContent>
              <Style.UserResponsibleImageContent>
                <Image img={checklist.user?.image || icon.download} size="64px" />
              </Style.UserResponsibleImageContent>

              <Style.UserResponsibleData>
                <Style.UserResponsibleDataRow>
                  <p>Usuário</p>
                  <span>{checklist.user?.name}</span>
                </Style.UserResponsibleDataRow>

                <Style.UserResponsibleDataRow>
                  <p>Email</p>
                  <span>{checklist.user?.email}</span>
                </Style.UserResponsibleDataRow>
              </Style.UserResponsibleData>
            </Style.UserResponsibleContent>
          </Style.UserResponsibleContainer>

          <h3>Imagens</h3>

          <Style.Row>
            <Style.FileAndImageRow>
              <DragAndDropFiles
                width="96px"
                height="96px"
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
                    width="96px"
                    height="96px"
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
            <Button label="Finalizar checklist" />
          </Style.ContainerBtn>
        </Style.Content>
      )}
    </Modal>
  );
};
