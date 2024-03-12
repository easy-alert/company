import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { Modal } from '../../../components/Modal';
import * as Style from './styles';
import { PopoverButton } from '../../../components/Buttons/PopoverButton';
import { theme } from '../../../styles/theme';
import { Api } from '../../../services/api';
import { catchHandler, dateFormatter, uploadManyFiles } from '../../../utils/functions';
import { TextArea } from '../../../components/Inputs/TextArea';
import { ImagePreview } from '../../../components/ImagePreview';
import { DragAndDropFiles } from '../../../components/DragAndDropFiles';
import { DotLoading } from '../../../components/Loadings/DotLoading';
import { Button } from '../../../components/Buttons/Button';

interface IModalChecklistDetails {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  checklistId: string;
  onThenRequest: () => Promise<void>;
}

interface IChecklistReport {
  observation: string | null;
  images: {
    name: string;
    url: string;
  }[];
}

interface IChecklist extends IChecklistReport {
  id: string;
  name: string;
  description: string | null;
  date: string;
  frequency: string | null;
  status: 'pending' | 'completed';
  building: { name: string };
  syndic: { name: string };

  resolutionDate: string | null;
}

export const ModalChecklistDetails = ({
  setModal,
  checklistId,
  onThenRequest,
}: IModalChecklistDetails) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [checklist, setChecklist] = useState<IChecklist>();
  const [onQuery, setOnQuery] = useState<boolean>(false);
  const [onImageQuery, setOnImageQuery] = useState<boolean>(false);
  const [imagesToUploadCount, setImagesToUploadCount] = useState<number>(0);
  const [checklistReport, setChecklistReport] = useState<IChecklistReport>({
    images: [],
    observation: '',
  });

  const completeChecklist = async () => {
    setOnQuery(true);

    await Api.put(`/checklists/complete`, {
      ...checklistReport,
      observation: checklistReport.observation || null,
      checklistId,
    })
      .then((res) => {
        onThenRequest();
        toast.success(res.data.ServerMessage.message);
        setModal(false);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  const updateChecklistReport = async () => {
    setOnQuery(true);

    await Api.put(`/checklists/reports`, {
      ...checklistReport,
      observation: checklistReport.observation || null,
      checklistId,
    })
      .then((res) => {
        onThenRequest();
        toast.success(res.data.ServerMessage.message);
        setModal(false);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setOnQuery(false);
      });
  };

  const findChecklistById = async () => {
    await Api.get(`/checklists/${checklistId}`)
      .then((res) => {
        setChecklist(res.data.checklist);
      })
      .catch((err) => {
        catchHandler(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    findChecklistById();
  }, []);

  return (
    <Modal title="Detalhes de checklist" setModal={setModal}>
      {loading ? (
        <Style.LoadingContainer>
          <DotSpinLoading />
        </Style.LoadingContainer>
      ) : (
        <Style.Container>
          <Style.Content>
            <Style.Row>
              <h6>Edificação</h6>
              <p className="p2">{checklist?.building.name}</p>
            </Style.Row>

            <Style.Row>
              <h6>Nome</h6>
              <p className="p2">{checklist?.name}</p>
            </Style.Row>

            <Style.Row>
              <h6>Responsável</h6>
              <p className="p2">{checklist?.syndic.name}</p>
            </Style.Row>

            <Style.Row>
              <h6>Descrição</h6>
              <pre className="p2">{checklist?.description ?? '-'}</pre>
            </Style.Row>

            <Style.Row>
              <h6>Data</h6>
              <p className="p2">{checklist?.date ? dateFormatter(checklist?.date) : '-'}</p>
            </Style.Row>

            <Style.Row>
              <h6>Periodicidade</h6>
              <p className="p2">{checklist?.frequency ? 'Sim' : 'Não'}</p>
            </Style.Row>

            {(checklist?.status === 'pending' || isEditing) && (
              <>
                <TextArea
                  label="Observação"
                  placeholder="Digite aqui"
                  maxLength={200}
                  value={checklistReport.observation || ''}
                  onChange={(e) => {
                    setChecklistReport((prevState) => {
                      const newState = { ...prevState };
                      newState.observation = e.target.value;
                      return newState;
                    });
                  }}
                />

                <Style.Row>
                  <h6>Imagens</h6>
                  <Style.FileAndImageRow>
                    <DragAndDropFiles
                      disabled={onImageQuery}
                      width="132px"
                      height="136px"
                      onlyImages
                      getAcceptedFiles={async ({ acceptedFiles }) => {
                        setImagesToUploadCount(acceptedFiles.length);
                        setOnImageQuery(true);
                        const uploadedFiles = await uploadManyFiles(acceptedFiles);
                        setOnImageQuery(false);
                        setImagesToUploadCount(0);

                        const formattedUploadedFiles = uploadedFiles.map(
                          ({ Location, originalname }) => ({
                            name: originalname,
                            url: Location,
                          }),
                        );

                        setChecklistReport((prevState) => {
                          const newState = { ...prevState };
                          newState.images = [...newState.images, ...formattedUploadedFiles];
                          return newState;
                        });
                      }}
                    />
                    {checklistReport.images.length > 0 &&
                      checklistReport.images.map((image, index) => (
                        <ImagePreview
                          key={image.url}
                          src={image.url}
                          downloadUrl={image.url}
                          imageCustomName={image.name}
                          width="132px"
                          height="136px"
                          onTrashClick={() => {
                            setChecklistReport((prevState) => {
                              const newState = { ...prevState };
                              newState.images.splice(index, 1);
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

                    {/* <p className="p2">Nenhuma imagem enviada.</p> */}
                  </Style.FileAndImageRow>
                </Style.Row>
              </>
            )}

            {checklist?.status === 'completed' && !isEditing && (
              <>
                <Style.Row>
                  <h6>Data de conclusão</h6>
                  <p className="p2">
                    {checklist.resolutionDate ? dateFormatter(checklist.resolutionDate) : '-'}
                  </p>
                </Style.Row>

                <Style.Row>
                  <h6>Observação</h6>
                  <pre className="p2">{checklist.observation || '-'}</pre>
                </Style.Row>

                <Style.Row>
                  <h6>Imagens</h6>
                  <Style.FileAndImageRow>
                    {checklist.images.length > 0 ? (
                      checklist.images.map((image) => (
                        <ImagePreview
                          key={image.url}
                          src={image.url}
                          downloadUrl={image.url}
                          imageCustomName={image.name}
                          width="132px"
                          height="136px"
                        />
                      ))
                    ) : (
                      <p className="p2">Nenhuma imagem enviada.</p>
                    )}
                  </Style.FileAndImageRow>
                </Style.Row>
              </>
            )}
          </Style.Content>

          <Style.ButtonContainer>
            {checklist?.status === 'completed' && (
              <Button
                label="Editar relato"
                loading={onQuery}
                type="button"
                onClick={() => {
                  if (!isEditing) {
                    setIsEditing(true);
                    setChecklistReport({
                      images: checklist?.images
                        ? checklist.images.map(({ url, name }) => ({
                            name,
                            url,
                          }))
                        : [],
                      observation: checklist?.observation || '',
                    });
                  } else {
                    updateChecklistReport();
                  }
                }}
              />
            )}

            {checklist?.status === 'pending' && (
              <PopoverButton
                loading={onQuery}
                disabled={onImageQuery}
                type="Button"
                label="Concluir"
                message={{
                  title: 'Deseja concluir este checklist?',
                  content: 'Atenção, essa ação não poderá ser desfeita posteriormente.',
                  contentColor: theme.color.danger,
                }}
                actionButtonClick={() => {
                  completeChecklist();
                }}
              />
            )}
          </Style.ButtonContainer>
        </Style.Container>
      )}
    </Modal>
  );
};
