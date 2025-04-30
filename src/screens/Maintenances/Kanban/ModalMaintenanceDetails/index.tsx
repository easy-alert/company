// REACT
import { useEffect, useState } from 'react';

// COMPONENTS
import { EventTag } from '@components/EventTag';
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Image } from '@components/Image';
import { ListTag } from '@components/ListTag';
import { ImagePreview } from '@components/ImagePreview';
import { InProgressTag } from '@components/InProgressTag';
import { LinkSupplierToMaintenanceHistory } from '@components/LinkSupplierToMaintenanceHistory';
import { MaintenanceHistoryActivities } from '@components/MaintenanceHistoryActivities';
import UserResponsible from '@components/UserResponsible';
import { ModalEditMaintenanceHistory } from '@components/ModalEditMaintenanceHistory';

// GLOBAL UTILS
import { applyMask, dateFormatter } from '@utils/functions';

// GLOBAL ASSETS
import { icon } from '@assets/icons';

// UTILS
import { requestMaintenanceDetails } from '../functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IModalMaintenanceDetails } from './types';
import type { IMaintenance } from '../types';

export const ModalMaintenanceDetails = ({
  modalAdditionalInformations,
  userId,
  handleModals,
  handleRefresh,
}: IModalMaintenanceDetails) => {
  const [modalLoading, setModalLoading] = useState<boolean>(true);

  // MODAL DETALHE DE MANUTENÇÃO
  const [maintenanceDetails, setMaintenanceDetails] = useState<IMaintenance>({
    Building: {
      name: '',
      guestCanCompleteMaintenance: false,
    },
    canReport: false,
    daysInAdvance: 0,
    dueDate: '',
    id: '',
    inProgress: false,
    Maintenance: {
      instructions: [],
      activity: '',
      Category: {
        name: '',
      },
      element: '',
      frequency: 0,
      FrequencyTimeInterval: {
        pluralLabel: '',
        singularLabel: '',
      },
      MaintenanceType: {
        name: '',
      },
      observation: '',
      responsible: '',
      source: '',
    },
    resolutionDate: '',
    notificationDate: '',
    MaintenancesStatus: {
      name: 'pending',
    },
    MaintenanceReport: [{ cost: 0, id: '', observation: '', ReportAnnexes: [], ReportImages: [] }],
    MaintenanceReportProgress: [
      { cost: 0, id: '', observation: '', ReportAnnexesProgress: [], ReportImagesProgress: [] },
    ],
  });

  const [maintenanceReport, setMaintenanceReport] = useState<IMaintenance['MaintenanceReport'][0]>({
    id: '',
    cost: 0,
    observation: '',
    ReportAnnexes: [],
    ReportImages: [],
  });

  const [modalEditMaintenanceHistory, setModalEditMaintenanceHistory] = useState<boolean>(false);

  const handleEditModal = (modalState: boolean) => {
    setModalEditMaintenanceHistory(modalState);
  };

  const handleMaintenanceReport = (maintenance: IMaintenance) => {
    const formattedId =
      maintenance?.MaintenanceReport[0]?.id || maintenance?.MaintenanceReportProgress[0]?.id;

    const formattedObservation =
      maintenance?.MaintenanceReport[0]?.observation ||
      maintenance?.MaintenanceReportProgress[0]?.observation;

    const formattedCost =
      maintenance?.MaintenanceReport[0]?.cost || maintenance.MaintenanceReportProgress[0]?.cost;

    const formattedImages =
      maintenance?.MaintenanceReport[0]?.ReportImages ||
      maintenance?.MaintenanceReportProgress[0]?.ReportImagesProgress;

    const formattedAnnexes =
      maintenance?.MaintenanceReport[0]?.ReportAnnexes ||
      maintenance?.MaintenanceReportProgress[0]?.ReportAnnexesProgress;

    setMaintenanceReport({
      id: formattedId,
      observation: formattedObservation,
      cost: formattedCost,
      ReportImages: formattedImages,
      ReportAnnexes: formattedAnnexes,
    });
  };

  const handleGetMaintenanceDetails = async () => {
    try {
      const responseData = await requestMaintenanceDetails({
        maintenanceHistoryId: modalAdditionalInformations.id,
      });

      setMaintenanceDetails(responseData);
      handleMaintenanceReport(responseData);
    } finally {
      setTimeout(() => {
        setModalLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    handleGetMaintenanceDetails();
  }, []);

  return (
    <>
      {modalEditMaintenanceHistory && (
        <ModalEditMaintenanceHistory
          userId={userId}
          maintenance={maintenanceDetails}
          handleEditModal={handleEditModal}
          handleRefresh={handleRefresh}
        />
      )}

      <Modal
        bodyWidth="475px"
        title="Detalhes de manutenção"
        setModal={(modalState) => handleModals('modalMaintenanceDetails', modalState)}
        handleEdit={() => handleEditModal(true)}
      >
        {modalLoading ? (
          <Style.LoadingContainer>
            <DotSpinLoading />
          </Style.LoadingContainer>
        ) : (
          <Style.Container>
            <h3>{maintenanceDetails?.Building.name}</h3>
            <Style.StatusTagWrapper>
              {maintenanceDetails.MaintenancesStatus.name === 'overdue' && (
                <EventTag status="completed" />
              )}

              <EventTag status={maintenanceDetails?.MaintenancesStatus.name} />

              <EventTag
                status={
                  maintenanceDetails?.Maintenance.MaintenanceType.name === 'occasional'
                    ? 'occasional'
                    : 'common'
                }
              />

              {(maintenanceDetails?.MaintenancesStatus.name === 'expired' ||
                maintenanceDetails?.MaintenancesStatus.name === 'pending') &&
                maintenanceDetails.inProgress &&
                !modalAdditionalInformations.isFuture && <InProgressTag />}
            </Style.StatusTagWrapper>

            <Style.Content>
              <Style.Row>
                <h6>Categoria</h6>
                <p className="p2">{maintenanceDetails.Maintenance.Category.name}</p>
              </Style.Row>

              <Style.Row>
                <h6>Elemento</h6>
                <p className="p2">{maintenanceDetails.Maintenance.element}</p>
              </Style.Row>

              <Style.Row>
                <h6>Atividade</h6>
                <p className="p2">{maintenanceDetails.Maintenance.activity}</p>
              </Style.Row>

              <Style.Row>
                <h6>Responsável</h6>
                <p className="p2">{maintenanceDetails.Maintenance.responsible}</p>
              </Style.Row>

              <Style.Row>
                <h6>Fonte</h6>
                <p className="p2">{maintenanceDetails.Maintenance.source}</p>
              </Style.Row>

              <Style.Row>
                <h6>Observação da manutenção</h6>
                <p className="p2">{maintenanceDetails.Maintenance.observation ?? '-'}</p>
              </Style.Row>

              <Style.Row>
                <h6>Instruções</h6>
                <Style.FileAndImageRow>
                  {maintenanceDetails.Maintenance.instructions.length > 0
                    ? maintenanceDetails.Maintenance.instructions.map(({ url, name }) => (
                        <ListTag padding="4px 12px" downloadUrl={url} key={url} label={name} />
                      ))
                    : '-'}
                </Style.FileAndImageRow>
              </Style.Row>

              {maintenanceDetails.Maintenance.MaintenanceType.name !== 'occasional' && (
                <Style.Row>
                  <h6>Periodicidade</h6>
                  <p className="p2">
                    A cada{' '}
                    {maintenanceDetails.Maintenance.frequency > 1
                      ? `${maintenanceDetails.Maintenance.frequency} ${maintenanceDetails.Maintenance.FrequencyTimeInterval.pluralLabel}`
                      : `${maintenanceDetails.Maintenance.frequency} ${maintenanceDetails.Maintenance.FrequencyTimeInterval.singularLabel}`}
                  </p>
                </Style.Row>
              )}

              {modalAdditionalInformations.isFuture ? (
                <>
                  <Style.Row>
                    <h6>Data de notificação prevista</h6>
                    <p className="p2">
                      {dateFormatter(modalAdditionalInformations.expectedNotificationDate)}
                    </p>
                  </Style.Row>

                  <Style.Row>
                    <h6>Data de vencimento prevista</h6>
                    <p className="p2">
                      {dateFormatter(modalAdditionalInformations.expectedDueDate)}
                    </p>
                  </Style.Row>
                </>
              ) : (
                <>
                  <Style.Row>
                    <h6>Data de notificação</h6>
                    <p className="p2">{dateFormatter(maintenanceDetails.notificationDate)}</p>
                  </Style.Row>

                  {maintenanceDetails.Maintenance.MaintenanceType.name !== 'occasional' && (
                    <Style.Row>
                      <h6>Data de vencimento</h6>
                      <p className="p2">{dateFormatter(maintenanceDetails.dueDate)}</p>
                    </Style.Row>
                  )}
                </>
              )}

              {maintenanceDetails.resolutionDate && (
                <Style.Row>
                  <h6>Data de conclusão</h6>
                  <p className="p2">{dateFormatter(maintenanceDetails.resolutionDate)}</p>
                </Style.Row>
              )}

              {!!maintenanceDetails.daysInAdvance && (
                <Style.Row>
                  <h6>Dias antecipados</h6>
                  <p className="p2">{maintenanceDetails.daysInAdvance}</p>
                </Style.Row>
              )}

              {maintenanceDetails.additionalInfo && (
                <Style.Row>
                  <h6>Info. Adicional</h6>
                  <p className="p2">{maintenanceDetails.additionalInfo}</p>
                </Style.Row>
              )}

              {maintenanceDetails?.Users && maintenanceDetails?.Users?.length > 0 && (
                <UserResponsible
                  users={maintenanceDetails.Users.map(({ User }) => ({
                    ...User,
                  }))}
                />
              )}

              {!modalAdditionalInformations.isFuture && (
                <>
                  <LinkSupplierToMaintenanceHistory maintenanceHistoryId={maintenanceDetails.id} />
                  <MaintenanceHistoryActivities maintenanceHistoryId={maintenanceDetails.id} />
                </>
              )}

              <Style.Row>
                <h6>Custo</h6>

                <p className="p2">
                  {
                    applyMask({
                      mask: 'BRL',
                      value: String(maintenanceReport?.cost),
                    }).value
                  }
                </p>
              </Style.Row>

              <Style.FileStyleRow>
                <h6>Anexos</h6>

                <Style.FileAndImageRow>
                  {maintenanceReport.ReportAnnexes?.length > 0 ? (
                    maintenanceReport.ReportAnnexes.map((annex) => (
                      <Style.Tag key={annex.originalName}>
                        <a
                          title={annex.originalName}
                          href={annex.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                        >
                          <p className="p3">{annex.name}</p>
                          <Image size="16px" img={icon.download} />
                        </a>
                      </Style.Tag>
                    ))
                  ) : (
                    <p className="p2">Nenhum anexo enviado.</p>
                  )}
                </Style.FileAndImageRow>
              </Style.FileStyleRow>

              <Style.FileStyleRow>
                <h6>Imagens</h6>

                <Style.FileAndImageRow>
                  {maintenanceReport.ReportImages?.length > 0 ? (
                    maintenanceReport.ReportImages.map((image) => (
                      <ImagePreview
                        key={image.originalName}
                        src={image.url}
                        downloadUrl={image.url}
                        imageCustomName={image.name}
                        width="97px"
                        height="97px"
                      />
                    ))
                  ) : (
                    <p className="p2">Nenhuma imagem enviada.</p>
                  )}
                </Style.FileAndImageRow>
              </Style.FileStyleRow>
            </Style.Content>

            <Button
              bgColor="primary"
              label="Fechar"
              center
              onClick={() => handleModals('modalMaintenanceDetails', false)}
            />
          </Style.Container>
        )}
      </Modal>
    </>
  );
};
