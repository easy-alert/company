import { useEffect, useState } from 'react';

// SERVICES
import { getChecklists } from '@services/apis/getChecklists';
import { putChecklist } from '@services/apis/putChecklist';

// GLOBAL COMPONENTS
import { DragAndDropFiles } from '@components/DragAndDropFiles';
import { Button } from '@components/Buttons/Button';
import { ImagePreview } from '@components/ImagePreview';
import { Modal } from '@components/Modal';
import { LoadingWrapper } from '@components/Loadings/LoadingWrapper';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { DotLoading } from '@components/Loadings/DotLoading';
import { TextArea } from '@components/Inputs/TextArea';
import { IconButton } from '@components/Buttons/IconButton';
import UserResponsible from '@components/UserResponsible';

// GLOBAL UTILS
import { uploadManyFiles } from '@utils/functions';

// GLOBAL ASSETS
import IconCheckRound from '@assets/icons/IconCheckRound';
import IconErrorRound from '@assets/icons/IconErrorRound';

// GLOBAL TYPES
import { IChecklist, TChecklistItemStatus, TChecklistStatus } from '@customTypes/IChecklist';

// STYLES
import * as Style from './styles';

// TYPES
import type { TModalNames } from '..';

interface ModalSendReportProps {
  checklistId: string;
  handleModals: (modal: TModalNames, modalState: boolean) => void;
  handleRefresh: () => void;
}

// type TDeleteMode = 'this' | 'all' | 'thisAndFollowing' | '';

export const ModalChecklistDetails = ({
  checklistId,
  handleModals,
  handleRefresh,
}: ModalSendReportProps) => {
  const [checklistDetails, setChecklistDetails] = useState<IChecklist>({});

  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; name: string }[]>([]);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const [imagesToUploadCount, setImagesToUploadCount] = useState<number>(0);

  // const [modalDeleteButton, setModalDeleteButton] = useState(false);
  // const [deleteMode, setDeleteMode] = useState<TDeleteMode>('');

  const [loading, setLoading] = useState<boolean>(false);

  const checklistCompleted = checklistDetails?.status === 'completed';

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
      console.error('Erro ao fazer upload das imagens:', error);
      // Tratamento de erro
    } finally {
      setOnImageQuery(false);
      setImagesToUploadCount(0);
    }
  };
  const handleChangeChecklistItem = (id: string, status: TChecklistItemStatus) => {
    setChecklistDetails((prev) => {
      const newState = { ...prev };

      if (!newState.checklistItem) {
        return newState;
      }

      const itemIndex = newState.checklistItem.findIndex((item) => item.id === id);

      if (itemIndex === -1) {
        return newState;
      }

      newState.checklistItem[itemIndex].status = status;

      return newState;
    });
  };

  const handleUpdateChecklist = async (status: TChecklistStatus) => {
    setLoading(true);

    try {
      await putChecklist({
        checklistId,
        checklistItems: checklistDetails.checklistItem!,
        observation: checklistDetails.observation,
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
  }, [checklistId]);

  // if (modalDeleteButton) {
  //   const inputs = [
  //     { id: '1', name: 'mode', value: 'this', label: 'Este checklist' },
  //     { id: '2', name: 'mode', value: 'thisAndFollowing', label: 'Este e os checklists seguintes' },
  //     { id: '3', name: 'mode', value: 'all', label: 'Todos os checklists' },
  //   ];

  //   if (checklistDetails.frequency === 0) {
  //     inputs.splice(1, 2);
  //   }

  //   const handleRadioChange = (value: TDeleteMode) => {
  //     setDeleteMode(value);
  //   };

  //   const handleDeleteChecklist = async () => {
  //     setLoading(true);

  //     try {
  //       await deleteChecklist({ checklistId, deleteMode });

  //       handleRefresh();
  //     } finally {
  //       setLoading(false);
  //       handleModals('modalChecklistDetails', false);
  //     }
  //   };

  //   return (
  //     <Modal
  //       title="Excluir checklist"
  //       setModal={(modalState) => handleModals('modalChecklistDetails', modalState)}
  //     >
  //       {loading ? (
  //         <LoadingWrapper minHeight="300px">
  //           <DotSpinLoading />
  //         </LoadingWrapper>
  //       ) : (
  //         <Style.Content>
  //           <Style.DeleteCheckboxContainer>
  //             {inputs.map((input) => (
  //               <InputRadio
  //                 id={input.id}
  //                 key={input.value}
  //                 value={input.value}
  //                 name={input.name}
  //                 label={input.label}
  //                 checked={deleteMode === input.value}
  //                 onChange={(evt) => handleRadioChange(evt.target.value as TDeleteMode)}
  //               />
  //             ))}
  //           </Style.DeleteCheckboxContainer>

  //           <Style.ContainerBtn>
  //             <Button
  //               label="Cancelar"
  //               bgColor="transparent"
  //               loading={loading}
  //               onClick={() => setModalDeleteButton(false)}
  //             />
  //             <Button
  //               label="Excluir"
  //               loading={loading}
  //               onClick={handleDeleteChecklist}
  //               bgColor="primary"
  //             />
  //           </Style.ContainerBtn>
  //         </Style.Content>
  //       )}
  //     </Modal>
  //   );
  // }

  return (
    <Modal
      title="Enviar relato"
      setModal={(modalState) => handleModals('modalChecklistDetails', modalState)}
      // deleteButton={checklistDetails?.status !== 'completed'}
      // handleDelete={(modalState) => setModalDeleteButton(modalState)}
    >
      {loading ? (
        <LoadingWrapper minHeight="300px">
          <DotSpinLoading />
        </LoadingWrapper>
      ) : (
        <Style.Content>
          <h3>{checklistDetails.building?.name}</h3>

          <Style.ChecklistContainer>
            <Style.ChecklistTitle>{checklistDetails?.name}</Style.ChecklistTitle>

            <Style.ProgressBarContainer>
              <Style.ProgressBar>
                <Style.ProgressPercentageText>
                  {`${Math.floor(
                    ((checklistDetails?.checklistItem?.filter(
                      (item) => item.status === 'approved' || item.status === 'rejected',
                    ).length || 0) /
                      (checklistDetails?.checklistItem?.length || 1)) *
                      100,
                  )}%`}
                </Style.ProgressPercentageText>

                <Style.Progress
                  style={{
                    width: `${
                      ((checklistDetails?.checklistItem?.filter(
                        (item) => item.status === 'approved' || item.status === 'rejected',
                      ).length || 0) /
                        (checklistDetails?.checklistItem?.length || 1)) *
                      100
                    }%`,
                  }}
                />
              </Style.ProgressBar>

              <Style.ProgressText>
                {`${
                  checklistDetails?.checklistItem?.filter(
                    (item) => item.status === 'approved' || item.status === 'rejected',
                  ).length
                } / ${checklistDetails?.checklistItem?.length} itens concluídos`}
              </Style.ProgressText>
            </Style.ProgressBarContainer>

            <Style.ChecklistItemContainer>
              {checklistDetails?.checklistItem?.map((item) => (
                <Style.ChecklistItem key={item.id}>
                  <p style={{ width: '100%' }}>{item.name}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <IconButton
                      icon={
                        <IconErrorRound
                          strokeColor={item.status === 'rejected' ? 'dismissed' : 'gray'}
                          size="24px"
                        />
                      }
                      disabled={checklistCompleted}
                      onClick={() => handleChangeChecklistItem(item.id!, 'rejected')}
                    />

                    <IconButton
                      icon={
                        <IconCheckRound
                          strokeColor={item.status === 'approved' ? 'completed' : 'gray'}
                          size="24px"
                        />
                      }
                      disabled={checklistCompleted}
                      onClick={() => handleChangeChecklistItem(item.id!, 'approved')}
                    />
                  </div>
                </Style.ChecklistItem>
              ))}
            </Style.ChecklistItemContainer>

            <Style.ChecklistObservationContainer>
              <TextArea
                name="observation"
                label="Observações"
                placeholder="Escreva aqui suas observações"
                value={checklistDetails.observation}
                permToCheck="checklist:update"
                disabled={checklistCompleted}
                onChange={(evt) =>
                  setChecklistDetails((prev) => ({ ...prev, observation: evt.target.value }))
                }
              />
            </Style.ChecklistObservationContainer>
          </Style.ChecklistContainer>

          <UserResponsible
            title={
              (checklistDetails?.checklistUsers?.length ?? 0) > 1
                ? 'Usuários responsáveis'
                : 'Usuário responsável'
            }
            users={checklistDetails?.checklistUsers}
          />

          {checklistDetails.status === 'completed' && checklistDetails?.finishedBy && (
            <UserResponsible title="Concluído por" users={[checklistDetails.finishedBy]} />
          )}

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

                      if (checklistCompleted) return;

                      setUploadedFiles((prev) => {
                        const newState = [...prev];
                        newState.splice(index, 1);
                        return newState;
                      });
                    }}
                  />
                ))}

              {uploadedFiles.length === 0 && (
                <p style={{ width: '100%' }}>
                  {checklistDetails.status === 'completed' && 'Nenhuma imagem enviada'}
                </p>
              )}

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
                <div>
                  <Button
                    label={
                      checklistDetails?.status === 'inProgress'
                        ? 'Parar execução'
                        : 'Iniciar checklist'
                    }
                    borderless
                    textColor="actionBlue"
                    bgColor="transparent"
                    permToCheck="checklist:update"
                    onClick={() =>
                      handleUpdateChecklist(
                        checklistDetails?.status === 'inProgress' ? 'pending' : 'inProgress',
                      )
                    }
                  />
                  <Button
                    label="Salvar"
                    borderless
                    textColor="actionBlue"
                    bgColor="transparent"
                    permToCheck="checklist:update"
                    onClick={() => handleUpdateChecklist(checklistDetails.status!)}
                  />
                </div>

                <Button
                  label="Finalizar checklist"
                  bgColor="primary"
                  permToCheck="checklist:update"
                  disable={checklistDetails?.checklistItem?.some(
                    (item) => item.status === 'pending',
                  )}
                  onClick={() => handleUpdateChecklist('completed')}
                />
              </>
            ) : (
              <Button
                label="Fechar"
                bgColor="primary"
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
