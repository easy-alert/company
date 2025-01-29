// REACT
import { useEffect, useState } from 'react';

// GLOBAL COMPONENTS
import { Button } from '@components/Buttons/Button';
import { Modal } from '@components/Modal';
import { DotSpinLoading } from '@components/Loadings/DotSpinLoading';
import { Image } from '@components/Image';
import { ImagePreview } from '@components/ImagePreview';
import { LinkSupplierToMaintenanceHistory } from '@components/LinkSupplierToMaintenanceHistory';
import { MaintenanceHistoryActivities } from '@components/MaintenanceHistoryActivities';
import { ListTag } from '@components/ListTag';

// GLOBAL UTILS
import { applyMask, dateFormatter } from '@utils/functions';

// ASSETS
import { icon } from '@assets/icons';

// CUSTOM TYPES
import { IMaintenance } from '@customTypes/IMaintenance';

// COMPONENTS
import { EventTag } from '../EventTag';

// UTILS
import { requestMaintenanceDetails } from './functions';

// STYLES
import * as Style from './styles';

// TYPES
import type { IModalMaintenanceDetails } from './types';

export const ModalMaintenanceDetails = ({
  modalAdditionalInformations,
  handleModalMaintenanceDetails,
  handleModalEditReport,
}: IModalMaintenanceDetails) => {
  const [maintenance, setMaintenance] = useState<IMaintenance>({
    Building: {
      name: '',
    },
    canReport: false,
    daysInAdvance: 0,
    dueDate: '',
    id: '',
    inProgress: false,
    priorityName: '',
    Maintenance: {
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
      instructions: [],
    },
    resolutionDate: '',
    notificationDate: '',
    MaintenancesStatus: {
      name: 'pending',
    },
    MaintenanceReport: [{ cost: 0, id: '', observation: '', ReportAnnexes: [], ReportImages: [] }],
  });

  const [modalLoading, setModalLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!modalAdditionalInformations.id) return;

    requestMaintenanceDetails({
      maintenanceHistoryId: modalAdditionalInformations.id,
      setMaintenance,
      setModalLoading,
    });
  }, [maintenance.id]);

  return (
    <Modal
      bodyWidth="475px"
      title="Detalhes de manutenção"
      setModal={handleModalMaintenanceDetails}
    >
      {modalLoading ? (
        <Style.LoadingContainer>
          <DotSpinLoading />
        </Style.LoadingContainer>
      ) : (
        <Style.Container>
          <h3>{maintenance?.Building?.name}</h3>
          <Style.StatusTagWrapper>
            {maintenance.MaintenancesStatus.name === 'overdue' && <EventTag status="completed" />}

            <EventTag status={maintenance.MaintenancesStatus.name} />

            {maintenance.Maintenance.MaintenanceType?.name === 'occasional' ? (
              <EventTag status="occasional" />
            ) : (
              <EventTag status="common" />
            )}

            {/* Aqui não deve precisar da tag in progress porque quando clica na vencida ele abre sempre a modal de enviar relato */}
            {/* {(maintenance?.MaintenancesStatus.name === 'expired' ||
              maintenance?.MaintenancesStatus.name === 'pending') &&
              maintenance.inProgress &&
              !modalAdditionalInformations.isFuture && <InProgressTag />} */}
          </Style.StatusTagWrapper>
          <Style.Content>
            <Style.Row>
              <h6>Categoria</h6>
              <p className="p2">{maintenance.Maintenance.Category?.name}</p>
            </Style.Row>

            <Style.Row>
              <h6>Elemento</h6>
              <p className="p2">{maintenance.Maintenance.element}</p>
            </Style.Row>

            <Style.Row>
              <h6>Atividade</h6>
              <p className="p2">{maintenance.Maintenance.activity}</p>
            </Style.Row>

            <Style.Row>
              <h6>Responsável</h6>
              <p className="p2">{maintenance.Maintenance.responsible}</p>
            </Style.Row>

            <Style.Row>
              <h6>Fonte</h6>
              <p className="p2">{maintenance.Maintenance.source}</p>
            </Style.Row>

            <Style.Row>
              <h6>Observação da manutenção</h6>
              <p className="p2">{maintenance.Maintenance.observation ?? '-'}</p>
            </Style.Row>

            <Style.Row>
              <h6>Instruções</h6>
              <Style.FileAndImageRow>
                {(maintenance.Maintenance.instructions?.length || 0) > 0
                  ? maintenance.Maintenance.instructions?.map(({ url, name }) => (
                      <ListTag padding="4px 12px" downloadUrl={url} key={url} label={name || ''} />
                    ))
                  : '-'}
              </Style.FileAndImageRow>
            </Style.Row>

            {maintenance.Maintenance.MaintenanceType?.name !== 'occasional' && (
              <Style.Row>
                <h6>Periodicidade</h6>
                <p className="p2">
                  A cada{' '}
                  {(maintenance.Maintenance.frequency || 0) > 1
                    ? `${maintenance.Maintenance.frequency} ${maintenance.Maintenance.FrequencyTimeInterval?.pluralLabel}`
                    : `${maintenance.Maintenance.frequency} ${maintenance.Maintenance.FrequencyTimeInterval?.singularLabel}`}
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
                  <p className="p2">{dateFormatter(modalAdditionalInformations.expectedDueDate)}</p>
                </Style.Row>
              </>
            ) : (
              <>
                <Style.Row>
                  <h6>Data de notificação</h6>
                  <p className="p2">{dateFormatter(maintenance.notificationDate)}</p>
                </Style.Row>

                {maintenance.Maintenance.MaintenanceType?.name !== 'occasional' && (
                  <Style.Row>
                    <h6>Data de vencimento</h6>
                    <p className="p2">{dateFormatter(maintenance.dueDate)}</p>
                  </Style.Row>
                )}
              </>
            )}

            {maintenance.resolutionDate && (
              <Style.Row>
                <h6>Data de conclusão</h6>
                <p className="p2">{dateFormatter(maintenance.resolutionDate)}</p>
              </Style.Row>
            )}

            {!!maintenance.daysInAdvance && (
              <Style.Row>
                <h6>Dias antecipados</h6>
                <p className="p2">{maintenance.daysInAdvance}</p>
              </Style.Row>
            )}

            <Style.Row>
              <h6>Info. Adicional</h6>
              <p className="p2">{maintenance.additionalInfo}</p>
            </Style.Row>

            {!modalAdditionalInformations.isFuture && (
              <>
                <LinkSupplierToMaintenanceHistory maintenanceHistoryId={maintenance.id} />
                <MaintenanceHistoryActivities maintenanceHistoryId={maintenance.id} />
              </>
            )}

            {maintenance.MaintenanceReport.length > 0 && (
              <>
                <Style.Row>
                  <h6>Custo</h6>
                  <p className="p2">
                    {
                      applyMask({
                        mask: 'BRL',
                        value: String(maintenance.MaintenanceReport[0].cost),
                      }).value
                    }
                  </p>
                </Style.Row>
                {/*
                <Style.Row>
                  <h6>Observação do relato</h6>
                  <pre className="p2">{maintenance.MaintenanceReport[0].observation ?? '-'}</pre>
                </Style.Row> */}

                <Style.FileStyleRow>
                  <h6>Anexos</h6>
                  <Style.FileAndImageRow>
                    {(maintenance.MaintenanceReport[0].ReportAnnexes?.length || 0) > 0 ? (
                      maintenance.MaintenanceReport[0].ReportAnnexes?.map((annex) => (
                        <Style.Tag key={annex.url}>
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
                    {(maintenance.MaintenanceReport[0].ReportImages?.length || 0) > 0 ? (
                      maintenance.MaintenanceReport[0].ReportImages?.map((image) => (
                        <ImagePreview
                          key={image.url}
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
              </>
            )}
          </Style.Content>

          <Style.ButtonContainer>
            {maintenance.MaintenanceReport.length > 0 && (
              <Button
                label="Editar relato"
                onClick={() => {
                  handleModalEditReport(true);
                  handleModalMaintenanceDetails(false);
                }}
              />
            )}

            <Button
              label="Fechar"
              borderless={maintenance.MaintenanceReport.length > 0}
              onClick={() => {
                handleModalMaintenanceDetails(false);
              }}
            />
          </Style.ButtonContainer>
        </Style.Container>
      )}
    </Modal>
  );
};
