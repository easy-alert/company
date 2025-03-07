import { useEffect, useState } from 'react';

// SERVICES
import { getChecklists } from '@services/apis/getChecklists';
import { deleteChecklist } from '@services/apis/deleteChecklist';
import { putChecklist } from '@services/apis/putChecklist';

// GLOBAL COMPONENTS
import { DragAndDropFiles } from '@components/DragAndDropFiles';
import { Button } from '@components/Buttons/Button';
import { ImagePreview } from '@components/ImagePreview';
import { Modal } from '@components/Modal';
import { InputCheckbox } from '@components/Inputs/InputCheckbox';
import { LoadingWrapper } from '@components/Loadings/LoadingWrapper';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { DotLoading } from '@components/Loadings/DotLoading';
import { InputRadio } from '@components/Inputs/InputRadio';
import UserResponsible from '@components/UserResponsible';

// GLOBAL UTILS
import { uploadManyFiles } from '@utils/functions';

// GLOBAL TYPES
import { IChecklist, TChecklistStatus } from '@customTypes/IChecklist';

// STYLES
import * as Style from './styles';

import type { TModalNames } from '..';

interface ModalSendReportProps {
  checklistId: string;
  buildingId?: string;
  handleModals: (modal: TModalNames, modalState: boolean) => void;
  handleRefresh: () => void;
}

type TDeleteMode = 'this' | 'all' | 'thisAndFollowing' | '';

export const ModalChecklistDetails = ({
  checklistId,
  buildingId,
  handleModals,
  handleRefresh,
}: ModalSendReportProps) => {
  const [checklistDetails, setChecklistDetails] = useState<IChecklist>({});

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
    setChecklistDetails((prev) => {
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

  const handleUpdateChecklist = async (status: TChecklistStatus) => {
    setLoading(true);

    try {
      await putChecklist({
        checklistId,
        checklistItems: checklistDetails.checklistItem!,
        status,
        images: uploadedFiles,
      });

      handleRefresh();
    } finally {
      setLoading(false);
      handleModals('modalChecklistDetails', false);
    }
  };

  useEffect(() => {
    setLoading(true);

    const handleGetChecklist = async () => {
      try {
        const responseData = await getChecklists({ checklistId });

        setChecklistDetails(responseData[0]);
        setUploadedFiles(
          (responseData[0]?.images || []).filter((image) => image.url !== undefined) as {
            url: string;
            name: string;
          }[],
        );
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
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

    if (checklistDetails.frequency === 0) {
      inputs.splice(1, 2);
    }

    const handleRadioChange = (value: TDeleteMode) => {
      setDeleteMode(value);
    };

    const handleDeleteChecklist = async () => {
      setLoading(true);

      try {
        await deleteChecklist({ checklistId, deleteMode });

        handleRefresh();
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
      deleteButton={checklistDetails?.status !== 'completed'}
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
            <Style.ChecklistTitle>{checklistDetails?.name}</Style.ChecklistTitle>

            <Style.ProgressBarContainer>
              <Style.ProgressBar>
                <Style.ProgressPercentageText>
                  {`${Math.floor(
                    ((checklistDetails?.checklistItem?.filter((item) => item.status === 'completed')
                      .length || 0) /
                      (checklistDetails?.checklistItem?.length || 1)) *
                      100,
                  )}%`}
                </Style.ProgressPercentageText>

                <Style.Progress
                  style={{
                    width: `${
                      ((checklistDetails?.checklistItem?.filter(
                        (item) => item.status === 'completed',
                      ).length || 0) /
                        (checklistDetails?.checklistItem?.length || 1)) *
                      100
                    }%`,
                  }}
                />
              </Style.ProgressBar>

              <Style.ProgressText>
                {`${
                  checklistDetails?.checklistItem?.filter((item) => item.status === 'completed')
                    .length
                } / ${checklistDetails?.checklistItem?.length} itens concluídos`}
              </Style.ProgressText>
            </Style.ProgressBarContainer>

            <Style.ChecklistItemContainer>
              {checklistDetails?.checklistItem?.map((item) => (
                <Style.ChecklistItem key={item.id}>
                  <InputCheckbox
                    checked={item.status === 'completed'}
                    disable={checklistDetails?.status === 'completed'}
                    onChange={() => handleChangeChecklistItem(item.id!)}
                  />
                  <p>{item.name}</p>
                </Style.ChecklistItem>
              ))}

              <h6>{checklistDetails?.description}</h6>
            </Style.ChecklistItemContainer>
          </Style.ChecklistContainer>

          {checklistDetails?.user && <UserResponsible user={checklistDetails.user} />}

          <h3>Imagens</h3>

          <Style.Row>
            <Style.FileAndImageRow>
              {checklistDetails.status !== 'completed' && (
                <DragAndDropFiles
                  width="96px"
                  height="96px"
                  onlyImages
                  getAcceptedFiles={handleAcceptedFiles}
                  disabled={onImageQuery}
                />
              )}

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
                      if (onImageQuery) return;

                      if (checklistDetails?.status === 'completed') return;

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
            {checklistDetails?.status !== 'completed' ? (
              <>
                <Button
                  label={
                    checklistDetails?.status === 'inProgress'
                      ? 'Parar execução'
                      : 'Iniciar checklist'
                  }
                  bgColor="transparent"
                  onClick={() =>
                    handleUpdateChecklist(
                      checklistDetails?.status === 'inProgress' ? 'pending' : 'inProgress',
                    )
                  }
                />
                <Button
                  label="Salvar"
                  bgColor="transparent"
                  onClick={() => handleUpdateChecklist(checklistDetails.status!)}
                />
                <Button
                  label="Finalizar checklist"
                  onClick={() => handleUpdateChecklist('completed')}
                />
              </>
            ) : (
              <Button
                label="Fechar"
                center
                onClick={() => handleModals('modalChecklistDetails', false)}
              />
            )}
          </Style.ContainerBtn>
        </Style.Content>
      )}
    </Modal>
  );
};
