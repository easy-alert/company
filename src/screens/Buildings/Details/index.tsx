// COMPONENTS
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { icon } from '../../../assets/icons';
import { IconButton } from '../../../components/Buttons/IconButton';
import { ReturnButton } from '../../../components/Buttons/ReturnButton';
import { DotSpinLoading } from '../../../components/Loadings/DotSpinLoading';
import { NotificationTable, NotificationTableContent } from './utils/components/NotificationTable';
import { ModalEditBuilding } from './utils/modals/ModalEditBuilding';
import { Image } from '../../../components/Image';
import { PopoverButton } from '../../../components/Buttons/PopoverButton';
import { ModalCreateNotificationConfiguration } from './utils/modals/ModalCreateNotificationConfiguration';
import { ModalEditNotificationConfiguration } from './utils/modals/ModalEditNotificationConfiguration';
import { ModalAddFiles } from './utils/modals/ModalAddFiles';
import { ModalAddBanners } from './utils/modals/ModalAddBanners';
import { ImagePreview } from '../../../components/ImagePreview';

// FUNCTIONS
import {
  requestBuildingDetails,
  requestDeleteAnnex,
  requestResendEmailConfirmation,
  requestResendPhoneConfirmation,
} from './utils/functions';
import {
  applyMask,
  capitalizeFirstLetter,
  dateFormatter,
  requestBuldingTypes,
} from '../../../utils/functions';

// STYLES
import * as Style from './styles';
import { theme } from '../../../styles/theme';

// TYPES
import { IBuildingDetail, INotificationConfiguration } from './utils/types';
import { IBuildingTypes } from '../../../utils/types';

export const BuildingDetails = () => {
  const navigate = useNavigate();
  const { buildingId } = useParams();

  const phoneConfirmUrl = `${window.location.origin}/confirm/phone`;
  const emailConfirmUrl = `${window.location.origin}/confirm/email`;

  const [building, setBuilding] = useState<IBuildingDetail>();

  const [buildingTypes, setBuildingTypes] = useState<IBuildingTypes[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [deleteAnnexOnQuery, setDeleteAnnexOnQuery] = useState<boolean>(false);

  const [usedMaintenancesCount, setUsedMaintenancesCount] = useState<number>(0);

  const [totalMaintenancesCount, setTotalMaintenancesCount] = useState<number>(0);

  const [modalEditBuildingOpen, setModalEditBuildingOpen] = useState<boolean>(false);

  const [modalCreateNotificationConfigurationOpen, setModalCreateNotificationConfigurationOpen] =
    useState<boolean>(false);

  const [modalEditNotificationConfigurationOpen, setModalEditNotificationConfigurationOpen] =
    useState<boolean>(false);

  const [modalAddFilesOpen, setModalAddFilesOpen] = useState<boolean>(false);

  const [modalAddBannersOpen, setModalAddBannersOpen] = useState<boolean>(false);

  const [selectedNotificationRow, setSelectedNotificationRow] =
    useState<INotificationConfiguration>();

  useEffect(() => {
    requestBuldingTypes({ setBuildingTypes }).then(() => {
      requestBuildingDetails({
        buildingId: buildingId!,
        setLoading,
        setBuilding,
        setUsedMaintenancesCount,
        setTotalMaintenancesCount,
      });
    });
  }, []);

  return loading ? (
    <DotSpinLoading />
  ) : (
    <>
      {modalEditBuildingOpen && building && (
        <ModalEditBuilding
          setModal={setModalEditBuildingOpen}
          building={building}
          setBuilding={setBuilding}
          buildingTypes={buildingTypes}
          setTotalMaintenancesCount={setTotalMaintenancesCount}
          setUsedMaintenancesCount={setUsedMaintenancesCount}
        />
      )}

      {modalCreateNotificationConfigurationOpen && building && (
        <ModalCreateNotificationConfiguration
          setModal={setModalCreateNotificationConfigurationOpen}
          buildingId={building.id}
          setBuilding={setBuilding}
          setTotalMaintenancesCount={setTotalMaintenancesCount}
          setUsedMaintenancesCount={setUsedMaintenancesCount}
          emailConfirmUrl={emailConfirmUrl}
          phoneConfirmUrl={phoneConfirmUrl}
        />
      )}

      {modalEditNotificationConfigurationOpen && selectedNotificationRow && building && (
        <ModalEditNotificationConfiguration
          setModal={setModalEditNotificationConfigurationOpen}
          buildingId={building.id}
          setBuilding={setBuilding}
          selectedNotificationRow={selectedNotificationRow}
          setTotalMaintenancesCount={setTotalMaintenancesCount}
          setUsedMaintenancesCount={setUsedMaintenancesCount}
          emailConfirmUrl={emailConfirmUrl}
          phoneConfirmUrl={phoneConfirmUrl}
        />
      )}

      {modalAddFilesOpen && building && (
        <ModalAddFiles
          setModal={setModalAddFilesOpen}
          buildingId={building.id}
          setTotalMaintenancesCount={setTotalMaintenancesCount}
          setUsedMaintenancesCount={setUsedMaintenancesCount}
          setBuilding={setBuilding}
        />
      )}

      {modalAddBannersOpen && building && (
        <ModalAddBanners
          setModal={setModalAddBannersOpen}
          buildingId={building.id}
          setTotalMaintenancesCount={setTotalMaintenancesCount}
          setUsedMaintenancesCount={setUsedMaintenancesCount}
          setBuilding={setBuilding}
        />
      )}

      <Style.Header>
        <h2>Detalhes de edificação</h2>
        <ReturnButton path="/buildings" />
      </Style.Header>

      <Style.CardWrapper>
        <Style.Card>
          <Style.CardHeader>
            <h5>Manutenções</h5>
          </Style.CardHeader>
          <Style.MaintenanceCardFooter>
            <Style.MaintenanceCardFooterInfo>
              <h5 className="expired">0</h5>
              <p className="p5">Vencidas</p>
            </Style.MaintenanceCardFooterInfo>

            <Style.MaintenanceCardFooterInfo>
              <h5 className="pending">0</h5>
              <p className="p5">Pendentes</p>
            </Style.MaintenanceCardFooterInfo>

            <Style.MaintenanceCardFooterInfo>
              <h5 className="completed">0</h5>
              <p className="p5">Concluídas</p>
            </Style.MaintenanceCardFooterInfo>
          </Style.MaintenanceCardFooter>
        </Style.Card>

        <Style.Card>
          <Style.CardHeader>
            <h5>Dados da edificação</h5>
            <IconButton
              icon={icon.editWithBg}
              label="Editar"
              hideLabelOnMedia
              onClick={() => {
                setModalEditBuildingOpen(true);
              }}
            />
          </Style.CardHeader>
          <Style.BuildingCardWrapper>
            <Style.BuildingCardColumn>
              <Style.BuildingCardData>
                <p className="p3">Nome:</p>
                <p className="p3">{building?.name}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Tipo:</p>
                <p className="p3">
                  {building?.BuildingType.name
                    ? capitalizeFirstLetter(building.BuildingType.name)
                    : '-'}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Entrega da edificação:</p>
                <p className="p3">
                  {building?.deliveryDate ? dateFormatter(building?.deliveryDate!) : ''}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Término da garantia:</p>
                <p className="p3">
                  {building?.warrantyExpiration ? dateFormatter(building.warrantyExpiration) : '-'}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Notificar após garantia?</p>
                <p className="p3">{building?.keepNotificationAfterWarrantyEnds ? 'Sim' : 'Não'}</p>
              </Style.BuildingCardData>
            </Style.BuildingCardColumn>

            <Style.BuildingCardColumn>
              <Style.BuildingCardData>
                <p className="p3">CEP:</p>
                <p className="p3">
                  {building?.cep ? applyMask({ mask: 'CEP', value: building?.cep }).value : '-'}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Local:</p>
                <p className="p3">
                  {!building?.city && !building?.state && '-'}
                  {building?.city}
                  {building?.city && building?.state ? `, ${building?.state}` : building?.state}
                </p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Bairro:</p>
                <p className="p3">{building?.neighborhood ?? '-'}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Logradouro:</p>
                <p className="p3">{building?.streetName ?? '-'}</p>
              </Style.BuildingCardData>

              <Style.BuildingCardData>
                <p className="p3">Área:</p>
                <p className="p3">
                  {building?.area
                    ? `${applyMask({ mask: 'DEC', value: building?.area }).value} m²`
                    : '-'}
                </p>
              </Style.BuildingCardData>
            </Style.BuildingCardColumn>
          </Style.BuildingCardWrapper>
        </Style.Card>
        <Style.Card>
          <Style.CardHeader>
            <h5>Dados de notificação</h5>
            <IconButton
              icon={icon.plusWithBg}
              label="Cadastrar"
              hideLabelOnMedia
              onClick={() => {
                setModalCreateNotificationConfigurationOpen(true);
              }}
            />
          </Style.CardHeader>
          {building && building.NotificationsConfigurations.length > 0 ? (
            <NotificationTable
              colsHeader={[
                { label: 'Nome do responsável' },
                { label: 'E-mail' },
                { label: 'Função' },
                { label: 'WhatsApp' },
                { label: '' },
              ]}
            >
              {building?.NotificationsConfigurations.map((notificationRow) => (
                <NotificationTableContent
                  key={notificationRow.id}
                  onClick={() => {
                    //
                  }}
                  colsBody={[
                    {
                      cell: notificationRow.name,
                      cssProps: { width: '25%', borderBottomLeftRadius: theme.size.xxsm },
                    },
                    {
                      cell: (
                        <Style.TableDataWrapper>
                          {notificationRow.email ?? '-'}
                          {notificationRow.isMain &&
                            notificationRow.email &&
                            (notificationRow.emailIsConfirmed ? (
                              <Image img={icon.checkedNoBg} size="16px" />
                            ) : (
                              <PopoverButton
                                label="Reenviar"
                                hiddenIconButtonLabel
                                buttonIcon={icon.yellowAlert}
                                buttonIconSize="16px"
                                actionButtonBgColor={theme.color.primary}
                                type="IconButton"
                                message={{
                                  title: 'Deseja reenviar o e-mail de confirmação?',
                                  content: '',
                                  contentColor: theme.color.danger,
                                }}
                                actionButtonClick={() => {
                                  requestResendEmailConfirmation({
                                    buildingNotificationConfigurationId: notificationRow.id,
                                    link: emailConfirmUrl,
                                  });
                                }}
                              />
                            ))}
                        </Style.TableDataWrapper>
                      ),
                      cssProps: { width: '25%' },
                    },
                    { cell: notificationRow.role, cssProps: { width: '20%' } },
                    {
                      cell: (
                        <Style.TableDataWrapper>
                          {notificationRow.contactNumber
                            ? applyMask({ mask: 'TEL', value: notificationRow.contactNumber }).value
                            : '-'}

                          {notificationRow.isMain &&
                            notificationRow.contactNumber &&
                            (notificationRow.contactNumberIsConfirmed ? (
                              <Image img={icon.checkedNoBg} size="16px" />
                            ) : (
                              <PopoverButton
                                label="Reenviar"
                                hiddenIconButtonLabel
                                buttonIcon={icon.yellowAlert}
                                buttonIconSize="16px"
                                actionButtonBgColor={theme.color.primary}
                                type="IconButton"
                                message={{
                                  title: 'Deseja reenviar a mensagem de confirmação no WhatsApp?',
                                  content: '',
                                  contentColor: theme.color.danger,
                                }}
                                actionButtonClick={() => {
                                  requestResendPhoneConfirmation({
                                    buildingNotificationConfigurationId: notificationRow.id,
                                    link: phoneConfirmUrl,
                                  });
                                }}
                              />
                            ))}
                        </Style.TableDataWrapper>
                      ),
                      cssProps: { width: '20%' },
                    },
                    {
                      cell: (
                        <Style.ButtonWrapper>
                          {notificationRow.isMain && (
                            <Style.MainContactTag>
                              <p className="p5">Contato principal</p>
                            </Style.MainContactTag>
                          )}
                          <IconButton
                            size="16px"
                            icon={icon.edit}
                            label="Editar"
                            onClick={() => {
                              setSelectedNotificationRow(notificationRow);
                              setModalEditNotificationConfigurationOpen(true);
                            }}
                          />
                        </Style.ButtonWrapper>
                      ),
                      cssProps: { width: '10%', borderBottomRightRadius: theme.size.xxsm },
                    },
                  ]}
                />
              ))}
            </NotificationTable>
          ) : (
            <Style.NoDataContainer>
              <h5>Nenhum dado cadastrado.</h5>
            </Style.NoDataContainer>
          )}
        </Style.Card>
        <Style.Card>
          <Style.MaintenanceCardHeader>
            <h5>
              Manutenções a serem realizadas ({usedMaintenancesCount}/{totalMaintenancesCount})
            </h5>
            <Style.ButtonWrapper>
              <IconButton
                icon={icon.listWithBg}
                label="Visualizar"
                hideLabelOnMedia
                onClick={() => {
                  if (building?.id) {
                    navigate(`/buildings/details/${building?.id}/maintenances/list`);
                  }
                }}
              />

              <IconButton
                icon={icon.editWithBg}
                label="Editar"
                hideLabelOnMedia
                onClick={() => {
                  if (building?.id) {
                    navigate(`/buildings/details/${building?.id}/maintenances/manage`);
                  }
                }}
              />
            </Style.ButtonWrapper>
          </Style.MaintenanceCardHeader>
        </Style.Card>

        <Style.CardGrid>
          <Style.Card>
            <Style.CardHeader>
              <h5>Anexos</h5>
              <IconButton
                icon={icon.plusWithBg}
                label="Cadastrar"
                size="24px"
                hideLabelOnMedia
                onClick={() => {
                  setModalAddFilesOpen(true);
                }}
              />
            </Style.CardHeader>
            {building && building?.Annexes.length > 0 ? (
              <Style.MatrixTagWrapper>
                {building.Annexes.map((element) => (
                  <Style.Tag key={element.id}>
                    <a
                      title={element.originalName}
                      href={element.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p className="p3">{element.name}</p>
                      <Image size="16px" img={icon.download} />
                    </a>
                    <IconButton
                      disabled={deleteAnnexOnQuery}
                      size="16px"
                      icon={icon.xBlack}
                      onClick={() => {
                        requestDeleteAnnex({
                          annexeId: element.id,
                          setDeleteAnnexOnQuery,
                          buildingId: building.id,
                          setBuilding,
                          setTotalMaintenancesCount,
                          setUsedMaintenancesCount,
                        });
                      }}
                    />
                  </Style.Tag>
                ))}
              </Style.MatrixTagWrapper>
            ) : (
              <Style.NoDataContainer>
                <h5>Nenhum anexo cadastrado.</h5>
              </Style.NoDataContainer>
            )}
          </Style.Card>
          <Style.Card>
            <Style.CardHeader>
              <h5>Banners</h5>
              <IconButton
                icon={icon.plusWithBg}
                label="Cadastrar"
                size="24px"
                hideLabelOnMedia
                onClick={() => {
                  setModalAddBannersOpen(true);
                }}
              />
            </Style.CardHeader>
            {building && building?.Annexes.length > 0 ? (
              <Style.MatrixTagWrapper>
                {building.Annexes.map((element) => (
                  <ImagePreview
                    key={element.id}
                    width="164px"
                    height="167px"
                    downloadUrl={element.url}
                    src={element.url}
                    imageCustomName={element.name}
                    imageOriginalName={element.originalName}
                  />
                ))}
              </Style.MatrixTagWrapper>
            ) : (
              <Style.NoDataContainer>
                <h5>Nenhum banner cadastrado.</h5>
              </Style.NoDataContainer>
            )}
          </Style.Card>
        </Style.CardGrid>
      </Style.CardWrapper>
    </>
  );
};
